<?php
/**
 * Editorial review scores — a "Pop Series Review" meta box on the post editor
 * that stores an overall score, optional per-topic subscores, and pros/cons.
 * Exposed on the API via popseries_review_data() (see popseries_format_post).
 *
 * Only posts with an overall score render the review UI on the frontend;
 * blank subscores are auto-derived client-side from the overall score.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const POPSERIES_REVIEW_NONCE = 'popseries_review_save';

/** Numeric review meta keys (0–10). */
function popseries_review_number_keys() {
	return array(
		'_ps_review_score'      => 'คะแนนรวม',
		'_ps_review_story'      => 'เรื่องราว',
		'_ps_review_acting'     => 'การแสดง',
		'_ps_review_production' => 'งานสร้าง',
		'_ps_review_music'      => 'เพลงประกอบ',
	);
}

/**
 * A single numeric score, or null when unset.
 *
 * @param int    $post_id
 * @param string $key
 * @return float|null
 */
function popseries_review_num( $post_id, $key ) {
	$value = get_post_meta( $post_id, $key, true );
	if ( '' === $value || null === $value ) {
		return null;
	}
	return (float) $value;
}

/**
 * A newline-separated textarea meta as a clean string array.
 *
 * @param int    $post_id
 * @param string $key
 * @return string[]
 */
function popseries_review_lines( $post_id, $key ) {
	$value = (string) get_post_meta( $post_id, $key, true );
	if ( '' === trim( $value ) ) {
		return array();
	}
	$lines = preg_split( '/\r\n|\r|\n/', $value );
	return array_values( array_filter( array_map( 'trim', $lines ) ) );
}

/**
 * Assemble the review payload for a post, or null when no overall score is set.
 * Text (pros/cons) is only included when requested, to keep list responses light.
 *
 * @param int  $post_id
 * @param bool $with_text
 * @return array|null
 */
function popseries_review_data( $post_id, $with_text = false ) {
	$score = get_post_meta( $post_id, '_ps_review_score', true );
	if ( '' === $score || null === $score ) {
		return null;
	}

	$data = array(
		'score'     => (float) $score,
		'subscores' => array(
			'story'      => popseries_review_num( $post_id, '_ps_review_story' ),
			'acting'     => popseries_review_num( $post_id, '_ps_review_acting' ),
			'production' => popseries_review_num( $post_id, '_ps_review_production' ),
			'music'      => popseries_review_num( $post_id, '_ps_review_music' ),
		),
	);

	if ( $with_text ) {
		$data['pros'] = popseries_review_lines( $post_id, '_ps_review_pros' );
		$data['cons'] = popseries_review_lines( $post_id, '_ps_review_cons' );
	}

	return $data;
}

/**
 * Register the meta box (admin only).
 */
function popseries_review_add_metabox() {
	add_meta_box(
		'popseries_review',
		'Pop Series Review — คะแนนรีวิว',
		'popseries_review_render_metabox',
		'post',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'popseries_review_add_metabox' );

/**
 * Render the meta box fields.
 *
 * @param WP_Post $post
 */
function popseries_review_render_metabox( $post ) {
	wp_nonce_field( POPSERIES_REVIEW_NONCE, 'popseries_review_nonce' );
	$numbers = popseries_review_number_keys();
	$pros    = get_post_meta( $post->ID, '_ps_review_pros', true );
	$cons    = get_post_meta( $post->ID, '_ps_review_cons', true );
	?>
	<style>
		.ps-review-grid{display:flex;flex-wrap:wrap;gap:16px;margin:8px 0 4px}
		.ps-review-field label{display:block;font-weight:600;margin-bottom:4px}
		.ps-review-field input{width:90px}
		.ps-review-cols{display:flex;flex-wrap:wrap;gap:20px;margin-top:12px}
		.ps-review-cols>div{flex:1 1 260px}
		.ps-review-cols textarea{width:100%;min-height:90px}
	</style>
	<p class="description">
		กรอก <strong>คะแนนรวม</strong> เพื่อเปิดบล็อกรีวิวบนหน้าเว็บ · คะแนนย่อยเว้นว่างได้ (ระบบจะคำนวณให้อัตโนมัติ) · จุดเด่น/จุดด้อยพิมพ์บรรทัดละ 1 ข้อ
	</p>
	<div class="ps-review-grid">
		<?php foreach ( $numbers as $key => $label ) : ?>
			<div class="ps-review-field">
				<label for="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $label ); ?></label>
				<input type="number" step="0.1" min="0" max="10" id="<?php echo esc_attr( $key ); ?>"
					name="<?php echo esc_attr( $key ); ?>"
					value="<?php echo esc_attr( get_post_meta( $post->ID, $key, true ) ); ?>"
					placeholder="0–10" />
			</div>
		<?php endforeach; ?>
	</div>
	<div class="ps-review-cols">
		<div>
			<label for="_ps_review_pros"><strong>จุดเด่น</strong> (บรรทัดละ 1 ข้อ)</label>
			<textarea id="_ps_review_pros" name="_ps_review_pros"><?php echo esc_textarea( $pros ); ?></textarea>
		</div>
		<div>
			<label for="_ps_review_cons"><strong>จุดที่ยังขาด</strong> (บรรทัดละ 1 ข้อ)</label>
			<textarea id="_ps_review_cons" name="_ps_review_cons"><?php echo esc_textarea( $cons ); ?></textarea>
		</div>
	</div>
	<?php
}

/**
 * Persist the review fields.
 *
 * @param int $post_id
 */
function popseries_review_save_metabox( $post_id ) {
	if ( ! isset( $_POST['popseries_review_nonce'] ) ||
		! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['popseries_review_nonce'] ) ), POPSERIES_REVIEW_NONCE ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	foreach ( array_keys( popseries_review_number_keys() ) as $key ) {
		$raw = isset( $_POST[ $key ] ) ? trim( sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) ) : '';
		if ( '' === $raw ) {
			delete_post_meta( $post_id, $key );
			continue;
		}
		$value = (float) $raw;
		$value = max( 0, min( 10, $value ) );
		update_post_meta( $post_id, $key, $value );
	}

	foreach ( array( '_ps_review_pros', '_ps_review_cons' ) as $key ) {
		$raw = isset( $_POST[ $key ] ) ? sanitize_textarea_field( wp_unslash( $_POST[ $key ] ) ) : '';
		if ( '' === trim( $raw ) ) {
			delete_post_meta( $post_id, $key );
		} else {
			update_post_meta( $post_id, $key, $raw );
		}
	}
}
add_action( 'save_post_post', 'popseries_review_save_metabox' );
