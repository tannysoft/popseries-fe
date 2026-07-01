<?php
/**
 * Custom taxonomies for series metadata: แพลตฟอร์ม/ช่อง (ps_platform) and
 * รูปแบบ (ps_format). Both attach to posts and render as checkbox boxes in the
 * editor. A one-time idempotent seeder populates sensible default terms.
 *
 * The API reads term names into the `series` payload (see series-info.php).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the two taxonomies on posts.
 */
function popseries_register_taxonomies() {
	register_taxonomy(
		'ps_platform',
		'post',
		array(
			'labels'            => array(
				'name'          => 'แพลตฟอร์ม/ช่อง',
				'singular_name' => 'แพลตฟอร์ม',
				'menu_name'     => 'แพลตฟอร์ม',
				'all_items'     => 'แพลตฟอร์มทั้งหมด',
				'edit_item'     => 'แก้ไขแพลตฟอร์ม',
				'add_new_item'  => 'เพิ่มแพลตฟอร์ม',
				'search_items'  => 'ค้นหาแพลตฟอร์ม',
			),
			'public'            => true,
			'hierarchical'      => true, // checkbox-style picker
			'show_ui'           => true,
			'show_in_rest'      => true,
			'show_admin_column' => true,
			'rewrite'           => array( 'slug' => 'platform' ),
		)
	);

	register_taxonomy(
		'ps_format',
		'post',
		array(
			'labels'            => array(
				'name'          => 'รูปแบบ',
				'singular_name' => 'รูปแบบ',
				'menu_name'     => 'รูปแบบ',
				'all_items'     => 'รูปแบบทั้งหมด',
				'edit_item'     => 'แก้ไขรูปแบบ',
				'add_new_item'  => 'เพิ่มรูปแบบ',
				'search_items'  => 'ค้นหารูปแบบ',
			),
			'public'            => true,
			'hierarchical'      => true,
			'show_ui'           => true,
			'show_in_rest'      => true,
			'show_admin_column' => false,
			'rewrite'           => array( 'slug' => 'format' ),
		)
	);
}
add_action( 'init', 'popseries_register_taxonomies', 10 );

/**
 * Default terms to seed (name => slug). Editors can add/remove more later.
 */
function popseries_taxonomy_seeds() {
	return array(
		'ps_platform' => array(
			'Netflix'         => 'netflix',
			'Disney+ Hotstar' => 'disney-hotstar',
			'Prime Video'     => 'prime-video',
			'Apple TV+'       => 'apple-tv',
			'Viu'             => 'viu',
			'iQIYI'           => 'iqiyi',
			'WeTV'            => 'wetv',
			'Viki'            => 'viki',
			'TrueID'          => 'trueid',
			'YouTube'         => 'youtube',
			'tvN'             => 'tvn',
			'SBS'             => 'sbs',
			'MBC'             => 'mbc',
			'KBS'             => 'kbs',
			'JTBC'            => 'jtbc',
			'ENA'             => 'ena',
			'TVING'           => 'tving',
			'Coupang Play'    => 'coupang-play',
			'Wavve'           => 'wavve',
		),
		'ps_format'   => array(
			'HD'        => 'hd',
			'Full HD'   => 'full-hd',
			'4K'        => '4k',
			'พากย์ไทย'  => 'thai-dub',
			'ซับไทย'    => 'thai-sub',
			'ซับอังกฤษ' => 'eng-sub',
			'เสียงเกาหลี' => 'korean-audio',
		),
	);
}

/**
 * Insert the default terms once (guarded by an option). Idempotent: existing
 * terms are skipped, so re-running never duplicates.
 */
function popseries_seed_taxonomies() {
	if ( get_option( 'popseries_tax_seeded' ) ) {
		return;
	}
	foreach ( popseries_taxonomy_seeds() as $taxonomy => $terms ) {
		if ( ! taxonomy_exists( $taxonomy ) ) {
			continue;
		}
		foreach ( $terms as $name => $slug ) {
			if ( ! term_exists( $name, $taxonomy ) ) {
				wp_insert_term( $name, $taxonomy, array( 'slug' => $slug ) );
			}
		}
	}
	update_option( 'popseries_tax_seeded', 1 );
}
add_action( 'init', 'popseries_seed_taxonomies', 20 );
