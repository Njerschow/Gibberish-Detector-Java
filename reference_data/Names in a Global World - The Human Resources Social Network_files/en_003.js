
(function($){ 

	var LittlePopup = function(element, options)
	{
		var $elem = $(element);
		var settings = $.extend({
			width: 400,
			height: 400,
			can_close: true,
			closeCallback: function(){}
		}, options || {});
		
		var $background, $cont, $inner;
		
		var _close_enabled = true;
		
		$elem.detach();
		
		$background = $('<div class="popupBackground"></div>'); 
		$cont = $('<div class="popupCont"></div>');
		$inner = $('<div class="popupInner"></div>');
		$close = $('<div class="popupClose"></div>');
			
		$background.css({
			position: "fixed",
			"z-index": 100000,
			top:0,
			left:0,
			width: "100%",
			height: "100%",	
			background: "url('/global_files/javascript/jquery/plugins/ui/themes/base/images/ui-bg_diagonals-thick_0_aaaaaa_40x40.png') repeat scroll 50% 50% #AAAAAA",
			opacity: 0.5		
		})		
			
		$cont.css({
			top: "50%",
			left: "50%",
			"margin-left": -settings.width/2,
			width: settings.width,
			"background-color": "white",
			position: "fixed",
			"z-index": 100001,
			"border-radius": "20px 20px 20px 20px",
			border: "1px solid #cccccc",
			"box-shadow": "3px 3px 10px #808080"		
		})
		
		$inner.css({		
			"background-color": "white",
			width: settings.width - 40,
			"border-radius": "5px 0 5px 0",
			"text-align": "left",
			"margin": 10,
			overflow: "auto",
			padding: 10
		})
	
		$close.css({
			position: "absolute",
			right: 0,
			"margin-top": -10,
			"margin-right": -10,
			width: 30,
			height: 30,
			background: 'url("/javascript/fancybox/fancybox.png") repeat scroll -40px 0 transparent',
			cursor: "pointer"
		});	
		
		$cont.append($close);
		$cont.append('<div style="clear:both;"></div>');
		$inner.append($elem);
		$cont.append($inner);
		
		var reinit_size = function(){
			$cont.css({
				"margin-top": -settings.height/2,
				"margin-left": -settings.width/2,
				width: settings.width
			});
	
			$inner.css({
				width: settings.width - 40
			});
			check_height();
		}
		
		this.setSize = function(width, height){
			settings.height = height;
			settings.width = width;
			reinit_size();
		}
		
		this.close = function(){
			if(_close_enabled){
				$background.remove(); 
				$cont.remove();
				$("body").css("overflow", "auto");
				settings.closeCallback();
			}
		}
		
		this.can_close = function(close_enabled){
			_close_enabled = close_enabled;
			if(close_enabled)
				$close.show();
			else
				$close.hide();
				
		}
				
		var check_height = function(){	
			h = $(window).height();
			
			if(settings.height === "auto"){

				$cont.css({
					position: "absolute",
					top:0,
					"margin-top": $(window).scrollTop()+10
				})
			
				
			}else{
				$cont.css({position: "fixed", top:"50%"});
				
				if(h < settings.height+20){
					$cont.css({
						"margin-top": -h/2+10,
						height: h-20
					});
					$inner.css({		
						height: h - 60
					});	
				}else{
	
					$cont.css({
						"margin-top": -settings.height/2,
						height: settings.height
					});
					$inner.css({		
						height: settings.height - 40
					});
					
				}
			}
		};
		 
		this.show = function(){
			$('body').prepend($cont);
			$('body').prepend($background);
			$background.click(this.close);	
			$close.click(this.close);
			//$("body").css("overflow", "hidden");
			check_height();
			
			$(window).resize(function() {
				check_height();
			});
		}		
		
		this.show();
		this.can_close(settings.can_close);
   };
	$.fn.littlePopup = function(options) {  
		return this.each(function() {
			$this = $(this);
			if ($this.data('littlePopup')) return;
			var littlePopup = new LittlePopup(this, options);
			$this.data('littlePopup', littlePopup);					
		});	
	};	
	  
})(jQuery);
