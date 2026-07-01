/**
 * Pop Series curation picker.
 *
 * Enhances every .popseries-picker on the admin page: debounced search against
 * the popseries/v1/posts REST route, add/remove/reorder selected posts, and
 * keeps the hidden CSV input (.popseries-value) in sync for form submit.
 */
( function () {
	'use strict';

	var cfg = window.PopSeriesCuration || {};

	function debounce( fn, wait ) {
		var t;
		return function () {
			var ctx = this,
				args = arguments;
			clearTimeout( t );
			t = setTimeout( function () {
				fn.apply( ctx, args );
			}, wait );
		};
	}

	function initPicker( picker ) {
		var field = picker.getAttribute( 'data-field' );
		var cat = parseInt( picker.getAttribute( 'data-cat' ), 10 ) || 0;
		var input = picker.querySelector( '.popseries-search__input' );
		var results = picker.querySelector( '.popseries-search__results' );
		var list = picker.querySelector( '.popseries-list' );
		var empty = picker.querySelector( '.popseries-empty' );
		var hidden = picker.querySelector( '.popseries-value' );

		function selectedIds() {
			return Array.prototype.map.call( list.querySelectorAll( '.popseries-item' ), function ( li ) {
				return li.getAttribute( 'data-id' );
			} );
		}

		function syncValue() {
			var ids = selectedIds();
			hidden.value = ids.join( ',' );
			empty.hidden = ids.length > 0;
		}

		function makeItem( id, title, thumb ) {
			var li = document.createElement( 'li' );
			li.className = 'popseries-item';
			li.setAttribute( 'data-id', id );
			li.innerHTML =
				'<span class="popseries-item__thumb">' +
				( thumb ? '<img src="' + encodeURI( thumb ) + '" alt="" />' : '' ) +
				'</span>' +
				'<span class="popseries-item__title"></span>' +
				'<span class="popseries-item__actions">' +
				'<button type="button" class="button-link popseries-move" data-dir="up" aria-label="เลื่อนขึ้น">▲</button>' +
				'<button type="button" class="button-link popseries-move" data-dir="down" aria-label="เลื่อนลง">▼</button>' +
				'<button type="button" class="button-link popseries-remove" aria-label="ลบ">✕</button>' +
				'</span>';
			li.querySelector( '.popseries-item__title' ).textContent = title;
			return li;
		}

		function addPost( id, title, thumb ) {
			if ( list.querySelector( '.popseries-item[data-id="' + id + '"]' ) ) {
				return; // Already selected.
			}
			list.appendChild( makeItem( id, title, thumb ) );
			syncValue();
		}

		function renderResults( posts ) {
			results.innerHTML = '';
			if ( ! posts.length ) {
				results.hidden = true;
				return;
			}
			posts.forEach( function ( p ) {
				var id = p.id;
				var title = ( p.title && p.title.rendered ) || '(ไม่มีชื่อ)';
				var media = p._embedded && p._embedded['wp:featuredmedia'];
				var thumb = media && media[0] ? media[0].source_url : '';
				var row = document.createElement( 'button' );
				row.type = 'button';
				row.className = 'popseries-result';
				row.innerHTML =
					'<span class="popseries-result__thumb">' +
					( thumb ? '<img src="' + encodeURI( thumb ) + '" alt="" />' : '' ) +
					'</span><span class="popseries-result__title"></span><span class="popseries-result__add">＋ เพิ่ม</span>';
				row.querySelector( '.popseries-result__title' ).textContent = title;
				row.addEventListener( 'click', function () {
					addPost( id, title, thumb );
					results.hidden = true;
					input.value = '';
				} );
				results.appendChild( row );
			} );
			results.hidden = false;
		}

		var runSearch = debounce( function () {
			var term = input.value.trim();
			if ( term.length < 2 ) {
				results.hidden = true;
				return;
			}
			var url =
				cfg.searchUrl +
				'?per_page=8&search=' +
				encodeURIComponent( term ) +
				( cat ? '&categories=' + cat : '' );
			fetch( url, { headers: { Accept: 'application/json' } } )
				.then( function ( r ) {
					return r.ok ? r.json() : [];
				} )
				.then( renderResults )
				.catch( function () {
					results.hidden = true;
				} );
		}, 300 );

		input.addEventListener( 'input', runSearch );
		input.addEventListener( 'focus', runSearch );

		// Hide results when clicking away.
		document.addEventListener( 'click', function ( e ) {
			if ( ! picker.contains( e.target ) ) {
				results.hidden = true;
			}
		} );

		// Delegate remove / reorder on the selected list.
		list.addEventListener( 'click', function ( e ) {
			var li = e.target.closest( '.popseries-item' );
			if ( ! li ) {
				return;
			}
			if ( e.target.closest( '.popseries-remove' ) ) {
				li.remove();
				syncValue();
			} else if ( e.target.closest( '.popseries-move' ) ) {
				var dir = e.target.closest( '.popseries-move' ).getAttribute( 'data-dir' );
				if ( 'up' === dir && li.previousElementSibling ) {
					list.insertBefore( li, li.previousElementSibling );
				} else if ( 'down' === dir && li.nextElementSibling ) {
					list.insertBefore( li.nextElementSibling, li );
				}
				syncValue();
			}
		} );

		syncValue();
	}

	document.addEventListener( 'DOMContentLoaded', function () {
		Array.prototype.forEach.call( document.querySelectorAll( '.popseries-picker' ), initPicker );
	} );
} )();
