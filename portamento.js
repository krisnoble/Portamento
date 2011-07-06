/**
 * Portamento  v1.0 - 2011-07-06
 * http://simianstudios.com/portamento
 * 
 * Creates a sliding panel that respects the boundaries of
 * a given wrapper, and also has sensible behaviour if the
 * viewport is too small to display the whole panel.
 * 
 * ----
 * 
 * Requires the viewportOffset plugin by Ben Alman
 * http://benalman.com/projects/jquery-misc-plugins/#viewportoffset
 * 
 * ----
 *  
 * Copyright 2011 Kris Noble
 * Licensed under the GPLv3 license:
 * http://www.gnu.org/licenses/gpl-3.0.txt
 * 
 */
(function($){
	
	/*
	 * iOS < 5 doesn't like position: fixed, so we do a bit of sniffing to allow us
	 * to do a workaround - users still get the sliding functionality, but not as smooth
	 * as the default.
	 *  
	 */
	function isiOSlt5() {
		ua = navigator.userAgent;
		isiOS = (/iPad/i.test(ua) || /iPhone OS/i.test(ua));
		
		if (isiOS){
			if (navigator.userAgent.match(/OS [0-4]/i)) {
				alert('iOS < 5 compatibility coming soon!');
			}
		}
	}

	$.fn.portamento = function(options) {    
		// get the definitive options
		var opts = $.extend({}, $.fn.portamento.defaults, options);
		
		// setup the vars accordingly
		var panel = this;
		var wrapper = opts.wrapper;
		var gap = opts.gap;
		
		// wrap the floating panel in a div, then set a sensible min-height
		panel.wrap('<div id="portamento_container" />');
		var float_container = $('#portamento_container');
		float_container.css('min-height', panel.outerHeight()).css('width', panel.outerWidth());
		
		// calculate the upper scrolling boundary
		var topScrollBoundary = panel.offset().top - parseFloat(panel.css('marginTop').replace(/auto/, 0)) - gap;
				
		// ---------------------------------------------------------------------------------------------------
		
		$(window).bind("scroll.portamento", function () {
			
			if($(window).height() > panel.outerHeight() && $(window).width() >= $(document).width()) { // don't scroll if the window isn't big enough
				
				var y = $(document).scrollTop(); // current scroll position of the document
												
				if (y >= (topScrollBoundary)) { // if we're at or past the upper scrolling boundary
					if((panel.innerHeight() - wrapper.viewportOffset().top) + gap >= (wrapper.height())) { // if we're at or past the bottom scrolling boundary
						if(panel.hasClass('fixed') || $(window).height() >= panel.outerHeight()) { // check that there's work to do
							panel.removeClass('fixed');
							panel.css('top', (wrapper.height() - panel.innerHeight()) + 'px');
						}
					} else { // if we're somewhere in the middle
						panel.addClass('fixed');
						panel.css('top', gap + 'px'); // to keep the gap
					}
				} else {
					// if we're above the top scroll boundary
					panel.removeClass('fixed');
					panel.css('top', '0'); // remove any added gap
				}
			} else {
				panel.removeClass('fixed');
			}
		});
		
		// ---------------------------------------------------------------------------------------------------
		
		$(window).bind("resize.portamento", function () {
						
			// stop users getting undesirable behaviour if they resize the window too small
			if($(window).height() <= panel.outerHeight() || $(window).width() < $(document).width()) {			
				if(panel.hasClass('fixed')) {
					panel.removeClass('fixed');
					panel.css('top', '0');
				}				
			} else {
				$(window).trigger('scroll.portamento'); // trigger the scroll event to place the panel correctly
			}
		});
		
	    // return this to maintain chainability
	    return this;
	
	};
	
	// set some sensible defaults
	$.fn.portamento.defaults = {
	  'wrapper'	: $('body'), // wrapper will go in a $() construct, so it could be a tag name or more likely an id e.g. '#wrapper'
	  'gap'		: 10 // gap is the gap left between the top of the viewport and the top of the panel
	};
	
})(jQuery);