<?php
/**
 * Plugin Name: Pop Series API
 * Plugin URI:  https://www.popseries.co/
 * Description: Lightweight REST endpoints (namespace popseries/v1) that mirror the
 *              shape of the WP REST API the Pop Series frontend already consumes,
 *              but powered by WP_Query and with the essential data (featured image,
 *              author, tags) baked in — no `_embed` round-trip and no heavy payload.
 * Version:     1.0.0
 * Author:      Pop Series
 * License:     GPL-2.0-or-later
 * Text Domain: popseries-api
 *
 * Why this plugin:
 *   The frontend (src/lib/api.ts) normalizes every post down to a handful of fields:
 *   id, slug, title, excerpt, content (single view only), date, author (name/slug/
 *   avatar), featured image, categories[], tags[], link. The stock /wp/v2 routes ship
 *   far more than that and require `_embed` (extra joins) to attach the image/author/
 *   terms. These routes return *exactly* what the frontend reads and nothing else.
 *
 * Endpoints (all GET, all public):
 *   /wp-json/popseries/v1/posts            list + single (?slug=) + paging headers
 *   /wp-json/popseries/v1/users            author lookup (?slug=)
 *   /wp-json/popseries/v1/tags             tag cloud (orderby=count) + single (?slug=)
 *   /wp-json/popseries/v1/popular-posts    most-viewed (WP_Query by views meta)
 *
 * To point the frontend here, change in src/lib/api.ts:
 *   API_BASE = "https://www.popseries.co/wp-json/popseries/v1"
 *   WPP_BASE = "https://www.popseries.co/wp-json/popseries/v1"
 *   (the query-param names are intentionally identical to the old API.)
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

/**
 * Image renditions worth shipping. The frontend's pickImage() prefers the original
 * (source_url) and only falls back to these named sizes, so we keep the list short.
 */
function popseries_image_size_whitelist() {
	return apply_filters(
		'popseries_image_sizes',
		array( 'full', '2048x2048', '1536x1536', 'large', 'medium_large', 'medium' )
	);
}

/**
 * Build the `wp:featuredmedia` entry for a post, matching the WPMedia type.
 *
 * @param int $post_id
 * @return array|null  Null when the post has no featured image.
 */
function popseries_featured_media( $post_id ) {
	$thumb_id = get_post_thumbnail_id( $post_id );
	if ( ! $thumb_id ) {
		return null;
	}

	$source_url = wp_get_attachment_image_url( $thumb_id, 'full' );
	$meta       = wp_get_attachment_metadata( $thumb_id );

	$media_details = array();
	if ( is_array( $meta ) ) {
		if ( ! empty( $meta['width'] ) ) {
			$media_details['width'] = (int) $meta['width'];
		}
		if ( ! empty( $meta['height'] ) ) {
			$media_details['height'] = (int) $meta['height'];
		}

		if ( ! empty( $meta['sizes'] ) && is_array( $meta['sizes'] ) ) {
			$whitelist = popseries_image_size_whitelist();
			$sizes     = array();
			foreach ( $meta['sizes'] as $size_name => $size ) {
				if ( ! in_array( $size_name, $whitelist, true ) ) {
					continue;
				}
				$src = wp_get_attachment_image_src( $thumb_id, $size_name );
				if ( $src ) {
					$sizes[ $size_name ] = array(
						'source_url' => $src[0],
						'width'      => (int) $src[1],
						'height'     => (int) $src[2],
					);
				}
			}
			// Expose the original under the conventional "full" key too.
			if ( $source_url && empty( $sizes['full'] ) ) {
				$sizes['full'] = array(
					'source_url' => $source_url,
					'width'      => isset( $media_details['width'] ) ? $media_details['width'] : 0,
					'height'     => isset( $media_details['height'] ) ? $media_details['height'] : 0,
				);
			}
			if ( $sizes ) {
				$media_details['sizes'] = $sizes;
			}
		}
	}

	return array(
		'id'            => (int) $thumb_id,
		'source_url'    => $source_url ? $source_url : '',
		'alt_text'      => (string) get_post_meta( $thumb_id, '_wp_attachment_image_alt', true ),
		'media_details' => $media_details,
	);
}

/**
 * Build the embedded author entry (WPAuthor type).
 *
 * @param int $author_id
 * @return array
 */
function popseries_author_entry( $author_id ) {
	return array(
		'id'          => (int) $author_id,
		'name'        => get_the_author_meta( 'display_name', $author_id ),
		'slug'        => get_the_author_meta( 'user_nicename', $author_id ),
		'description' => get_the_author_meta( 'description', $author_id ),
		'avatar_urls' => array(
			'48' => get_avatar_url( $author_id, array( 'size' => 48 ) ),
			'96' => get_avatar_url( $author_id, array( 'size' => 96 ) ),
		),
	);
}

/**
 * Build the `wp:term` groups (categories then tags), matching WPTerm[][].
 * The frontend only reads post_tag terms, but we include categories for parity.
 *
 * @param int $post_id
 * @return array
 */
function popseries_term_groups( $post_id ) {
	$map = function ( $term ) {
		return array(
			'id'       => (int) $term->term_id,
			'name'     => $term->name,
			'slug'     => $term->slug,
			'taxonomy' => $term->taxonomy,
		);
	};

	$categories = get_the_terms( $post_id, 'category' );
	$tags       = get_the_terms( $post_id, 'post_tag' );

	return array(
		is_array( $categories ) ? array_map( $map, $categories ) : array(),
		is_array( $tags ) ? array_map( $map, $tags ) : array(),
	);
}

/**
 * Format a WP_Post into the WPPost shape the frontend's normalizePost() expects.
 *
 * Content is heavy and only the single-article view reads it, so it is omitted
 * (empty string) for list responses and included only when $with_content is true.
 *
 * @param WP_Post $post
 * @param bool    $with_content
 * @return array
 */
function popseries_format_post( $post, $with_content = false ) {
	$id = $post->ID;

	// setup_postdata so the_content / get_the_excerpt resolve shortcodes correctly.
	$GLOBALS['post'] = $post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride
	setup_postdata( $post );

	$content = '';
	if ( $with_content ) {
		$content = apply_filters( 'the_content', $post->post_content );
		$content = str_replace( ']]>', ']]&gt;', $content );
	}

	$featured = popseries_featured_media( $id );

	$data = array(
		'id'         => (int) $id,
		'slug'       => $post->post_name,
		'date'       => mysql2date( 'Y-m-d\TH:i:s', $post->post_date, false ),
		'modified'   => mysql2date( 'Y-m-d\TH:i:s', $post->post_modified, false ),
		'link'       => get_permalink( $id ),
		'title'      => array( 'rendered' => get_the_title( $id ) ),
		'excerpt'    => array( 'rendered' => apply_filters( 'get_the_excerpt', get_the_excerpt( $post ), $post ) ),
		'content'    => array( 'rendered' => $content ),
		'categories' => array_map( 'intval', wp_get_post_categories( $id ) ),
		'tags'       => array_map( 'intval', wp_get_post_tags( $id, array( 'fields' => 'ids' ) ) ),
		'_embedded'  => array(
			'author'   => array( popseries_author_entry( $post->post_author ) ),
			'wp:term'  => popseries_term_groups( $id ),
		),
	);

	// Only attach featured media when one exists (mirrors _embed behaviour).
	if ( $featured ) {
		$data['_embedded']['wp:featuredmedia'] = array( $featured );
	}

	// Yoast SEO head (og:*, twitter, canonical, description…) — only on single
	// fetches, where the frontend builds page metadata. Keeps lists light.
	if ( $with_content ) {
		$yoast = popseries_yoast_head_json( $id );
		if ( $yoast ) {
			$data['yoast_head_json'] = $yoast;
		}
	}

	return $data;
}

/**
 * Yoast SEO's rendered head as structured JSON (the same shape Yoast adds to
 * the stock REST API under `yoast_head_json`). Null when Yoast is inactive.
 *
 * @param int $post_id
 * @return array|null
 */
function popseries_yoast_head_json( $post_id ) {
	if ( ! function_exists( 'YoastSEO' ) ) {
		return null;
	}
	try {
		$meta = YoastSEO()->meta->for_post( $post_id );
		if ( ! $meta ) {
			return null;
		}
		$head = $meta->get_head();
		if ( is_object( $head ) && isset( $head->json ) ) {
			return $head->json;
		}
		if ( is_array( $head ) && isset( $head['json'] ) ) {
			return $head['json'];
		}
	} catch ( \Throwable $e ) {
		return null;
	}
	return null;
}

/**
 * GET /popseries/v1/posts
 * Mirrors /wp/v2/posts: per_page, page, offset, categories, tags, author,
 * exclude, search, slug. Sends X-WP-Total / X-WP-TotalPages headers.
 */
function popseries_route_posts( WP_REST_Request $request ) {
	$per_page = min( 100, max( 1, (int) $request->get_param( 'per_page' ) ?: 10 ) );
	$page     = max( 1, (int) $request->get_param( 'page' ) ?: 1 );
	$slug     = $request->get_param( 'slug' );

	$args = array(
		'post_type'           => 'post',
		'post_status'         => 'publish',
		'posts_per_page'      => $per_page,
		'ignore_sticky_posts' => true,
		'no_found_rows'       => false,
	);

	$offset = $request->get_param( 'offset' );
	if ( null !== $offset && '' !== $offset ) {
		$args['offset'] = (int) $offset;
	} else {
		$args['paged'] = $page;
	}

	if ( $slug ) {
		$args['name']           = sanitize_title( $slug );
		$args['posts_per_page'] = 1;
		unset( $args['offset'], $args['paged'] );
	}

	$categories = popseries_parse_ids( $request->get_param( 'categories' ) );
	if ( $categories ) {
		$args['category__in'] = $categories;
	}
	$tags = popseries_parse_ids( $request->get_param( 'tags' ) );
	if ( $tags ) {
		$args['tag__in'] = $tags;
	}
	$author = popseries_parse_ids( $request->get_param( 'author' ) );
	if ( $author ) {
		$args['author__in'] = $author;
	}
	$exclude = popseries_parse_ids( $request->get_param( 'exclude' ) );
	if ( $exclude ) {
		$args['post__not_in'] = $exclude;
	}
	$search = $request->get_param( 'search' );
	if ( $search ) {
		$args['s'] = sanitize_text_field( $search );
	}

	$with_content = (bool) $slug; // Full content only on single-article fetches.

	$query = new WP_Query( $args );
	$items = array();
	foreach ( $query->posts as $post ) {
		$items[] = popseries_format_post( $post, $with_content );
	}
	wp_reset_postdata();

	$total       = (int) $query->found_posts;
	$total_pages = $per_page > 0 ? (int) ceil( $total / $per_page ) : 0;

	$response = new WP_REST_Response( $items );
	$response->header( 'X-WP-Total', $total );
	$response->header( 'X-WP-TotalPages', $total_pages );
	return $response;
}

/**
 * GET /popseries/v1/users
 * Mirrors /wp/v2/users — the frontend only ever looks an author up by slug.
 */
function popseries_route_users( WP_REST_Request $request ) {
	$slug     = $request->get_param( 'slug' );
	$per_page = min( 100, max( 1, (int) $request->get_param( 'per_page' ) ?: 10 ) );

	$query_args = array(
		'number'      => $per_page,
		'has_published_posts' => array( 'post' ),
		'fields'      => array( 'ID' ),
	);
	if ( $slug ) {
		$query_args['nicename'] = sanitize_title( $slug );
		$query_args['number']   = 1;
	}

	$user_query = new WP_User_Query( $query_args );
	$items      = array();
	foreach ( (array) $user_query->get_results() as $user ) {
		$items[] = popseries_author_entry( is_object( $user ) ? $user->ID : $user );
	}

	return new WP_REST_Response( $items );
}

/**
 * GET /popseries/v1/tags
 * Mirrors /wp/v2/tags: per_page, orderby, order, slug. Returns PopularTag shape.
 */
function popseries_route_tags( WP_REST_Request $request ) {
	$per_page = min( 100, max( 1, (int) $request->get_param( 'per_page' ) ?: 18 ) );
	$orderby  = $request->get_param( 'orderby' ) ?: 'name';
	$order    = strtoupper( $request->get_param( 'order' ) ?: 'ASC' );
	$slug     = $request->get_param( 'slug' );

	$args = array(
		'taxonomy'   => 'post_tag',
		'orderby'    => in_array( $orderby, array( 'count', 'name', 'slug', 'term_id' ), true ) ? $orderby : 'name',
		'order'      => 'DESC' === $order ? 'DESC' : 'ASC',
		'number'     => $per_page,
		'hide_empty' => true,
	);
	if ( $slug ) {
		$args['slug']       = sanitize_title( $slug );
		$args['hide_empty'] = false;
		unset( $args['number'] );
	}

	$terms = get_terms( $args );
	$items = array();
	if ( ! is_wp_error( $terms ) ) {
		foreach ( $terms as $term ) {
			$items[] = array(
				'id'    => (int) $term->term_id,
				'name'  => $term->name,
				'slug'  => $term->slug,
				'count' => (int) $term->count,
			);
		}
	}

	return new WP_REST_Response( $items );
}

/**
 * GET /popseries/v1/popular-posts
 * Mirrors the WordPress Popular Posts route: limit, range, exclude.
 *
 * Ranking source order:
 *   1. `popseries_popular_post_ids` filter — return an ordered array of post IDs
 *      to plug in an external source (e.g. the WordPress Popular Posts tables).
 *   2. A views meta key (default `wpp_total_views`, filterable) ordered via WP_Query.
 *   3. Fallback to comment_count then date when no view data exists.
 */
function popseries_route_popular( WP_REST_Request $request ) {
	$limit = min( 50, max( 1, (int) $request->get_param( 'limit' ) ?: 5 ) );
	$range = $request->get_param( 'range' ) ?: 'last7days';

	$args = array(
		'post_type'           => 'post',
		'post_status'         => 'publish',
		'posts_per_page'      => $limit,
		'ignore_sticky_posts' => true,
		'no_found_rows'       => true,
	);

	$exclude = popseries_parse_ids( $request->get_param( 'exclude' ) );
	if ( $exclude ) {
		$args['post__not_in'] = $exclude;
	}

	$range_days = array(
		'last24hours' => 1,
		'last7days'   => 7,
		'last30days'  => 30,
	);
	if ( isset( $range_days[ $range ] ) ) {
		$args['date_query'] = array(
			array( 'after' => $range_days[ $range ] . ' days ago' ),
		);
	}

	// (1) External ranking source (filter override), then the WordPress Popular
	// Posts plugin if it is active.
	$ranked_ids = apply_filters( 'popseries_popular_post_ids', null, $range, $limit, $exclude );
	if ( null === $ranked_ids ) {
		$ranked_ids = popseries_wpp_popular_ids( $range, $limit, $exclude );
	}

	if ( is_array( $ranked_ids ) ) {
		if ( empty( $ranked_ids ) ) {
			return new WP_REST_Response( array() );
		}
		$args['post__in'] = array_map( 'intval', $ranked_ids );
		$args['orderby']  = 'post__in';
		unset( $args['date_query'] ); // The source already applied the range.
		$query = new WP_Query( $args );
	} else {
		// (2) Views meta ordering.
		$meta_key   = apply_filters( 'popseries_views_meta_key', 'wpp_total_views' );
		$meta_args  = $args;
		$meta_args['meta_key'] = $meta_key; // phpcs:ignore WordPress.DB.SlowDBQuery
		$meta_args['orderby']  = 'meta_value_num';
		$meta_args['order']    = 'DESC';
		$query = new WP_Query( $meta_args );

		// (3) Fallback when no post carries the views meta yet.
		if ( ! $query->have_posts() ) {
			$args['orderby'] = array(
				'comment_count' => 'DESC',
				'date'          => 'DESC',
			);
			$query = new WP_Query( $args );
		}
	}

	$items = array();
	foreach ( $query->posts as $post ) {
		$items[] = popseries_format_post( $post, false );
	}
	wp_reset_postdata();

	return new WP_REST_Response( $items );
}

/**
 * Ordered popular post IDs from the WordPress Popular Posts plugin, for a given
 * range. Runs WPP's own REST route in-process (no outbound HTTP) so we inherit
 * its real view counts, then reformat through WP_Query into our payload shape.
 *
 * @param string $range    last24hours | last7days | last30days | all
 * @param int    $limit
 * @param int[]  $exclude
 * @return int[]|null  Null when WPP is inactive or has no data (caller falls back).
 */
function popseries_wpp_popular_ids( $range, $limit, $exclude ) {
	if ( ! function_exists( 'rest_do_request' ) ) {
		return null;
	}
	$routes = rest_get_server()->get_routes();
	if ( ! isset( $routes['/wordpress-popular-posts/v1/popular-posts'] ) ) {
		return null; // WPP not installed/active.
	}

	$exclude = (array) $exclude;
	$request = new WP_REST_Request( 'GET', '/wordpress-popular-posts/v1/popular-posts' );
	// Over-fetch to leave room for excluded IDs, then trim.
	$request->set_query_params(
		array(
			'limit' => $limit + count( $exclude ),
			'range' => $range,
		)
	);

	$response = rest_do_request( $request );
	if ( is_wp_error( $response ) || $response->is_error() ) {
		return null;
	}

	$ids = array();
	foreach ( (array) $response->get_data() as $item ) {
		$id = 0;
		if ( is_array( $item ) && isset( $item['id'] ) ) {
			$id = (int) $item['id'];
		} elseif ( is_object( $item ) && isset( $item->id ) ) {
			$id = (int) $item->id;
		}
		if ( $id && ! in_array( $id, $exclude, true ) ) {
			$ids[] = $id;
		}
	}

	return $ids ? array_slice( $ids, 0, $limit ) : null;
}

/**
 * Parse a comma-separated list (or array) of IDs into a clean int array.
 *
 * @param mixed $value
 * @return int[]
 */
function popseries_parse_ids( $value ) {
	if ( empty( $value ) ) {
		return array();
	}
	if ( is_array( $value ) ) {
		return array_values( array_filter( array_map( 'intval', $value ) ) );
	}
	return wp_parse_id_list( $value );
}

/**
 * Register all routes under the popseries/v1 namespace.
 */
function popseries_register_routes() {
	$ns       = 'popseries/v1';
	$readable = WP_REST_Server::READABLE; // GET

	register_rest_route(
		$ns,
		'/posts',
		array(
			'methods'             => $readable,
			'callback'            => 'popseries_route_posts',
			'permission_callback' => '__return_true',
			'args'                => array(
				'per_page'   => array( 'type' => 'integer' ),
				'page'       => array( 'type' => 'integer' ),
				'offset'     => array( 'type' => 'integer' ),
				'categories' => array( 'type' => 'string' ),
				'tags'       => array( 'type' => 'string' ),
				'author'     => array( 'type' => 'string' ),
				'exclude'    => array( 'type' => 'string' ),
				'search'     => array( 'type' => 'string' ),
				'slug'       => array( 'type' => 'string' ),
			),
		)
	);

	register_rest_route(
		$ns,
		'/users',
		array(
			'methods'             => $readable,
			'callback'            => 'popseries_route_users',
			'permission_callback' => '__return_true',
			'args'                => array(
				'slug'     => array( 'type' => 'string' ),
				'per_page' => array( 'type' => 'integer' ),
			),
		)
	);

	register_rest_route(
		$ns,
		'/tags',
		array(
			'methods'             => $readable,
			'callback'            => 'popseries_route_tags',
			'permission_callback' => '__return_true',
			'args'                => array(
				'per_page' => array( 'type' => 'integer' ),
				'orderby'  => array( 'type' => 'string' ),
				'order'    => array( 'type' => 'string' ),
				'slug'     => array( 'type' => 'string' ),
			),
		)
	);

	register_rest_route(
		$ns,
		'/popular-posts',
		array(
			'methods'             => $readable,
			'callback'            => 'popseries_route_popular',
			'permission_callback' => '__return_true',
			'args'                => array(
				'limit'   => array( 'type' => 'integer' ),
				'range'   => array( 'type' => 'string' ),
				'exclude' => array( 'type' => 'string' ),
			),
		)
	);
}
add_action( 'rest_api_init', 'popseries_register_routes' );

/**
 * Editorial curation: REST routes for the homepage Slider / Series On Air,
 * plus the WP-admin picker page. Required after the helpers above so that
 * popseries_format_post() is available to the curation module.
 */
require_once plugin_dir_path( __FILE__ ) . 'includes/curation.php';
// Revalidation hooks must load everywhere (front, admin, cron) so save_post
// and status transitions always ping the frontend.
require_once plugin_dir_path( __FILE__ ) . 'includes/revalidate.php';
if ( is_admin() ) {
	require_once plugin_dir_path( __FILE__ ) . 'includes/admin.php';
}
