<?php
/**
 * Series metadata — an "ข้อมูลซีรีส์" meta box for episodes, release year,
 * genres, platforms and formats (HD/พากย์ไทย/ซับไทย). Exposed on the API as a
 * `series` object (see popseries_format_post) and rendered in the Series hero.
 *
 * Every field is optional; the frontend hides whatever is left blank.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const POPSERIES_SERIES_NONCE = 'popseries_series_save';

/**
 * Term names attached to a post for a taxonomy (empty array when none).
 * Genres, platforms and formats are all taxonomies now (see taxonomies.php).
 *
 * @param int    $post_id
 * @param string $taxonomy
 * @return string[]
 */
function popseries_series_terms( $post_id, $taxonomy ) {
	$terms = get_the_terms( $post_id, $taxonomy );
	if ( ! $terms || is_wp_error( $terms ) ) {
		return array();
	}
	return array_values( wp_list_pluck( $terms, 'name' ) );
}

/**
 * A positive integer meta, or null when unset.
 *
 * @param int    $post_id
 * @param string $key
 * @return int|null
 */
function popseries_series_int( $post_id, $key ) {
	$value = get_post_meta( $post_id, $key, true );
	if ( '' === $value || null === $value ) {
		return null;
	}
	return (int) $value;
}

/**
 * Assemble the series payload, or null when the editor filled in nothing.
 *
 * @param int $post_id
 * @return array|null
 */
function popseries_series_data( $post_id ) {
	$data = array(
		'episodes'  => popseries_series_int( $post_id, '_ps_series_episodes' ),
		'year'      => popseries_series_int( $post_id, '_ps_series_year' ),
		'genres'    => popseries_series_terms( $post_id, 'ps_genre' ),
		'platforms' => popseries_series_terms( $post_id, 'ps_platform' ),
		'formats'   => popseries_series_terms( $post_id, 'ps_format' ),
	);

	$empty = null === $data['episodes'] && null === $data['year'] &&
		! $data['genres'] && ! $data['platforms'] && ! $data['formats'];

	return $empty ? null : $data;
}

/**
 * Register the meta box.
 */
function popseries_series_add_metabox() {
	add_meta_box(
		'popseries_series',
		'Pop Series — ข้อมูลซีรีส์',
		'popseries_series_render_metabox',
		'post',
		'side',
		'default'
	);
}
add_action( 'add_meta_boxes', 'popseries_series_add_metabox' );

/**
 * Render the meta box.
 *
 * @param WP_Post $post
 */
function popseries_series_render_metabox( $post ) {
	wp_nonce_field( POPSERIES_SERIES_NONCE, 'popseries_series_nonce' );
	$episodes = get_post_meta( $post->ID, '_ps_series_episodes', true );
	$year     = get_post_meta( $post->ID, '_ps_series_year', true );
	?>
	<p class="description" style="margin-top:0">ใช้กับหน้า Series — เว้นว่างช่องไหน หน้าเว็บจะซ่อนช่องนั้น<br /><strong>แนว · แพลตฟอร์ม · รูปแบบ</strong> เลือกจากกล่องด้านข้าง (taxonomy)</p>
	<p>
		<label for="_ps_series_episodes"><strong>จำนวนตอน</strong></label><br />
		<input type="number" min="0" step="1" id="_ps_series_episodes" name="_ps_series_episodes"
			value="<?php echo esc_attr( $episodes ); ?>" class="widefat" placeholder="เช่น 16" />
	</p>
	<p>
		<label for="_ps_series_year"><strong>ปี</strong></label><br />
		<input type="number" min="0" step="1" id="_ps_series_year" name="_ps_series_year"
			value="<?php echo esc_attr( $year ); ?>" class="widefat" placeholder="เช่น 2026 (เว้นว่าง = ปีที่เผยแพร่)" />
	</p>
	<?php
}

/**
 * Persist the series fields.
 *
 * @param int $post_id
 */
function popseries_series_save_metabox( $post_id ) {
	if ( ! isset( $_POST['popseries_series_nonce'] ) ||
		! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['popseries_series_nonce'] ) ), POPSERIES_SERIES_NONCE ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	foreach ( array( '_ps_series_episodes', '_ps_series_year' ) as $key ) {
		$raw = isset( $_POST[ $key ] ) ? trim( sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) ) : '';
		if ( '' === $raw ) {
			delete_post_meta( $post_id, $key );
		} else {
			update_post_meta( $post_id, $key, max( 0, (int) $raw ) );
		}
	}
	// Genres/platforms/formats are taxonomies — WordPress saves those itself.
}
add_action( 'save_post_post', 'popseries_series_save_metabox' );
