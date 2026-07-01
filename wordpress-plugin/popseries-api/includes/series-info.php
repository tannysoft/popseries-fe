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

/** Free-text, comma-separated meta keys → label. */
function popseries_series_list_keys() {
	return array(
		'_ps_series_genres'    => array( 'แนว', 'เช่น ดราม่า, โรแมนติก' ),
		'_ps_series_platforms' => array( 'แพลตฟอร์ม/ช่อง', 'เช่น tvN, Netflix' ),
		'_ps_series_formats'   => array( 'รูปแบบ', 'เช่น HD, พากย์ไทย, ซับไทย' ),
	);
}

/**
 * Split a comma-separated meta value into a clean string array.
 *
 * @param int    $post_id
 * @param string $key
 * @return string[]
 */
function popseries_series_csv( $post_id, $key ) {
	$value = (string) get_post_meta( $post_id, $key, true );
	if ( '' === trim( $value ) ) {
		return array();
	}
	$parts = explode( ',', $value );
	return array_values( array_filter( array_map( 'trim', $parts ) ) );
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
		'genres'    => popseries_series_csv( $post_id, '_ps_series_genres' ),
		'platforms' => popseries_series_csv( $post_id, '_ps_series_platforms' ),
		'formats'   => popseries_series_csv( $post_id, '_ps_series_formats' ),
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
	<p class="description" style="margin-top:0">ใช้กับหน้า Series — เว้นว่างช่องไหน หน้าเว็บจะซ่อนช่องนั้น</p>
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
	<?php foreach ( popseries_series_list_keys() as $key => $meta ) : ?>
		<p>
			<label for="<?php echo esc_attr( $key ); ?>"><strong><?php echo esc_html( $meta[0] ); ?></strong> (คั่นด้วย ,)</label><br />
			<input type="text" id="<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( $key ); ?>"
				value="<?php echo esc_attr( get_post_meta( $post->ID, $key, true ) ); ?>"
				class="widefat" placeholder="<?php echo esc_attr( $meta[1] ); ?>" />
		</p>
	<?php endforeach; ?>
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

	foreach ( array_keys( popseries_series_list_keys() ) as $key ) {
		$raw = isset( $_POST[ $key ] ) ? sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) : '';
		if ( '' === trim( $raw ) ) {
			delete_post_meta( $post_id, $key );
		} else {
			update_post_meta( $post_id, $key, $raw );
		}
	}
}
add_action( 'save_post_post', 'popseries_series_save_metabox' );
