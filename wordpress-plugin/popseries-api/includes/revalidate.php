<?php
/**
 * On-demand Next.js cache revalidation.
 *
 * When content changes, ping the frontend's /api/revalidate webhook so it can
 * clear the matching cache tags instead of waiting out the ISR window.
 *
 * Configure the target URL + shared secret via wp-config.php constants
 * (preferred) or the Pop Series admin settings:
 *   define( 'POPSERIES_REVALIDATE_URL', 'https://frontend.example.com/api/revalidate' );
 *   define( 'POPSERIES_REVALIDATE_SECRET', '…' );
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const POPSERIES_REVALIDATE_URL_OPTION    = 'popseries_revalidate_url';
const POPSERIES_REVALIDATE_SECRET_OPTION = 'popseries_revalidate_secret';

/**
 * Resolve the webhook URL (constant wins over stored option).
 */
function popseries_revalidate_url() {
	if ( defined( 'POPSERIES_REVALIDATE_URL' ) && POPSERIES_REVALIDATE_URL ) {
		return POPSERIES_REVALIDATE_URL;
	}
	return (string) get_option( POPSERIES_REVALIDATE_URL_OPTION, '' );
}

/**
 * Resolve the shared secret (constant wins over stored option).
 */
function popseries_revalidate_secret() {
	if ( defined( 'POPSERIES_REVALIDATE_SECRET' ) && POPSERIES_REVALIDATE_SECRET ) {
		return POPSERIES_REVALIDATE_SECRET;
	}
	return (string) get_option( POPSERIES_REVALIDATE_SECRET_OPTION, '' );
}

/**
 * Fire the webhook. Non-blocking so it never slows down the editor.
 *
 * @param string[] $tags   Cache tags to clear (e.g. ['wp:posts']).
 * @param string[] $paths  Paths to revalidate (e.g. ['/', '/series']).
 */
function popseries_trigger_revalidate( $tags = array(), $paths = array() ) {
	$url    = popseries_revalidate_url();
	$secret = popseries_revalidate_secret();
	if ( ! $url || ! $secret ) {
		return; // Not configured — silently skip.
	}

	$body = wp_json_encode(
		array(
			'tags'  => array_values( array_unique( array_filter( (array) $tags ) ) ),
			'paths' => array_values( array_unique( array_filter( (array) $paths ) ) ),
		)
	);

	wp_remote_post(
		$url,
		array(
			'timeout'  => 2,
			'blocking' => false, // Fire-and-forget.
			'headers'  => array(
				'Content-Type'       => 'application/json',
				'x-revalidate-secret' => $secret,
			),
			'body'     => $body,
		)
	);
}

/**
 * Revalidate on post create/update/delete. Clears the posts tag (covers home,
 * category, tag, author lists + single articles) and the specific article path.
 *
 * @param int     $post_id
 * @param WP_Post $post
 */
function popseries_revalidate_on_save( $post_id, $post ) {
	if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
		return;
	}
	if ( ! $post instanceof WP_Post || 'post' !== $post->post_type ) {
		return;
	}
	// Only care about content that is (or just left) the published state.
	if ( 'publish' !== $post->post_status && 'trash' !== $post->post_status ) {
		return;
	}

	$paths = array( '/' );
	if ( $post->post_name ) {
		$paths[] = '/' . $post->post_name;
	}

	popseries_trigger_revalidate( array( 'wp:posts', 'wp:post:' . $post->post_name ), $paths );
}
add_action( 'save_post', 'popseries_revalidate_on_save', 10, 2 );

/**
 * Catch status transitions (publish ⇄ draft/trash) that save_post may miss.
 *
 * @param string  $new_status
 * @param string  $old_status
 * @param WP_Post $post
 */
function popseries_revalidate_on_transition( $new_status, $old_status, $post ) {
	if ( $new_status === $old_status ) {
		return;
	}
	if ( ! $post instanceof WP_Post || 'post' !== $post->post_type ) {
		return;
	}
	if ( 'publish' === $new_status || 'publish' === $old_status ) {
		popseries_trigger_revalidate( array( 'wp:posts' ), array( '/' ) );
	}
}
add_action( 'transition_post_status', 'popseries_revalidate_on_transition', 10, 3 );

/**
 * Revalidate the homepage slider when its selection changes.
 */
function popseries_revalidate_slider() {
	popseries_trigger_revalidate( array( 'wp:slider' ), array( '/' ) );
}
add_action( 'update_option_' . POPSERIES_SLIDER_OPTION, 'popseries_revalidate_slider' );
add_action( 'add_option_' . POPSERIES_SLIDER_OPTION, 'popseries_revalidate_slider' );

/**
 * Revalidate the Series page when the On Air selection changes.
 */
function popseries_revalidate_on_air() {
	popseries_trigger_revalidate( array( 'wp:on-air' ), array( '/series' ) );
}
add_action( 'update_option_' . POPSERIES_ON_AIR_OPTION, 'popseries_revalidate_on_air' );
add_action( 'add_option_' . POPSERIES_ON_AIR_OPTION, 'popseries_revalidate_on_air' );
