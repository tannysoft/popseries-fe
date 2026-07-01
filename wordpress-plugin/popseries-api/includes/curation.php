<?php
/**
 * Editorial curation — homepage Slider and Series "On Air" (กำลังออนแอร์).
 *
 * Editors pick specific posts in the WP admin (see admin.php); the selections
 * are stored as ordered arrays of post IDs and exposed to the frontend through
 * two REST routes that reuse popseries_format_post() (so they carry the same
 * thumbnail/author/tags payload as /posts).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const POPSERIES_SLIDER_OPTION = 'popseries_slider_ids';
const POPSERIES_ON_AIR_OPTION = 'popseries_on_air_ids';

/**
 * Category the "On Air" picker is scoped to (Series). Matches CATEGORIES in
 * the frontend (src/lib/categories.ts). Filterable in case the ID differs.
 */
function popseries_series_category_id() {
	return (int) apply_filters( 'popseries_series_category_id', 4 );
}

/**
 * Read a curated, ordered list of post IDs from an option.
 *
 * @param string $option
 * @return int[]
 */
function popseries_get_curated_ids( $option ) {
	$ids = get_option( $option, array() );
	if ( ! is_array( $ids ) ) {
		$ids = array();
	}
	return array_values( array_filter( array_map( 'intval', $ids ) ) );
}

/**
 * Fetch the posts for a curated list, preserving the editor's order, and
 * format them the same way /posts does (thumbnail baked in, no content).
 *
 * @param int[] $ids
 * @return array
 */
function popseries_format_curated( $ids ) {
	if ( empty( $ids ) ) {
		return array();
	}

	$query = new WP_Query(
		array(
			'post_type'           => 'post',
			'post_status'         => 'publish',
			'post__in'            => $ids,
			'orderby'             => 'post__in', // Honour the curated order.
			'posts_per_page'      => count( $ids ),
			'ignore_sticky_posts' => true,
			'no_found_rows'       => true,
		)
	);

	$items = array();
	foreach ( $query->posts as $post ) {
		$items[] = popseries_format_post( $post, false );
	}
	wp_reset_postdata();

	return $items;
}

/**
 * GET /popseries/v1/slider — curated homepage hero slides (ordered).
 * Returns an empty array when nothing is curated; the frontend then falls
 * back to the latest posts.
 */
function popseries_route_slider() {
	$ids = popseries_get_curated_ids( POPSERIES_SLIDER_OPTION );
	return new WP_REST_Response( popseries_format_curated( $ids ) );
}

/**
 * GET /popseries/v1/on-air — curated "กำลังออนแอร์" Series list (ordered).
 */
function popseries_route_on_air() {
	$ids = popseries_get_curated_ids( POPSERIES_ON_AIR_OPTION );
	return new WP_REST_Response( popseries_format_curated( $ids ) );
}

/**
 * Register the curation REST routes.
 */
function popseries_register_curation_routes() {
	$ns = 'popseries/v1';

	register_rest_route(
		$ns,
		'/slider',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => 'popseries_route_slider',
			'permission_callback' => '__return_true',
		)
	);

	register_rest_route(
		$ns,
		'/on-air',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => 'popseries_route_on_air',
			'permission_callback' => '__return_true',
		)
	);
}
add_action( 'rest_api_init', 'popseries_register_curation_routes' );
