<?php
/**
 * Admin UI for editorial curation — a "Pop Series" menu page where editors
 * search/pick posts for the homepage Slider and tick Series for "On Air".
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const POPSERIES_ADMIN_SLUG   = 'popseries-curation';
const POPSERIES_SAVE_ACTION  = 'popseries_save_curation';
const POPSERIES_CAPABILITY   = 'edit_others_posts'; // Editors and up.

/**
 * Register the top-level admin menu.
 */
function popseries_admin_menu() {
	add_menu_page(
		'Pop Series',
		'Pop Series',
		POPSERIES_CAPABILITY,
		POPSERIES_ADMIN_SLUG,
		'popseries_render_admin_page',
		'dashicons-playlist-video',
		25
	);
}
add_action( 'admin_menu', 'popseries_admin_menu' );

/**
 * Load the picker script/styles only on our admin page.
 *
 * @param string $hook
 */
function popseries_admin_assets( $hook ) {
	if ( 'toplevel_page_' . POPSERIES_ADMIN_SLUG !== $hook ) {
		return;
	}

	$dir = plugin_dir_url( dirname( __FILE__ ) ) . 'admin/';
	wp_enqueue_style( 'popseries-curation', $dir . 'curation.css', array(), '1.0.0' );
	wp_enqueue_script( 'popseries-curation', $dir . 'curation.js', array(), '1.0.0', true );

	wp_localize_script(
		'popseries-curation',
		'PopSeriesCuration',
		array(
			'searchUrl'  => rest_url( 'popseries/v1/posts' ),
			'seriesCat'  => popseries_series_category_id(),
		)
	);
}
add_action( 'admin_enqueue_scripts', 'popseries_admin_assets' );

/**
 * Render one selected item row (server-side, for the initial list).
 *
 * @param int $post_id
 */
function popseries_render_selected_item( $post_id ) {
	$title = get_the_title( $post_id );
	if ( '' === $title ) {
		$title = '#' . $post_id . ' (ไม่พบโพสต์)';
	}
	$thumb = get_the_post_thumbnail_url( $post_id, 'thumbnail' );
	?>
	<li class="popseries-item" data-id="<?php echo esc_attr( $post_id ); ?>">
		<span class="popseries-item__thumb">
			<?php if ( $thumb ) : ?>
				<img src="<?php echo esc_url( $thumb ); ?>" alt="" />
			<?php endif; ?>
		</span>
		<span class="popseries-item__title"><?php echo esc_html( $title ); ?></span>
		<span class="popseries-item__actions">
			<button type="button" class="button-link popseries-move" data-dir="up" aria-label="เลื่อนขึ้น">▲</button>
			<button type="button" class="button-link popseries-move" data-dir="down" aria-label="เลื่อนลง">▼</button>
			<button type="button" class="button-link popseries-remove" aria-label="ลบ">✕</button>
		</span>
	</li>
	<?php
}

/**
 * Render a complete picker widget (search box + selected list + hidden field).
 *
 * @param string $field     Hidden input / option name.
 * @param int[]  $selected  Current selection.
 * @param int    $cat       Category filter for search (0 = all).
 * @param string $hint      Helper text.
 */
function popseries_render_picker( $field, $selected, $cat, $hint ) {
	?>
	<div class="popseries-picker" data-field="<?php echo esc_attr( $field ); ?>" data-cat="<?php echo esc_attr( $cat ); ?>">
		<p class="description"><?php echo esc_html( $hint ); ?></p>
		<div class="popseries-search">
			<input type="search" class="popseries-search__input regular-text" placeholder="ค้นหาโพสต์ตามชื่อ…" autocomplete="off" />
			<div class="popseries-search__results" hidden></div>
		</div>
		<ul class="popseries-list">
			<?php foreach ( $selected as $id ) : ?>
				<?php popseries_render_selected_item( $id ); ?>
			<?php endforeach; ?>
		</ul>
		<p class="popseries-empty"<?php echo $selected ? ' hidden' : ''; ?>>ยังไม่ได้เลือกโพสต์ — ค้นหาด้านบนแล้วกด “เพิ่ม”</p>
		<input type="hidden" name="<?php echo esc_attr( $field ); ?>" class="popseries-value" value="<?php echo esc_attr( implode( ',', $selected ) ); ?>" />
	</div>
	<?php
}

/**
 * Render the admin page.
 */
function popseries_render_admin_page() {
	if ( ! current_user_can( POPSERIES_CAPABILITY ) ) {
		return;
	}

	$slider = popseries_get_curated_ids( POPSERIES_SLIDER_OPTION );
	$on_air = popseries_get_curated_ids( POPSERIES_ON_AIR_OPTION );
	$saved  = isset( $_GET['popseries_saved'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	?>
	<div class="wrap popseries-wrap">
		<h1>Pop Series — จัดหน้าเว็บ</h1>

		<?php if ( $saved ) : ?>
			<div class="notice notice-success is-dismissible"><p>บันทึกเรียบร้อยแล้ว</p></div>
		<?php endif; ?>

		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="<?php echo esc_attr( POPSERIES_SAVE_ACTION ); ?>" />
			<?php wp_nonce_field( POPSERIES_SAVE_ACTION ); ?>

			<h2>สไลด์หน้าแรก (Hero Slider)</h2>
			<?php
			popseries_render_picker(
				POPSERIES_SLIDER_OPTION,
				$slider,
				0,
				'เลือกโพสต์ที่จะโชว์ใน slider หน้าแรก ลากลำดับด้วยปุ่ม ▲▼ · เว้นว่างไว้ = ใช้ 5 โพสต์ล่าสุดอัตโนมัติ'
			);
			?>

			<h2 style="margin-top:2.5rem;">กำลังออนแอร์ (หน้า Series)</h2>
			<?php
			popseries_render_picker(
				POPSERIES_ON_AIR_OPTION,
				$on_air,
				popseries_series_category_id(),
				'ติ๊กเลือกซีรีส์ที่ “กำลังออนแอร์” จะไปโชว์ในหัวข้อกำลังออนแอร์บนหน้า Series · เว้นว่าง = ใช้ซีรีส์ล่าสุดอัตโนมัติ'
			);
			?>

			<h2 style="margin-top:2.5rem;">การเชื่อมต่อ Next.js (Clear Cache)</h2>
			<?php popseries_render_revalidate_settings(); ?>

			<?php submit_button( 'บันทึก' ); ?>
		</form>
	</div>
	<?php
}

/**
 * Render the Next.js revalidation connection settings. When a wp-config
 * constant is set it takes precedence, so the field is shown read-only.
 */
function popseries_render_revalidate_settings() {
	$url_const    = defined( 'POPSERIES_REVALIDATE_URL' ) && POPSERIES_REVALIDATE_URL;
	$secret_const = defined( 'POPSERIES_REVALIDATE_SECRET' ) && POPSERIES_REVALIDATE_SECRET;
	$url          = $url_const ? POPSERIES_REVALIDATE_URL : get_option( POPSERIES_REVALIDATE_URL_OPTION, '' );
	$has_secret   = $secret_const || get_option( POPSERIES_REVALIDATE_SECRET_OPTION, '' );
	?>
	<p class="description">
		เมื่อมีการแก้ไขโพสต์ หรือบันทึก slider/ออนแอร์ ระบบจะสั่งเคลียร์แคชหน้าเว็บให้อัตโนมัติ
	</p>
	<table class="form-table" role="presentation">
		<tr>
			<th scope="row"><label for="popseries_revalidate_url">Webhook URL</label></th>
			<td>
				<input type="url" id="popseries_revalidate_url" name="<?php echo esc_attr( POPSERIES_REVALIDATE_URL_OPTION ); ?>"
					class="regular-text" value="<?php echo esc_attr( $url ); ?>"
					placeholder="https://popseries.co/api/revalidate"
					<?php disabled( $url_const ); ?> />
				<?php if ( $url_const ) : ?>
					<p class="description">กำหนดจาก <code>POPSERIES_REVALIDATE_URL</code> ใน wp-config.php</p>
				<?php endif; ?>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="popseries_revalidate_secret">Shared secret</label></th>
			<td>
				<input type="password" id="popseries_revalidate_secret" name="<?php echo esc_attr( POPSERIES_REVALIDATE_SECRET_OPTION ); ?>"
					class="regular-text" autocomplete="new-password"
					placeholder="<?php echo $has_secret ? '••••••••  (ตั้งค่าไว้แล้ว — เว้นว่างเพื่อคงเดิม)' : 'ตรงกับ REVALIDATE_SECRET ฝั่ง Next.js'; ?>"
					<?php disabled( $secret_const ); ?> />
				<?php if ( $secret_const ) : ?>
					<p class="description">กำหนดจาก <code>POPSERIES_REVALIDATE_SECRET</code> ใน wp-config.php</p>
				<?php endif; ?>
			</td>
		</tr>
	</table>
	<?php
}

/**
 * Handle the save POST: verify nonce + capability, sanitize, store options.
 */
function popseries_handle_save() {
	if ( ! current_user_can( POPSERIES_CAPABILITY ) ) {
		wp_die( 'Unauthorized', 403 );
	}
	check_admin_referer( POPSERIES_SAVE_ACTION );

	foreach ( array( POPSERIES_SLIDER_OPTION, POPSERIES_ON_AIR_OPTION ) as $field ) {
		$raw = isset( $_POST[ $field ] ) ? sanitize_text_field( wp_unslash( $_POST[ $field ] ) ) : '';
		$ids = array_values( array_filter( array_map( 'intval', explode( ',', $raw ) ) ) );
		$ids = array_slice( array_unique( $ids ), 0, 50 ); // Cap the list size.
		update_option( $field, $ids );
	}

	// Next.js revalidation connection (ignored when locked by a wp-config constant).
	if ( ! ( defined( 'POPSERIES_REVALIDATE_URL' ) && POPSERIES_REVALIDATE_URL ) && isset( $_POST[ POPSERIES_REVALIDATE_URL_OPTION ] ) ) {
		update_option(
			POPSERIES_REVALIDATE_URL_OPTION,
			esc_url_raw( wp_unslash( $_POST[ POPSERIES_REVALIDATE_URL_OPTION ] ) )
		);
	}
	// Only overwrite the secret when a new value is typed (blank = keep current).
	if ( ! ( defined( 'POPSERIES_REVALIDATE_SECRET' ) && POPSERIES_REVALIDATE_SECRET ) && ! empty( $_POST[ POPSERIES_REVALIDATE_SECRET_OPTION ] ) ) {
		update_option(
			POPSERIES_REVALIDATE_SECRET_OPTION,
			sanitize_text_field( wp_unslash( $_POST[ POPSERIES_REVALIDATE_SECRET_OPTION ] ) )
		);
	}

	wp_safe_redirect(
		add_query_arg(
			array(
				'page'            => POPSERIES_ADMIN_SLUG,
				'popseries_saved' => 1,
			),
			admin_url( 'admin.php' )
		)
	);
	exit;
}
add_action( 'admin_post_' . POPSERIES_SAVE_ACTION, 'popseries_handle_save' );
