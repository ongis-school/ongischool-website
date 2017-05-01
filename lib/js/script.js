
(function($) {
    "use strict";
	
	/* Countdown */
	$(document).ready(function() {
		$.fn.countdown = function(options, callback) {
	
			//custom 'this' selector
			var thisEl = $(this);
	
			//array of custom settings
			var settings = { 
				'date': null,
				'format': null
			};
	
			//append the settings array to options
			if(options) {
				$.extend(settings, options);
			}
			
			//main countdown function
			function countdown_proc() {
				
				var eventDate = Date.parse(settings['date']) / 1000;
				var currentDate = Math.floor($.now() / 1000);
				
				if(eventDate <= currentDate) {
					callback.call(this);
					clearInterval(interval);
				}
				
				var seconds = eventDate - currentDate;
				
				var days = Math.floor(seconds / (60 * 60 * 24)); //calculate the number of days
				seconds -= days * 60 * 60 * 24; //update the seconds variable with no. of days removed
				
				var hours = Math.floor(seconds / (60 * 60));
				seconds -= hours * 60 * 60; //update the seconds variable with no. of hours removed
				
				var minutes = Math.floor(seconds / 60);
				seconds -= minutes * 60; //update the seconds variable with no. of minutes removed
				
				//conditional Ss
				if (days == 1) { thisEl.find(".timeRefDays").text("day"); } else { thisEl.find(".timeRefDays").text("days"); }
				if (hours == 1) { thisEl.find(".timeRefHours").text("hour"); } else { thisEl.find(".timeRefHours").text("hours"); }
				if (minutes == 1) { thisEl.find(".timeRefMinutes").text("minute"); } else { thisEl.find(".timeRefMinutes").text("minutes"); }
				if (seconds == 1) { thisEl.find(".timeRefSeconds").text("second"); } else { thisEl.find(".timeRefSeconds").text("seconds"); }
				
				//logic for the two_digits ON setting
				if(settings['format'] == "on") {
					days = (String(days).length >= 2) ? days : "0" + days;
					hours = (String(hours).length >= 2) ? hours : "0" + hours;
					minutes = (String(minutes).length >= 2) ? minutes : "0" + minutes;
					seconds = (String(seconds).length >= 2) ? seconds : "0" + seconds;
				}
				
				//update the countdown's html values.
				if(!isNaN(eventDate)) {
					thisEl.find(".days").text(days);
					thisEl.find(".hours").text(hours);
					thisEl.find(".minutes").text(minutes);
					thisEl.find(".seconds").text(seconds);
				} else { 
					alert("Invalid date. Here's an example: 12 Tuesday 2012 17:30:00");
					clearInterval(interval); 
				}
			}
			
			//run the function
			countdown_proc();
			
			//loop the function
			var interval = setInterval(countdown_proc, 1000);
			
		}
		
	});
	
	/* Jquery Toggle */
	$(document).ready(function () {
	
		$(".toggle .description").hide();
	
		$(".toggle .item_wrapper").click(function(){
			$(this).next(".description").slideToggle("fast")
			.siblings(".description:visible").slideUp("fast");
			$(this).toggleClass("active");
			$(this).siblings(".item_wrapper").removeClass("active");
		});
	
		$('#toggle-view li').click(function () {
			var text = $(this).children('p');
			if (text.is(':hidden')) {
				text.slideDown('200');
				$(this).children('span').html('-');		
			} else {
				text.slideUp('200');
				$(this).children('span').html('+');		
			}
		});
	});
	
	/* Newsletter */
	$('.newsletter_form_wrapper .newsletter_form').each( function(){
		var form = $(this);
		//form.validate();
		form.submit(function(e) {
			if (!e.isDefaultPrevented()) {
				jQuery.post(this.action,{
					'email':$('input[name="nf_email"]').val(),
				},function(data){
					form.fadeOut('fast', function() {
						$(this).siblings('p').show();
					});
				});
				e.preventDefault();
			}
		});
	});	
	
	/* template functions */
	$(document).ready(function(){
		
		// smaller screens
		main_functions_call();
		function main_functions_call(container){
			if(typeof container === 'undefined'){
				container = 'body';
			}
			
			// adding mobile class on smaller screens
			$(container).is_smallerScreen();
			// responsive navigation
			$(container).wt_responsive_nav();	
		}
	})
	
	jQuery(window).load(function(){	
	});
	
	/* Adding Mobile Class
	================================================== */
	(function($) {
		$.fn.is_smallerScreen = function() {
			var win               = $(window),
				container         = $('html'),
				isResponsiveMode  = container.hasClass('cssanimations'),	
				check_screen      = function() {
					
					if( win.width() < 1000 && isResponsiveMode ){
						container.addClass('is_smallScreen');
					} else {
						container.removeClass('is_smallScreen');
					}
				};
	
				win.on("smartresize", check_screen);
				check_screen();
		};
	})(jQuery);
	
			
	/* Responsive Navigation
	================================================== */
	(function($) {
		$.fn.wt_responsive_nav = function() {
			var win = $(window), header = $('#header');
	
			if(!header.length) {
				return;
			}
	
			var menu              = header.find('#nav:eq(0)'),
				first_level_items = menu.find('>li').length,
				switchWidth = 768;
	
			if(first_level_items > 8) {
				switchWidth = 959;
			}
			// if there is no menu selected
			if(header.is('.drop_down_nav')) {
				menu.mobileMenu({
					switchWidth: switchWidth,
					topOptionText: $('#nav').data('select-name'), // first option text
					indentString: 'ontouchstart' in document.documentElement ? '- ' : "&nbsp;&nbsp;&nbsp;"  // string for indenting nested items
				});
			} else {
				var container       = $('#container'),
					responsive_nav_wrap	= $('<div id="wt_responsive_nav_wrap"></div>').prependTo(container),
					show_menu		= $('<a id="responsive_nav_open" href="#" class=""><i class="fa fa-list-ul"></i></a>'),
					hide_menu		= $('<a id="responsive_nav_hide" href="#" class=""><i class="fa fa-times"></i></a>'),
					responsive_nav  = menu.clone().attr({id:"wt-responsive-nav", "class":""}),
					menu_item       = responsive_nav.find('a'),    
					one_page_item   = menu_item.attr('href').match("^#") ? true : false,
					menu_added      = false;
									
					responsive_nav.find('ul').removeAttr("style");
					responsive_nav.find('.notMobile').remove();
					
					// hiding all sub-menus		
					/*	
					responsive_nav.find('li').each(function(){
						var el = $(this);
						if(el.find('> ul').length > 0) {
							 el.find('> a').append('<i class="fontawesome-icon wt_icon-angle-down"></i>');
						}
					});
	
					responsive_nav.find('li:has(">ul") > a').click(function(){
						var el = $(this),
							icon = el.find('.fontawesome-icon'),
							el_parent = el.parent().find('> ul'),
							screen_h  = win.height();
						
						var el_parent_height = el_parent.css({position:'relative'}).outerHeight(true),
							container_height = container.outerHeight(true),
							new_height = container_height + el_parent_height,
							new_height_1 = container_height - el_parent_height;
							
						el.toggleClass('active');
						el_parent.stop(true,true).slideToggle();
						
						if ( el.hasClass('active') ) {
							icon.removeClass('wt_icon-angle-down').addClass('wt_icon-angle-up');
							if(new_height < screen_h) new_height = screen_h;
								container.css({'height':new_height});
						} else {
							icon.removeClass('wt_icon-angle-up').addClass('wt_icon-angle-down');
							if(new_height_1 < screen_h) new_height_1 = screen_h;
								container.css({'height':new_height_1});
							
						}
						
						return false;
					});
					*/
					// end hiding all sub-menus	
					
					show_menu.click(function() {
						if(container.is('.show_responsive_nav')) {
							container.removeClass('show_responsive_nav');
							container.css({'height':"auto"});
						} else {
							container.addClass('show_responsive_nav');
							set_height();
						}
						return false;
					});
					
					// start responsive one page navigation	
					if (one_page_item) {			
						menu_item.click(function(e) {
							if(container.is('.show_responsive_nav')) {						
								container.removeClass('show_responsive_nav');
								container.css({'height':"auto"});
									var full_url = this.href;
									var parts = full_url.split("#");
									var trgt = parts[1];
									var target_offset = $("#"+trgt).offset();
									var target_top = target_offset.top;
									$('html,body').animate({scrollTop:target_top -70}, 1000);
									return false;
								e.preventDefault();
							}
						});
					}
					// end responsive one page navigation
					
					hide_menu.click(function() {
						container.removeClass('show_responsive_nav');
						container.css({'height':"auto"});
						return false;
					});
	
					var set_visibility = function() {
						if(win.width() > switchWidth) {
							header.removeClass('small_device_active');
							container.removeClass('show_responsive_nav');
							container.css({'height':"auto"});
						} else {
							header.addClass('small_device_active');
							if(!menu_added) {
								var before_menu = header.find('#nav');
								show_menu.insertBefore(before_menu);
								responsive_nav.prependTo(responsive_nav_wrap);
								hide_menu.prependTo(container);
								menu_added = true;
							}
	
							if(container.is('.show_responsive_nav')) {
								set_height();
							}
						}
					},
	
					set_height = function() {
						var height = responsive_nav.css({position:'relative'}).outerHeight(true),
							win_h  = win.height();
	
						if(height < win_h) {
							height = win_h;
						}
						responsive_nav.css({position:'absolute'});
						container.css({'height':height});
					};
	
					win.on("smartresize", set_visibility);
					set_visibility();
			}	
		};
	})(jQuery);
})(jQuery);