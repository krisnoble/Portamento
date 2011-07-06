/**
 * 
 * Portamento  v1.0 - 2011-07-06
 * http://simianstudios.com/portamento
 * 
 * Creates a sliding panel that respects the boundaries of
 * a given wrapper, and also has sensible behaviour if the
 * viewport is too small to display the whole panel.
 * 
 * ----
 * 
 * Uses the viewportOffset plugin by Ben Alman aka Cowboy
 * http://benalman.com/projects/jquery-misc-plugins/#viewportoffset
 * 
 * and a portion of CFT by Juriy Zaytsev aka Kangax
 * http://kangax.github.com/cft/#IS_POSITION_FIXED_SUPPORTED
 * 
 * ----
 *  
 * Copyright 2011 Kris Noble except where noted.
 * Licensed under the GPLv3 license:
 * http://www.gnu.org/licenses/gpl-3.0.txt
 * 
 */
(function($){
  	
  	
  	/*!
	 * jQuery viewportOffset - v0.3 - 2/3/2010
	 * http://benalman.com/projects/jquery-misc-plugins/
	 * 
	 * Copyright (c) 2010 "Cowboy" Ben Alman
	 * Dual licensed under the MIT and GPL licenses.
	 * http://benalman.com/about/license/
	 */	
  	$.fn.viewportOffset = function() {
		var win = $(window);
		var offset = $(this).offset();
  
		return {
    		left: offset.left - win.scrollLeft(),
      		top: offset.top - win.scrollTop()
    	};
  	};
	
	/**
	 * 
	 * A test to see if position:fixed is supported.
	 * Taken from CFT by Kangax - http://kangax.github.com/cft/#IS_POSITION_FIXED_SUPPORTED
	 * 
	 */
	function positionFixedSupported () {
		var container = document.body;
  		if (document.createElement && container && container.appendChild && container.removeChild) {
      		var el = document.createElement("div");
	  		if (!el.getBoundingClientRect) {
	      		return null;
	  		}
	  		el.innerHTML = "x";
	  		el.style.cssText = "position:fixed;top:100px;";
	  		container.appendChild(el);
	  		var originalHeight = container.style.height, originalScrollTop = container.scrollTop;
	 		container.style.height = "3000px";
	      	container.scrollTop = 500;
	      	var elementTop = el.getBoundingClientRect().top;
	      	container.style.height = originalHeight;
	      	var isSupported = elementTop === 100;
	      	container.removeChild(el);
	      	container.scrollTop = originalScrollTop;
	      	return isSupported;
  		}
  		return null;
	}

	$.fn.portamento = function(options) {
			    
		// get the definitive options
		var opts = $.extend({}, $.fn.portamento.defaults, options);
		
		// setup the vars accordingly
		var panel = this;
		var wrapper = opts.wrapper;
		var gap = opts.gap;
		var disableWorkaround = opts.disableWorkaround;
		
		var fullyCapableBrowser = positionFixedSupported();
		
		if(!fullyCapableBrowser && disableWorkaround) {
			// just stop here, as the dev doesn't want to use the workaround
			return this;
		}
		
		// wrap the floating panel in a div, then set a sensible min-height
		panel.wrap('<div id="portamento_container" />');
		var float_container = $('#portamento_container');
		float_container.css('min-height', panel.outerHeight()).css('width', panel.outerWidth());
		
		// calculate the upper scrolling boundary
		var panelOffset = panel.offset().top;
		var panelMargin = parseFloat(panel.css('marginTop').replace(/auto/, 0));
		var realPanelOffset = panelOffset - panelMargin;
		var topScrollBoundary = realPanelOffset - gap;
				
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
						
						if(fullyCapableBrowser) { // supports position:fixed
							panel.css('top', gap + 'px'); // to keep the gap
						} else {
							var absoluteCorrection = 0;
							
							if(panel.css('position') != 'absolute') {
								var absoluteCorrection = panelOffset;
							}
							panel.clearQueue();
							panel.css('position', 'absolute').animate({top: (0 - float_container.viewportOffset().top + gap)});
						}
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
	  'wrapper'				: $('body'), // wrapper will go in a $() construct, so it could be a tag name or more likely an id e.g. '#wrapper'
	  'gap'					: 10, // gap is the gap left between the top of the viewport and the top of the panel
	  'disableWorkaround' 	: false // option to disable the workaround for not-quite capable browsers 
	};
	
})(jQuery);