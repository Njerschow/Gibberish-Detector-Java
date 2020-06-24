(function($){

$.sfs = $.extend($.sfs, {});
$.sfs.application = $.extend($.sfs.application,  {sortable:{}});

$.sfs.application.screen = {
	
	exists : false,
	dialog : $('<div style="display:none; position:fixed; background: #aaaaaa url(/global_files/javascript/jquery/plugins/ui/themes/base/images/ui-bg_diagonals-thick_0_aaaaaa_40x40.png) 50% 50% repeat; opacity: .30;filter:Alpha(Opacity=30);">&nbsp;</div>'),
	
	lock : function(_ele){
		
		var default_css = {zIndex : 100000, top : 0, left : 0, width: '100%', height : $(window).height()+'px'};
		
		if (_ele) {
			var ele_css = {
				top : $(_ele).offset().top - $(window).scrollTop() + 'px',
				left : $(_ele).offset().left - $(window).scrollLeft() + 'px',
				width : $(_ele).width() + 'px',
				height : $(_ele).height() + 'px'
			};
		}
		
		var css = $.extend(default_css, ele_css);
		if (!$.sfs.application.screen.exists) {
			$.sfs.application.screen.exists = true;
			$.sfs.application.screen.dialog
				.css(css)
				.appendTo('body')
			;
		} else {
			$.sfs.application.screen.dialog.css(css);
		}
		
		if (!$.sfs.application.screen.dialog.is(':visible')) $.sfs.application.screen.dialog.fadeTo('fast', 0.3);
	},
	
	unlock : function(){
		$.sfs.application.screen.dialog.hide();
	}
};

$.sfs.application.sortable.update = function(e, ui) {
	
	var $unsavedPage = $(this).parents('.js-trigger-update');
	
	if ( $unsavedPage.get(0) ) {
		
		var $sortables = $('.js-sortable', $unsavedPage);
		$unsavedPage.removeClass('js-trigger-update');
		
		$.sfs.application.screen.lock();
		
		$sortables.each(function(){
			$(this).data('sortable')._trigger('update');
		});
		
		$.sfs.application.screen.unlock();
		
	} else {
		
		var delegate = $.proxy($.sfs.sortable.events.update, this);
		delegate(e, ui);	
	}
};

$.sfs.application.sortable.receiveItem = function(e, ui) {
	
	if (ui.sender && ui.sender.data('draggable')) {
		
		var controller = $(this).data('sfs').sortable.controller.url || $(this).data('sfs').sortable.controller || false;
		
		if (controller) {
			
			var $sortable = $(this);
			
			var data = {
				action : 'receive',
				sortable : $.json.write({attr:{id:$(this).attr('id')}, item:{attr:{id:$(ui.item).attr('id')}}, data:$(this).data('sfs').sortable.controller.data || {}})
			};
			
			$.ajax({
				url : controller,
				data : data,
				async : false,
				success : function(response){
					
					$sortable.find('.widget:not([id])').eq(0).replaceWith(response);
					// $('#'+$(ui.item).attr('id'), $sortable).replaceWith(response);
					$sortable.sortable('refreshPositions');
				}
			});
		}
	}
};

$.sfs.application.sortable.removeItem = function(e) {
	
	var $sortable = $(this).parents('.js-sortable');
	var $widget = $(this).parents('.widget');
	
	var controller = $sortable.data('sfs').sortable.controller.url || $(this).data('sfs').sortable.controller || false;
	
	if (controller) {
		
		var data = {
			action : 'removeItem',
			sortable : $.json.write({attr:{id:$sortable.attr('id')}, item:{attr:{id:$widget.attr('id')}}, data:$sortable.data('sfs').sortable.controller.data || {}})
		};
		
		$.post(controller, data);
		
		$widget.remove();
		$sortable.sortable('refreshPositions');
		$sortable.data('sortable')._trigger('update');
	}
	
	return false;
};

$(function(){
	
	$('.js-icon-close', $('.js-sortable > .widget')).live('click', $.sfs.application.sortable.removeItem);
	
});

})(jQuery);
(function($){

$.sfs = $.extend($.sfs, {});
$.sfs.application = $.extend($.sfs.application,  {pool:{draggable:{start:false},form:{}}});

$.sfs.application.pool.draggable.start = function(e, ui) {
	
	if (ui.helper && e.target) ui.helper.width($(e.target).width()).height($(e.target).height());
};

$.sfs.application.pool.toggle = function(e) {
	
	var $handle = $(e.target);
	var $pool = $('#applicationPool>.stage');
	
	if($pool.is(':visible')) {
		
		$pool.slideUp('normal', function(){$handle.addClass('closed').removeClass('opened');});
		
	} else {
		
		// pool loaded?
		if ( $pool.data('sfsAppPoolLoaded') ) {
			
			$pool.slideDown('normal', function(){$handle.addClass('opened').removeClass('closed');});
		}
		else {
			
			$pool.data('sfsAppPoolLoaded', true);
			
			var controller = $handle.attr('href');
			$.get(controller, function(res){
				
				$pool
					.html(res)
					.slideDown('normal', function(){$handle.addClass('opened').removeClass('closed');})
				;
				
			});
			
		}
	}
	
	return false;
};

$.sfs.application.pool.form.submit = function(eve){
	
	eve.preventDefault();
	
	$(this).ajaxSubmit({
		
		target : '.js-appPool-itemContainer',
		
		beforeSubmit : function (e, $form) {
			
			$('input, select', $form).each(function(){this.disabled = true;});
		},
		
		success : function (response, status, xhr, $form) {
			
			$.sfs.draggable.init($.sfs.draggable.setup['appPool']);
			$('input, select', $form).each(function(){this.disabled = false;});
		},
		
		error : function (e, $form) {
			$('input, select', $form).each(function(){this.disabled = false;});
		}
	});
	
	// return false;
};

$(function(){
	
	$('.js-appPool-form').live('submit', $.sfs.application.pool.form.submit);
	
	$('.js-appPool-toggle').click($.sfs.application.pool.toggle);
	
	$('.js-canvas-control').live('click', function(e){
		
		var $unsavedPage = $('div.canvas.js-page.js-trigger-update');
		var $link = $(this);
		var controller = {url:$link.attr('href')};
		
		if ( $unsavedPage.get(0) ) {
			$('.js-sortable', $unsavedPage).eq(0).data('sortable')._trigger('update');
		} else {
			$.sfs.application.screen.lock();
		}
		
		controller.data = ($(this).data('controller')) ? $(this).data('controller').data || {} : {};
		
		$.get(controller.url, controller.data, function(res){
			
			if ($link.attr('target') && $link.attr('target').indexOf('#') === 0) {
				$($link.attr('target')).replaceWith(res);
			} else {
				$('div.canvas.js-page').replaceWith(res);
			}
						
			$.sfs.application.screen.unlock();
		});
		
		return false;
	});
	
});

})(jQuery);
(function($){

$.sfs = $.extend($.sfs, {});
$.sfs.application = $.extend($.sfs.application,  {widget:{}});

$.sfs.application.widget.toggleSettings = function(e) {

	var $widget = $(this).parents('.widget');
	var $settings = $('.settings', $('.content', $widget));
	$settings.toggle();
	
	return false;
};

$.sfs.application.widget.link = function(e) {
	
	var $link = $(this);
	if (
		$link.prop('target') != 'widget' && !$link.parents('.js-section').get(0) ||
		$link.prop('target') != 'widget' && $link.prop('target') != '' ||
		$link.prop('target') != 'widget' && $link.prop('target') == '#'
	) return true ;
	
	e.preventDefault();
	
	var $link = $(this);
	var $widget = $link.parents('.widget').eq(0);
	var $section = $link.parents('.js-section').eq(0);
	var $sortable = $widget.parents('.js-sortable').eq(0);
	var $unsavedPage = $sortable.parents('.js-trigger-update');
	var href = $link.attr('href');
	
	// update/save sortables
	if ( $unsavedPage.get(0)  && $link.prop('target') == 'widget' ) $sortable.data('sortable')._trigger('update') ;
	
	var widget = {attr : {id : $widget.prop('id')}};
	var sortable = ($sortable.data('sfs')) ?  $sortable.data('sfs').sortable.controller.data || {} : {};
	var data = {widget : $.json.write(widget), sortable:$.json.write(sortable)};
	
	$.ajax({
		
		url : href,
		data : data,
		
		beforeSend : function(){
			
			if ($sortable.sortable) $sortable.sortable( 'disable' );
			$('.js-loading', $widget).show();
		},
		success : function(res){
			
			if ( $link.prop('target') === 'widget' ){

				$widget.replaceWith(res);
				
				if ($sortable.sortable) {
					$sortable.data('sortable')._trigger( 'update' );
					$sortable.sortable( 'refreshPositions' );
				}
				
			} else {
				$section.html(res);
			}
			
			$('.js-loading', $widget).hide();
			if ($sortable.sortable) $sortable.sortable( 'enable' );
		},
		error : function(xhr){

			$('.js-loading', $widget).hide();
			if ($sortable.sortable) $sortable.sortable( 'enable' );
		}
	});
	
	return false;
};

$.sfs.application.widget.form = function(e) {
	
	if (typeof sfsAcLayer != 'undefined' && sfsAcLayer.active) return false;
	
	var self = this;
	var $form = $(this).parents('form').eq(0);
	if (
		$form.prop('target') != 'widget' && !$form.parents('.js-section').get(0) ||
		$form.prop('target') != 'widget' && $form.prop('target') != ''
	) return true;
	
	if (e) e.preventDefault();
	
	// search for FCKEditor instances, try to update linked element
	var $textareas = $('.js-fckEditor', $form);
	if ( $textareas.get(0) && !self.fckEditorPresent && (typeof FCKeditorAPI != 'undefined') ) {
		
		self.fckEditorPresent = true;
		var editorCallbackAttached = false;
		
		$.each($textareas, function(i, textarea){
			try {
				
				var editor = FCKeditorAPI.GetInstance($(textarea).attr('name'));
				if (editor) {
					editor.Events.AttachEvent( 'OnAfterLinkedFieldUpdate', $.proxy($.sfs.application.widget.form, self) ) ;
					editor.UpdateLinkedField();
					
					editorCallbackAttached = true;
				}
				
			} catch (e) {}
		});
		
		if (editorCallbackAttached) return false;
	}
	
	var $widget = $form.parents('.widget');
	var $sortable = $widget.parents('.js-sortable').eq(0);
	
	// unsaved page
	var $unsavedPage = $sortable.parents('.js-trigger-update');
	if ( $unsavedPage.get(0)  && $form.prop('target') == 'widget' ) $sortable.data('sortable')._trigger('update');
	
	// controller data
	var widget = {attr : {id : $widget.attr('id')}};
	var sortable = ($sortable.data('sfs') && $sortable.data('sfs').sortable) ?  $sortable.data('sfs').sortable.controller.data || {} : {};
	var data = {widget : $.json.write(widget), sortable:$.json.write(sortable)};
	// provide clicked inputElement as param
	var $clickedInput = $(e.target);
	data[$clickedInput.prop('name')] = $clickedInput.prop('value');
	// remote header impl
	data['X-Requested-With'] = 'AjaxFormSubmit';
	
	// submit
	$form.ajaxSubmit({
		
		data : data,
		
		beforeSubmit : function(arr, $form, options){
			
			// alert(options)
			
			$('.js-loading', $widget).show();
			$form.find('input[type=submit]').each(function(){this.disabled=true;});
			$form.fadeTo('fast', 0.5);
			
			if ($sortable.sortable) $sortable.sortable( 'disable' );
		},
		
		success : function(res) {
			
			if ( $form.prop('target') === 'widget' ) {
				
				$widget.replaceWith(res);
				
				if ($sortable.sortable) {
				
					$sortable.data('sortable')._trigger('update');
					$sortable.sortable('refreshPositions');
				}
				
			} else if ($form.parents('.js-section').get(0)) {
				
				var $section = $form.parents('.js-section');
				$section.html(res);
				
			} else {
				
				$form
					.fadeTo('fast', 1)
					.find('input[type=submit]').each(function(){this.disabled=false;})
				;
			}
			
			$('.js-loading', $widget).hide();
			if ($sortable.sortable) $sortable.sortable( 'enable' );
		},
		
		error : function(req){
			
			$form
				.fadeTo('fast', 1)
				.find('input[type=submit]').each(function(){this.disabled=false;})
			;
			
			$('.js-loading', $widget).hide();
			if ($sortable.sortable) $sortable.sortable( 'enable' );
		}
		
	});
	
	return false;
};

$(function(){
	
	$('.js-icon-settings', '.js-sortable > .widget').live('click', $.sfs.application.widget.toggleSettings);
	$('input:submit, input:image', '.widget').live('click', $.sfs.application.widget.form);
	
	$('a[target!=widget]', $('.js-section', '.widget')).live('click', $.sfs.application.widget.link);
	$('a[target=widget]', '.widget').live('click', $.sfs.application.widget.link);
});

})(jQuery);
(function($){

	$.sfs = $.extend($.sfs, {});
	$.sfs.app = $.extend($.sfs.app, {contextMenu:{}});
	
	$.sfs.app.contextMenu.position = function(e, ui){
	
		var $menu = $(this);
		var $context = ui.context;
		var c_pos = $context.position();
		
		$menu.css({
			top: c_pos.top + $context.outerHeight() + 'px' ,
			left: c_pos.left + $context.outerWidth() - $menu.outerWidth() + 2 + 'px'
		});
	};
	
	$.sfs.app.contextMenu.open = function(e, ui){
		
		// table row highlighting
		var $parent_tr = $(ui.context).parents('tr');
		if ($parent_tr.get(0)) $parent_tr.addClass('dialogListCell_3');
	};
	
	$.sfs.app.contextMenu.close = function (e, ui) {
		
		var $parent_tr = $(ui.context).parents('tr');
		if ($parent_tr.get(0)) $parent_tr.removeClass('dialogListCell_3');
	};

})(jQuery);
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(7($){3 l={q:\'G\',o:9,N:9,U:9,r:9,R:9,Y:9,X:0,y:9};$.1b.4=7(f){t B.W(7(){3 a=$.P({},l,f);3 b=$(B);3 c=(a.q!=\'G\')?b.V(a.q):b.G();c=(c.s(0))?c:b.G();b.T(\'4.o\',{q:c,A:a},$.6.4.o);b.T(\'4.r\',{q:c,A:a},$.6.4.r);3 d=(a.r&&(a.R||a.Y))?9:v;3 e=(a.o&&(a.N||a.U))?9:v;5($.6.4.11(B)){5(d)b.I(\'4.r\');5(e)b.I(\'4.o\');5(b.s(0).K.D()==\'F\'||b.s(0).K.D()==\'w\'){5(e)$.6.4.o({8:b.s(0),u:{q:c,A:a}})}}t b})};$.6=($.6)?$.6:{};$.6.4={H:[],O:v,1c:7(d){$(S).1g(7(){3 a=d.Z?d.Z:d;3 b=(1e a==\'w\')?$(a[0],1i(\'(\'+a[1]+\')\')):$(a);3 c=$.P({},d);5(b.s(0)){b.4(c).u(\'6\',$.P(b.u(\'6\'),{4:c}))}})},11:7(a){3 b=v;$.W($.6.4.H,7(){5(B===a){b=9;t v}});5(!b){$.6.4.H.1l(a);t 9}z{t v}},o:7(e){3 a=e.u.q;3 b=a.p(\'C\');3 c=a.p(\'E\').D();a.p({C:\'13\'});3 d={m:a.J(),n:a.L()};3 f;3 g=e.8.K.D();5($.M.12||$.M.19){f=(g==\'w\')?$(e.8).17(\'F\'):$(e.8).x()}z 5(g==\'F\'){f=$(e.8).V(\'w\');5(!f.s(0))t;f.x()}z{f=$(e.8).x()}3 h={m:f.J(),n:f.L(),E:f.E()};3 i=e.u.A;3 j=(i.U)?d.n/2-h.n/2:h.E.1d;3 k=(i.N)?d.m/2-h.m/2:h.E.15;5(a.p(\'14-18\')==\'o\')a.p(\'14-18\',\'15\');f.p({1f:j+\'1a\',1j:k+\'1a\'}).16();a.p({C:b})},r:7(e){3 a=e.u.q;3 b=a.p(\'C\');a.p({C:\'13\'});3 c={m:a.J(),n:a.L()};3 d;3 f=e.8.K.D();5($.M.12||$.M.19){d=(f==\'w\')?$(e.8).17(\'F\'):$(e.8).x()}z 5(f==\'F\'){d=$(e.8).V(\'w\');5(!d.s(0))t;d.x()}z{d=$(e.8).x()}3 g={m:d.J(),n:d.L()};3 h=g.m;3 i=g.n;3 j=h/i;3 k=e.u.A;5(k.R&&h>c.m||!k.y){h=c.m-k.X*2;i=(k.y)?h/j:i}5(k.Y&&i>c.n||!k.y){i=c.n-k.X*2;h=(k.y)?i*j:h}5(i<0||h<0){i=0;i=0}$(e.8).m(h).n(i).16()},Q:7(){1h($.6.4.O);$.6.4.O=S.1k(7(){$.W($.6.4.H,7(){$(B).I(\'4.r\').I(\'4.o\')})},10)}};$(S).T(\'Q\',$.6.4.Q)})(1m);',62,85,'|||var|adjust|if|sfs|function|target|true|||||||||||||width|height|center|css|stage|scale|get|return|data|false|object|hide|aspectRatio|else|opt|this|overflow|toLowerCase|position|embed|parent|elements|trigger|innerWidth|tagName|innerHeight|browser|centerX|resizeTimeout|extend|resize|scaleX|window|bind|centerY|parents|each|scaleMargin|scaleY|selector||registerElement|opera|hidden|text|left|show|children|align|mozilla|px|fn|init|top|typeof|marginTop|load|clearTimeout|eval|marginLeft|setTimeout|push|jQuery'.split('|'),0,{}));
(function( $ ) {

$.sfs = $.extend($.sfs,
{
	autocomplete :
	{
		init : function(_opt)
		{
			$(function() {
				
				var $autocomplete = $(_opt.selector || _opt);
				
				var opt = $.extend(
					{
						html : true
					}
					,_opt
				);
				
				// eval event handlers
				$.each($.sfs.autocomplete.events, function(i, e){
					if( opt[e] && typeof opt[e] !== 'function') {
						opt[e] = eval('( 0 ||' + opt[e] + ')');
					}
				});
				
				// init
				if ( $autocomplete.get(0) ) {
					
					$autocomplete
						.data('sfs', $.extend($autocomplete.data('sfs'), {autocomplete: opt}))
						.sfAutocomplete(opt)
					;
				}
				
			});
		},
		events: ['select']
	}
});

$.widget('sf.sfAutocomplete', $.ui.autocomplete, {
	
	options : {
		searchOnFocus : true,
		searchOnSelect : true,
		// scrollable : true,
		maxHeight : false,
		submitIfOpened : true,
		submitWithoutValue : false,
		submitOnSelect : false
		// submitWithoutSelection : true,
		// submitOnClose : false
	},
	
	_create: function() {
		
		var self = this;
		
		this.element.addClass('sf-autocomplete-input');
		if ($.browser.msie) this.element.addClass('msie');
		
		// controller
		if (self.options.controller) {
			self.controller = {
				url : decodeURIComponent(self.options.controller.url || self.options.controller),
				autocomplete : {
					attr : { id : self.element.attr('id') },
					data : self.options.controller.data || {},
					items : []
				}
			};
		}
		
		// reference
		if ( self.options.reference ) {
			
			self.reference = $(self.options.reference);
			self._updateReference();
		}
		
		// references
		if ( self.options.controller && self.options.references ) {
			
			self.references = $(self.options.references);
			self._updateReferences();
		}
		
		// collector
		if ( self.options.collector ) {
			self.collector = {
				element : $(self.options.collector)
			}
			
			var $selectees = self.options.collector.items ? $(self.options.collector.items, self.collector.element) : self.collector.element.children();
			$selectees.each(function(i, ele){
				
				var $handle = $('.js-deselect', ele).get(0)? $('.js-deselect', ele) : $(ele);
				
				$handle.bind('click', function(e){
					$.proxy(function(){self.__deselectItem(e, null, $(ele));}, self)();
				});
			});
		}
		
		this.element.bind('sfautocompletefocus', function(e, ui){
			
			if ( self.options.html ) return false;
		});
		
		// on select item
		this.element.bind('sfautocompleteselect', function(e, ui){
			return self.__selectItem.apply(self, arguments);
		});
		
		// open on focus
		this.element.bind('focus.sfautocomplete, click', function(e){
			$(this).addClass('sf-autocomplete-focus');
			if ( !self.menu.element.is(':visible') && self.options.searchOnFocus ) self.search(null);
		});
		
		// blur
		this.element.bind('blur.sfautocomplete', function(e){
			$(this).removeClass('sf-autocomplete-focus');
		});
		
		// close on keydown = enter
		this.element.bind('keydown.sfautocomplete', function(e){
			
			if (e.which !== 13) return true;
			
			if (
				( !self.options.submitIfOpened && !self.menu.active && self.menu.element.is(':visible') ) ||
				( !self.options.submitWithoutValue && !self.menu.active && $.trim(self.element.val()) == '')
			){
				e.preventDefault();
				self.close();
			}
			
			return true;
		});
		
		$.ui.autocomplete.prototype._create.call(this);
		
		// maxHeight?
		if(this.options.maxHeight) {
			
			var maxHeight = (parseInt(this.options.maxHeight) == this.options.maxHeight)? this.options.maxHeight + 'px' : this.options.maxHeight;
			
			this.menu.element.css({
				overflowX : 'hidden',
				overflowY : 'auto',
				maxHeight : maxHeight
			});
		}
	},
	
	_updateReference : function(_val){
		
		var self = this;
		if (!self.reference) return ;
		
		var $ele = $(self.reference);
		if (
			_val !== undefined &&
			$ele.get(0).tagName.toLowerCase() != 'select'
		){
			$ele.val(_val);
		}
		
		var ref = {
			attr:{id:$ele.attr('id')},
			val : $ele.val()
		};
		
		if (self.controller) self.controller.autocomplete.reference = ref;
	},
	
	_updateReferences : function(_refs){
		
		var self = this;
		
		if (!self.references) return ;
		
		if (_refs) {
			
			$.each(_refs, function(i, prop){
				
				var $ele = $(self.references[i]);
				if (!$ele.get(0)) return ;
				
				if ($.isArray(prop)) {
					
					$.each(prop, function(i, prop){
						$.each(prop, function(method, _args){
							var args = ($.isArray(_args)) ? _args : [_args];
							$ele.eq(i)[method].apply($ele.eq(i), args);
						});
					});
					
				} else {
					
					$.each(prop, function(method, _args){
						
						var args = ($.isArray(_args)) ? _args : [_args];
						$ele[method].apply($ele, args);
					});
				}
			});
		}
		
		self.controller.autocomplete.references = [];
		
		$.each(self.references, function(i, ele){
			
			var $ele = $(ele), ref = null;
			if ($ele.length > 1) {
				
				ref = [];
				$.each($ele, function(i, ele){
					var $ele = $(ele);
					ref.push({
						attr:{id:$ele.attr('id')},
						val : $ele.val(),
						prop : {
							checked : $ele.prop('checked'),
							selected : $ele.prop('selected')
						}
					});
				});
				
			} else {
				
				ref = {
					attr:{id:$ele.attr('id')},
					val : $ele.val(),
					prop : {
						checked : $ele.prop('checked'),
						selected : $ele.prop('selected')
					}
				}
			}
			
			self.controller.autocomplete.references.push(ref);
		});
	},
	
	__selectItem : function(e, ui) {
		
		var self = this;
		
		if ( ui.item.selectable === false ) return false;
		
		if (self.collector) {
			
			self._updateReference();
			self._updateReferences();
			
			var data = {
				autocomplete : $.json.write($.extend(
					{
						action : 'select',
						value : self.element.val()
						,item : ui.item
					},
					self.controller.autocomplete
				))
			};
			
			$.ajax({
				type : 'post',
				async : true,
				url : self.controller.url,
				data : data,
				beforeSend : function(xhr){
					self.element.addClass('sf-autocomplete-loading');
				},
				success : function (res) {
					
					self.element.removeClass('sf-autocomplete-loading');
					
					if ( res === false ) return false;
					if (res.data) self.controller.autocomplete.data = res.data;
					if (res.value != self.element.val()) self.element.val(res.value);
					if (res.references) self._updateReferences(res.references);
					if (self.reference) self._updateReference(ui.item.id || ui.item.value || ui.item.label);
					
					var $selectee = $(res.item.value || res.item.label || res.item);
					var $handle = $('.js-deselect', $selectee).get(0)? $('.js-deselect', $selectee) : $selectee;
					$handle.bind('click', function(e){
						
						$.proxy(function(){self.__deselectItem(e, ui, $selectee);}, self)();
					});
					
					self.collector.element.append($selectee);
					
					if (self.options.searchOnSelect) {
					
						window.setTimeout(function(){
							self.element.get(0).select();
							self.search(null);
						}, 0);
					
					} else if (self.options.submitOnSelect) {
					
						self.element.closest('form').submit();
					}
				}
			});
			
			return false;
			
		} else if (self.controller && self.controller.url) {
			
			self._updateReference();
			self._updateReferences();
			
			var data = {
				autocomplete : $.json.write($.extend(
					{
						action : 'select',
						value : self.element.val()
						,item : ui.item
					},
					self.controller.autocomplete
				))
			};
			
			$.ajax({
				type : 'post',
				async : true,
				url : self.controller.url,
				data : data,
				beforeSend : function(xhr){
					self.element.addClass('sf-autocomplete-loading');
				},
				success : function (res) {
					
					self.element.removeClass('sf-autocomplete-loading');
					
					if ( res === false ) return false;
					if (res.data) self.controller.autocomplete.data = res.data;
					if (res.references) self._updateReferences(res.references);
					if (self.reference) self._updateReference(ui.item.id || ui.item.value || ui.item.label);
					
					res.value != self.element.val()
					? self.element.val(res.value)
					: self.element.val(ui.item.value);
					
					if (self.options.submitOnSelect) {
						self.element.closest('form').submit();
					}
				}
			});
			
			return false;
			
		} else {
			
			if (self.reference) self._updateReference(ui.item.id || ui.item.value || ui.item.label);
			if (self.options.submitOnSelect) {
				self.element.closest('form').submit();
			}

			return true;
		}
	},
	
	__deselectItem : function(e, ui, $selectee) {
		
		e.preventDefault();
		var self = this;
		
		var ui = ui || {};
		ui.item = $.extend(ui.item||{}, {
			attr:{
				id:$selectee.attr('id') || ''
			}
		});
		
		if ( ui.item.deselectable === false ) return false;
		
		if (self.collector) {
			
			self._updateReference();
			self._updateReferences();
			
			var data = {
				autocomplete : $.json.write($.extend(
					{
						action : 'deselect',
						value : self.element.val()
						,item : ui.item
					},
					self.controller.autocomplete
				))
			};
			
			$.ajax({
				type : 'post',
				async : false,
				url : self.controller.url,
				data : data,
				beforeSend : function(xhr){
					self.element.addClass('sf-autocomplete-loading');
				},
				success : function (res) {
					
					self.element.removeClass('sf-autocomplete-loading');
					
					if ( res === false ) return false;
					if (res.data) self.controller.autocomplete.data = res.data;
					if (res.value != self.element.val()) self.element.val(res.value);
					if (res.references) self._updateReferences(res.references);
					
					$selectee.remove();
				}
			});
		}
	},
	
	_initSource: function() {
		
		if (this.controller) {
			
			var self = this;
			
			self.source = function( request, response ) {
				
				self._updateReference();
				self._updateReferences();
				
				var data = {
					autocomplete : $.json.write($.extend(
						{
							action : 'search',
							value : request.term,
							range : self.element.getSelection()
						},
						self.controller.autocomplete
					))
				};
				
				$.ajax({
					type : 'post',
					async : false,
					url : self.controller.url,
					data : data,
					success : function (res) {
						
						try {
							if ( $.isPlainObject(res) ) {
								
								if (res.data) self.controller.autocomplete.data = res.data;
								if (res.value != self.element.val()) self.element.val(res.value);
								if (res.references) self._updateReferences(res.references);
								if (res.reference) self._updateReference(res.reference.val || '');
								
								response(res.items || []);
								
							} else {
								
								response(res)
							};
							
						} catch (e) {
							
							$.sfs.errorHandler.showErrorDialog(e);
						}
					}
				});
			};
			
		} else if ( this.options.html && $.isArray(this.options.source) ) {
			
			this.source = function( request, response ) {
				
				if (this.reference) this._updateReference('');
				response( this.__filter( this.options.source, request.term ) );
			};
		} else {
			
			$.ui.autocomplete.prototype._initSource.call(this);
		}
	},
	
	_renderItem: function( ul, item) {
		
		var $item = $( "<li></li>" );
		if (item.attr) $item.attr(item.attr);
		
		return $item
			.data( "item.autocomplete", item )
			.append( $( "<a></a>" )[ this.options.html ? "html" : "text" ]( item.label ) )
			.appendTo( ul );
	},
	
	__filter : function( array, term ){
		
		var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
		return $.grep( array, function(value) {
			return matcher.test( $( "<div>" ).html( value.label || value.value || value ).text() );
		});
	},
	
	destroy : function(){
		
		this.element.removeClass('sf-autocomplete-input sf-autocomplete-focus sf-autocomplete-loading');
		$.ui.autocomplete.prototype.destroy.call(this);
	}
	
});

})( jQuery );
(function($){

$.sfs = $.extend($.sfs, 
{
	contextMenu :
	{
		init : function(_opt)
		{
			$(function() {
				
				var $contextMenu = $(_opt.selector);
				
				var opt = $.extend (
					{}
					,$.sfs.contextMenu.events
					,_opt
				);
				
				// event handler
				for (e in $.sfs.contextMenu.events) {
					
					if(opt[e] && typeof opt[e] !== 'function') opt[e] = eval('('+opt[e]+')');
				}
				
				// init
				if($contextMenu.get(0)) {
					
					$contextMenu
						.contextMenu(opt)
						.data('sfs', $.extend($contextMenu.data('sfs'), {contextMenu: opt}));
				}
			});
		},
		
		events : {open:null, close:null, position:null} // hover:null, select:null, 
	}
});

$.widget("ui.contextMenu", {
	
	// default options
	options: {
		event : 'click',
		toggle : true,
		position : 'auto',
		nested : false
	},
	
	_create: function() {
		
		this.element.hide();
		
		$('form', this.element).bind('submit', $.proxy(this, 'closeActiveMenu'));
		$('a', this.element).bind('click', $.proxy(this, 'closeActiveMenu'));
		
		var $context = $(this.options.context);
		if ($context) $context.bind (this.options.event, $.proxy(this, '_open'));
	},
	
	_calculatePosition : function () {
		
		var $menu = this.element;
		var $context = $.ui.contextMenu.activeContext;
		
		var c_pos = $context.position();
		var m_pos = $menu.position();
		
		var css_opt = {
			position: 'absolute',
			top : c_pos.top + $context.height(),
			left : c_pos.left
		};
		
		css_opt.top += 'px';
		css_opt.left += 'px';
		
		$menu.css(css_opt);
		
		this._trigger('position', e, {context:$context});
		
		return this;
	},
	
	_open : function (e) {
		
		e.stopPropagation();
		
		var $menu = this.element;
		var $context = $(e.currentTarget);
		
		if( $context.get(0) !== (($.ui.contextMenu.activeContext)? $.ui.contextMenu.activeContext.get(0) : null) || !$menu.is(':visible')  ) {
			
			this.closeActiveMenu(e);
			
			$.ui.contextMenu.activeMenu = $menu;
			$.ui.contextMenu.activeContext = $context;
			
			this._calculatePosition();
			
			$menu.show();
			this._trigger('open', e, {context:$context});

		} else {
			
			this.closeActiveMenu(e);
		}
		
		return false;
	},
	
	adjust : function() {
		
		this._calculatePosition();
	},
	
	closeActiveMenu : function(e){
		
		var $menu = $.ui.contextMenu.activeMenu;
		
		if ($menu && $menu.is(':visible')) {
		
			$.ui.contextMenu.activeMenu.hide();
			this._trigger('close', e, {context:$.ui.contextMenu.activeContext});
		}
	},
	
	destroy: function() {
		$.Widget.prototype.destroy.apply(this, arguments); // default destroy
		// now do other stuff particular to this widget
	}
});

$(document).click(function(event){

	if ( !$(event.target).closest('.contextMenu').length ) {
		var $menu = $.ui.contextMenu.activeMenu;
		if ($menu) {
			try{
				$menu.contextMenu('closeActiveMenu');
			} catch(e) {}
		}
	}
	
});
$(window).resize(function(){
	
	var $menu = $.ui.contextMenu.activeMenu;
	if ($menu) $menu.contextMenu('adjust');
});

})(jQuery);
$.sfs = $.extend($.sfs,
{
	data :
	{
		init : function(_opt)
		{
			$(function() {
				
				var $ele = $(_opt.selector ? _opt.selector : false);
				var data = _opt.data;
				
				if ( !$ele.get(0) || !data) return;
				for (e in data) $ele.data(e, data[e]);
			});
		}
	}
});
(function($){

$.sfs = $.extend($.sfs,{

	dialog : {
		init : function(_opt) {
			$(function() {
				
				if (_opt.selector) {
					$(_opt.selector).sfDialog(_opt);
				} else {
					var $dialog = $('<div title="" style="display:none"></div>').appendTo('body');
					$dialog.sfDialog(_opt);
				}
				
			});
		}
	}
});

$.widget('sf.sfDialog', $.ui.dialog, {
	
	options : {
		
		autoOpen : false
	},
	
	_create : function(){
		
		var self = this;
		
		this.controller = {
			url : (this.options.controller)? this.options.controller.url || (((typeof this.options.controller).toLowerCase() == 'string')? this.options.controller : false )  : false,
			data : {
				action : '',
				opener : false,
				element : {attr : {
					id : this.element.attr('id') || ''
				}},
				data : (this.options.controller)? this.options.controller.data || {} : {}
			}
		};
		
		// observer
		this.element.on('click', 'a', $.proxy(this._onLinkClick, this));
		$('input:submit', this.element).live('click', $.proxy(this._onFormInputClick, this));
		// content?
		if(this.options.html) this.element.html(this.options.html);
		// no selector?
		if (!this.options.selector) this.options.autoOpen = this.options.autoOpen || false;
		// opener?
		if (this.options.opener) $(this.options.opener).on('click', $.proxy(this, '__open'));
		
		$.ui.dialog.prototype._create.apply(this, arguments);
	},
	
	_onFormInputClick : function(e){
		
		var self = this;
		var $input = $(e.target);
		var $form = $input.closest('form');
		
		if (
			( $form.attr('href') && $form.attr('href').indexOf('http') == 0 ) ||
			( $form.attr('target') && $form.attr('target').indexOf('_') == 0 )
		){
			self.close();
			return true;
		}
		else if ($form.attr('href') == '#') {
			e.preventDefault();
			self.close();
			return ;
		}
		else {
			e.preventDefault();
		}
		
		this.controller.data.action = 'close';
		var data = {dialog:$.json.write(self.controller.data)};
		data[$input.attr('name')] = $input.val();
		
		$form.ajaxSubmit({
			
			beforeSubmit : function(){
				
				$('input:submit', $form).prop('disabled', true);
			},
			data : data,
			success : function(res){
				
				$('input:submit', $form).prop('disabled', false);
				if ($form.attr('target')) $($form.attr('target')).html(res);
				self.close();
			},
			error : function(){
				
				self.close();
				$('input:submit', $form).prop('disabled', false);
			}
			
		});
	},
	
	_onLinkClick : function(e){
		
		var self = this;
		var $link = $(e.currentTarget);
		
		if (
			// ( $link.attr('href') && $link.attr('href').indexOf('http') == 0 ) ||
			( $link.attr('target') && $link.attr('target').indexOf('_') == 0 )
		){
			self.close();
			return true ;
		}
		else if (  $link.attr('href').indexOf('#', $link.attr('href').length - 1) !== -1  ) {
			
			e.preventDefault();
			self.close();
			return false;
		}
		else {
			e.preventDefault();
		}
		
		this.controller.data.action = 'close';
		$.get($link.attr('href'), {dialog:$.json.write(self.controller.data)}, function(res){
			
			if ($link.attr('target')) $($link.attr('target')).html(res);
			self.close();
		});
		
	},
	/*
	open : function(e) {
		
		if (this.options.html) this.element.html(this.options.html);
		if (this.options.title) this.element.dialog('option','title',this.options.title);
		
		$.ui.dialog.prototype.open.apply(this, arguments);
	},
	*/
	__open : function (e) {
		
		var self = this;
		var $opener = $(e.currentTarget);
		
		this.controller.data.action = 'open';
		this.controller.data.opener = { attr : {
			id : $opener.attr('id') || ''
		}};
		
		e.preventDefault();
		
		if (this.controller.url) {
			
			$.post(this.controller.url, {dialog:$.json.write(this.controller.data)}, function(res){
				
				if (!res) return ;
				
				$.each(res.element || {}, function(method, args){
					self.element[method].apply( self.element, ($.isArray[args])? args : [args] );
				});
			});
			
		} else if (
			$opener.attr('href') &&
			$opener.attr('href').indexOf('http') == 0
		){
			
			// iframe impl. is missing
			// ...
			
		} else if (
			$opener.attr('href') && 
			$opener.attr('href').indexOf('#') != 0 &&
			(
				!$opener.attr('target') ||
				$opener.attr('target').indexOf('_') != 0
			)
		){
			$.ajax({
				
				url : $opener.attr('href'),
				data : {dialog:$.json.write(this.controller.data)},
				success : function(res){
					
					if (!res) return ;
					
					$.extend(self.controller.data.data, res.data);
					
					// self.open();
					
					$.each(res.element || {}, function(method, args){
						self.element[method].apply( self.element, ($.isArray[args])? args : [args] );
					});

					$.each(res.option || {}, function(name, val){
						self['option'].apply(self, [name, val]);
					});
					
					self.open();
					
					$.each(res.method || {}, function(name, args){
						self[name].apply(self, ($.isArray(args))? args : [args || '']);
					});
					
					$.each(res.opener || {}, function(method, args){
						$opener[method].apply( $opener, ($.isArray[args])? args : [args] );
					});
					
				}
			});
			
		} else {
			
			// if (this.options.html) this.element.html(this.options.html);
			// if (this.options.title) this.element.dialog('option','title',this.options.title);
			
			self.open();
		}
	}
});

})(jQuery);
$.sfs = $.extend($.sfs, 
{
	draggable :
	{
		setup : {},
		init : function(_opt)
		{
			$(function() {
				
				var selector = _opt.selector ? _opt.selector : _opt;
				var $draggable = $(selector);
				
				if (_opt.setup) {
					
					$.sfs.draggable.setup[_opt.setup] = _opt;
					delete _opt.setup;
				}
				
				var opt = $.extend(
					{
						addClasses: false
						,zIndex: 10200
						,revert: 'invalid'
					}
					,$.sfs.draggable.events
					,_opt
				);
				
				// event handler
				for (e in $.sfs.draggable.events) {
					
					if(opt[e] && typeof opt[e] !== 'function') opt[e] = eval('('+opt[e]+')');
				}
				
				// init
				if($draggable.get(0)) {
					
					$draggable
						.draggable(opt)
						.data('sfs', $.extend($draggable.data('sfs'), {draggable: opt}));
					
					$(opt.handle, $draggable)
						.disableSelection()
						.css('cursor', 'move')
					;
				}
			});
		},
		events : 
		{
			start : function(e, ui) {
				
				// alert($(e.target).width())
				// alert($(ui.helper).width())
				
			}
			
			,drag : function (e, ui) {}
			
			,stop : function(e, ui) {
				
				/*
				var controller = $(this).data('sfs').draggable.controller.url || $(this).data('sfs').draggable.controller;
				
				if (controller) {
					
					var draggable = {
						attr : {id : $(this).attr('id')},
						data : $(this).data('sfs').draggable.controller.data || {}
					};
					
					$.post(controller, {action:'stop', draggable:$.json.write(draggable)}, function(res){});
				}
				*/
			}
			
		} /// events
	}/// ns:sortable
});
(function($){

$.sfs = $.extend($.sfs, {});

$.sfs.errorHandler = {
	
	dialog : false,
	element : $('<div style="display:none" title="Error">&nbsp;</div>'),
	
	showErrorDialog : function(e, xhr, settings, exception) {
		
		if (!e.type) {
			
			// inline error
			var error_html = '<div id="errorDetails">' + e.toString() + '</div>';
			
		} else {
			
			// xhr error
			
			if (xhr.status == 0 || xhr.status == 200) return;
			if (xhr.status == 403) return document.location.reload();
			
			var error_msg = $('#errorDetails', xhr.responseText).html() || $('.dialogMessage', xhr.responseText).html() || 'Status: ' + xhr.status;
			var error_html = '<div id="errorDetails">' + error_msg + '</div>';
		}
		
		// init dialog div
		if ( !$.sfs.errorHandler.dialog ) {
			
			$.sfs.errorHandler.dialog = true;
			
			$.sfs.errorHandler.element
				.html(error_html)
				.appendTo('body')
				.dialog({
					modal : true,
					width : 450
				})
			;
			
		} else {
			
			$.sfs.errorHandler.element
				.html(error_html)
				.dialog('open')
			;
		}
	}
};

$.sfs.errorHandler.element.ajaxError($.sfs.errorHandler.showErrorDialog);

})(jQuery);
(function( $ ) {

$.sfs = $.extend($.sfs,
{
	slide :
	{
		init : function(_direction, _opt)
		{
			$(function() {
				
				var $ele = $(_opt.selector || _opt);
				
				var opt = $.extend({
					speed: 'default'
				}, _opt);
				
				// init
				if ( $ele.get(0) ) {
					
					if (_opt.delay) {
						
						window.setTimeout(function(){
							$ele['slide' + _direction](opt.speed);
						}, parseInt(_opt.delay));
						
					} else {
						$ele['slide' + _direction](opt.speed);
					}
				}
			});
		}
	}
});

})( jQuery );
(function($){

$.sfs = $.extend($.sfs, 
{
	sortable :
	{
		setup : {},
		manager : {update:false},
		init : function(_opt)
		{
			$(function() {
				
				var $sortable = $(_opt.selector ? _opt.selector : _opt);
				
				if (_opt.setup) $.sfs.sortable.setup[_opt.setup] = _opt;
				
				var opt = $.extend(
					{
						tolerance:'pointer',
						zIndex:10200,
						forcePlaceholderSize: true
					}
					,$.sfs.sortable.events
					,_opt
				);
				
				// event handler
				for (e in $.sfs.sortable.events) {
					
					if(opt[e] && typeof opt[e] !== 'function') opt[e] = eval('('+opt[e]+')');
				}
				
				// init
				if($sortable.get(0)) {
					
					$sortable
						.sortable(opt)
						.data('sfs', $.extend($sortable.data('sfs'), {sortable: opt}));
					
					$(opt.handle, $sortable).disableSelection();
				}
			});
		},
		events : 
		{
			start : function (e, ui) {
				
				var $sortable = $(this);
				$sortable.data('itemPosition', {start:$.inArray(ui.item.attr('id'), $sortable.sortable('toArray'))});
				
				if (ui.placeholder && $.browser.mozilla) {
					
					ui.placeholder.height(ui.item.height());
					ui.placeholder.width(ui.item.width());
				}
				
				if (ui.placeholder && $.browser.msie) {
					
					ui.placeholder.height(ui.item.height());
				}
			}
			
			,update : function (e, ui) {
				
				// $.sfs.sortable.manager.update = true;
				
				var $sortable = $(this);
				var controller = $sortable.data('sfs').sortable.controller.url || $sortable.data('sfs').sortable.controller;
				
				if (controller) {
					
					var item = (ui.item) ? {
						attr : { id : ui.item.attr('id') },
						position : {
							start : ($sortable.data('itemPosition')) ? $sortable.data('itemPosition').start : -1,
							stop : $.inArray(ui.item.attr('id'), $sortable.sortable('toArray'))
						}
					} : {};
					
					var sortable = {
						attr : {id : $(this).attr('id')},
						item : item,
						items : $sortable.sortable('toArray'),
						data : $sortable.data('sfs').sortable.controller.data || {}
					};
					
					$.ajax({
						async : false,
						url : controller,
						type : 'post',
						data : {action:'update', sortable:$.json.write(sortable)}
					});
					
				} else {
					
					// $sortable.sortable('enable');
					// $.sfs.sortable.manager.update = false;
				}
			},
			
			stop : null, receive : null, activate : null, deactivate : null, beforeStop : null
			
		} /// events
	}/// ns:sortable
});

})(jQuery);
(function($){
	
	// register new public method
	$.sf = $.extend($.sf, {
		
		toggleView : {
			
			init : function(d) {
				
				$(function(){
					
					var $triggers = $();
					
					$.each(d, function(i, v)
					{
						var affectedElements = $(v[1]);
						$(v[0]).each(function()
						{
							$triggers = $triggers.add(this);
							
							registerMinorCaller(this, affectedElements, v[2], v[0]);
							if(v[3]){
								registerCaller(this, affectedElements, v[2], v[1]);
							} else {
								registerCaller(this, affectedElements, v[2]);
							}
						});
					});
					
					// trigger initial events, for selected or checked elements
					$triggers.filter('input:checked, option:selected').each(function(i, ele){

						// $(ele).triggerHandler('click')
						ele.tagName.toLowerCase() === 'option'
						? $(ele).parents('select').triggerHandler('change')
						: $(ele).triggerHandler('change');
					});
				});
			}
		}
	});
	
	// bind event & affected elements
	function registerCaller(obj, aAffected, callerType, refs){
		
		// $(obj).bind('click', handleEvent);
		obj.tagName.toLowerCase() === 'option'
		? $(obj).parents('select').unbind('change', handleEvent).bind('change', handleEvent)
		: $(obj).unbind('change', handleEvent).bind('change', handleEvent);
		
		obj.SFS = (obj.SFS) ? obj.SFS : {toggleView: {caller: {shown:[], hidden:[], mode:{multiClass:false, references:[]}}}};
		obj.SFS.toggleView = (obj.SFS.toggleView)? obj.SFS.toggleView : {caller: {shown:[], hidden:[], mode:{multiClass:false, references:[]}}};
		
		if(callerType) {
			
			// establish initial state, for de-selected or un-checked triggers
			if(!(obj.checked || obj.selected)){$(aAffected).hide();}
			
			// register
			obj.SFS.toggleView.caller.shown.push(aAffected);
		} else {
			
			// establish initial state, for de-selected or de-checked triggers
			if(!(obj.checked || obj.selected)){$(aAffected).show();}
			
			// register
			obj.SFS.toggleView.caller.hidden.push(aAffected);
		}
		if(refs){
			obj.SFS.toggleView.caller.mode.multiClass=true;
			obj.SFS.toggleView.caller.mode.references.push(refs);
		}
	}
	
	// bind event & negation of affected elements, to all neighbours belonging to prior caller
	function registerMinorCaller(obj, aAffected, callerType, selector){
		switch(obj.tagName.toLowerCase()){
			case 'input':
				var type = $(obj).attr('type');
				switch(type){
					case 'radio':
						var rn = $(obj).attr('name');
						$('input[type=radio][name='+rn+']').not(selector).each(function(){
							if(this != obj){
								registerCaller(this, aAffected, !callerType);
							}
						});
					break;
				}
			break;
			case 'option':
				$(obj).siblings().not(selector).each(function(){
					registerCaller(this, aAffected, !callerType);
				});
			break;
		}
	}
	
	function handleEvent(e){
		
		// var caller = e.target || e;
		var caller = ( (e.target || e).tagName.toLowerCase() === 'select' ) ? $(':selected', (e.target || e)).get(0) : (e.target || e);
		if (!caller) return;
		
		if(caller.checked || caller.selected){
			$.each(caller.SFS.toggleView.caller.shown, function(i, affectedElements){
				$(affectedElements).show();
			});
			$.each(caller.SFS.toggleView.caller.hidden, function(i, affectedElements){
				if(caller.SFS.toggleView.caller.mode.multiClass){
					// multi class conditions
					$.each(affectedElements, function(i, ele){
						$.each(caller.SFS.toggleView.caller.mode.references, function(i, rEle){
							if(!$(ele).is(rEle)){
								$(ele).hide();
							}
						});
					});
				} else {
					// auto hide
					$(affectedElements).hide();
				}
			});
		} else {
			$.each(caller.SFS.toggleView.caller.shown, function(i, affectedElements){
				$(affectedElements).hide();
			});
			$.each(caller.SFS.toggleView.caller.hidden, function(i, affectedElements){
				$(affectedElements).show();
			});
		}
	}

})(jQuery);
(function($){

$.sfs = $.extend($.sfs, {uploader:{}});
	
$.sfs.uploader.init = function(_opt){$(function(){
	
	var $element = $(_opt.selector);
	
	// init
	if($element.get(0)) {
		
		$element
			.data('sfs', $.extend($element.data('sfs'), {uploader: _opt}))
			.sfUploader(_opt);
	}
	
})};

$.sfs.uploader.loaders = [];
$.sfs.uploader.refreshLoaders = function(){
	$.each($.sfs.uploader.loaders, function(i, loader){
		loader.refresh();
	});
};

$.widget('siteforum.sfUploader', {
	
	options : {
		
		runtimes : 'html5,flash,browserplus,gears,html4',
		addFileButtonLabel : 'Add file',
		removeFileButtonLabel : 'Remove file',
		showDropTargetIfNotSupported : false,
		
		// url : $form.prop('action'),
		// browse_button : 'pickfiles',
		// ??? container: 'container',
		// ??? drop_element: 'container',
		
		flash_swf_url : '/global_files/javascript/jquery/plugins/plupload/plupload.flash.swf',
		silverlight_xap_url : '/global_files/javascript/jquery/plugins/plupload/plupload.silverlight.xap',
		max_file_limit : 0
		
		// multi_selection:false
		
		// rename : true,
		// max_file_size : '1000mb',
		// unique_names : true,
		// resize : {width : 320, height : 240, quality : 50}
		// urlstream_upload : true,
		// ,filters : [{title : "Image files", extensions : "jpg,gif,png"},{title : "Zip files", extensions : "zip"}]
	},
	
	reset : function(){
		
		var self = this;
		
		$.each(self.uploader.files, function(i, file){
			
			$('.js-remove', '.sfUploaderFile-' + file.id).trigger('click');
		});
		
	},
	
	_create : function(){
		
		var self = this;
		
		this.element.on('click', function(e){
			e.stopImmediatePropagation();
		});
		
		if (!this.element.attr('id')) this.element.attr('id', plupload.guid());
		if (this.options.max_file_limit > 0) this.filesLeft = this.options.max_file_limit;
		
		// controller
		if (!this.options.controller) alert('UploaderError: Controller is missing');
		this.controller = {
			
			url : decodeURIComponent(this.options.controller.url || this.options.controller),
			data : {
				data : this.options.controller.data || {},
				element : {
					attr : {id:this.element.attr('id') || ''}
				},
				action : 'uploadFile'
			}
		};
		this.options.url = this.controller.url+'&uploader='+encodeURIComponent($.json.write(this.controller.data));
		
		// form as parent ?
		if (this.element.parents('form').get(0)) {
			
			this.form = this.element.closest('form');
			
			// jquery ajaxForm?
			this.form.on('form-pre-serialize', $.proxy(this, '_serializeFormInputData'));
			
			this.formInputData = {
				files:[],
				element : this.controller.data.element,
				data : this.options.data || {}
			};
			this.formInput = $('<input type="hidden" name="uploader" value="" />')
				.val($.json.write(self.formInputData))
				.appendTo(this.form)
			;
		}
		
		var id;
		if (this.options.container) {
			
			this.container = this.element.closest(this.options.container);
			id = this.container.attr('id') || plupload.guid();
			this.container.attr('id', id);
			this.options.container = id;
		
		} else {
			// if (this.element.get(0).tagName.toLowerCase() === 'p') alert('UploaderError: "p" is not a valid HTML element as container');
			if (this.form) {
				id = plupload.guid();
				this.container = $('<div style="margin:0; padding:0;"></div>').attr('id', id);
				this.form.wrap(this.container);
				this.options.container = id;
			}
		}
		
		if (this.options.opener && $(this.options.opener, this.element).get(0)) {
			
			this.opener = $(this.options.opener, this.element).eq(0);
			id = (this.opener.attr('id'))? this.opener.attr('id') : plupload.guid();
			this.opener.attr('id', id);
		} else {
			
			this.opener = $('<a class="btn btn-mini btn-success" href="javascript:;"><i class="icon-plus icon-white"></i> ' + self.options.addFileButtonLabel + '</a>');
			id = plupload.guid();
			this.opener.attr('id', id).appendTo(this.element);
		}
		this.options.browse_button = id;
		
		if (this.options.collector){
			
			if ($(this.options.collector, this.element).get(0)) {
				this.collector = $(this.options.collector, this.element);
			} else {
				this.collector = $(this.options.collector); // , this.container || $(document)
			}
			id = (this.collector.attr('id'))? this.collector.attr('id') : plupload.guid();
			this.collector.attr('id', id);
		} else {
			
			this.collector = $('<div></div>');
			id = plupload.guid();
			this.collector.attr('id', id).appendTo(this.element);
		}
		
		// if (!this.options.drop_element) this.options.drop_element = $(this.container || this.element).attr('id');
		if (this.options.dropTarget) {
			
			var $ele = ($(this.options.dropTarget, this.container || this.element).get(0))? $(this.options.dropTarget, this.container || this.element).eq(0) : $(this.options.dropTarget).eq(0);
			if ($ele.get(0) && $ele.attr('id')) {
				id = $ele.attr('id');
				this.options.drop_element = id;
			} else if ($ele.get(0)) {
				id = plupload.guid();
				$ele.attr('id', id);
				this.options.drop_element = id;
			}
		}
		
		// create pluploader
		this.uploader = new plupload.Uploader(this.options);
		
		this.uploader.bind('Init', $.proxy(self, '_onInit'));
		this.uploader.bind('FilesAdded', $.proxy(self, '_onFilesAdded'));
		this.uploader.bind('FilesRemoved', $.proxy(self, '_onFilesRemoved'));
		this.uploader.bind('UploadProgress', $.proxy(self, '_onUploadProgress'));
		this.uploader.bind('Error', $.proxy(self, '_onError'));
		this.uploader.bind('FileUploaded', $.proxy(self, '_onFileUploaded'));
		this.uploader.bind('BeforeUpload', $.proxy(self, '_onBeforeUpload'));
		this.uploader.bind('UploadComplete', $.proxy(self, '_onUploadComplete'));
		
		$.sfs.uploader.loaders.push(this.uploader);
		this.uploader.init();
	},
	
	_onInit : function(upl, params) {
		
		// params.runtime, upl.features.dragdrop, upl.features.progress
		var self = this;
		if (
			this.options.drop_element &&
			!upl.features.dragdrop &&
			!this.options.showDropTargetIfNotSupported
		){
			$('#'+this.options.drop_element).hide();
		}
		if (upl.features.dragdrop){
			this.element.addClass('js-uploader-droppable');
		}
	},
	
	_onBeforeUpload : function(up, params){
		
		var self = this;
		
		$(this.container || this.element).addClass('ui-state-loading');
		
		if (
			self.options.max_file_limit > 0 &&
			up.total.uploaded >= self.options.max_file_limit
		){
			up.splice(self.options.max_file_limit);
			up.stop();
			up.refresh();
		}
		
		if (this.form) $('input[type!="file"]', this.form).prop('disabled', true);
	},
	_onUploadComplete : function(up, params){
		
		var self = this;
		
		$(this.container || this.element).removeClass('ui-state-loading');
		if (this.form) {
			this.formInput.val($.json.write(this.formInputData));
			$('input[type!="file"]', this.form).prop('disabled', false);
		}
	},
	
	_onFilesAdded : function(up, files) {
		
		var self = this;
		
		$.each(files, function(i, file) {
			
			if (self.filesLeft != undefined) {
				
				if (self.filesLeft == 0) {
					
					up.removeFile(file);
					return;
				}
				
				self.filesLeft--;
				
				if (self.filesLeft == 0) self.opener.hide();
			}
			
			$('<div></div>')
				.addClass('sfUploaderFile-' +  file.id)
				.html('<span title="'+ file.name +'">' + file.name + '</span>' + ' (' + plupload.formatSize(file.size) + ') <b></b>'+'<a href="#" title="' + self.options.removeFileButtonLabel + '" class="js-remove"><img src="/global_files/icons/silk/delete.png" /></a>')
				.appendTo(self.collector)
				.on('click', '.js-remove', {file:file}, $.proxy(self, '_removeFile'));
			;
			
			self._addFileToFormInput(file);
		});
		
		$.sfs.uploader.refreshLoaders();
		window.setTimeout(function(){
			self.uploader.start();
		}, 1);
	},
	
	_onFilesRemoved : function(up, files){
		
		var self = this;
	},
	
	_removeFile : function(e){
		
		e.preventDefault();
		
		var self = this;
		
		var file = e.data.file;
		var status_before = file.status;
		self.uploader.removeFile(file);
		if(self.uploader.state == plupload.STARTED && status_before == 2) {
			
			$(this.container || this.element).removeClass('ui-state-loading');
			if (self.form) $('input[type!="file"]', this.form).prop('disabled', false);
			
		  self.uploader.stop();
		  self.uploader.start();
		}
		
		if (self.filesLeft !== undefined) {
			
			self.filesLeft++;
			
			if (self.filesLeft > 0) {
				self.opener.show();
			}
		}
		
		self._removeFileFromFormInput(file);
		
		$('.sfUploaderFile-' + file.id).remove();
		$.sfs.uploader.refreshLoaders();
	},
	
	_onUploadProgress : function(up, file) {
		
		var self = this;
		
		if (this.form) $('input[type!="file"]', this.form).prop('disabled', true);
		$('b', '.' + 'sfUploaderFile-' + file.id).html(file.percent + "%");
	},
	
	_onFileUploaded : function(up, file, result) {
		
		var self = this;
		
		if (this.form && $.inArray(file, this.formInputData.files) > -1) {
			
			var uploader = $.json.read(result.response);
			var file = this.formInputData.files[$.inArray(file, this.formInputData.files)];
			$.extend(file, uploader.file);
		}
		
		$('b', '.' + 'sfUploaderFile-' + file.id).remove();
		
		$.sfs.uploader.refreshLoaders();
	},
	
	_onError : function(up, err) {
		
		var self = this;
		var file = err.file;
		
		// alert(err.message)
		
		up.removeFile(err.file);
		
		self._removeFileFromFromInput(file);
		
		$('.sfUploaderFile-' + err.file.id).fadeOut('slow', function(){
			$(this).fadeIn('slow', function(){
				$(this).remove();
			});
		});
		
		if (self.filesLeft !== undefined) {
			
			self.filesLeft++;
			
			if (self.filesLeft > 0) {
				self.opener.show();
			}
		}
		
		/*
		$('#filelist').append("<div>Error: " + err.code +
			", Message: " + err.message +
			(err.file ? ", File: " + err.file.name : "") +
			"</div>"
		);
		*/
		
		$.sfs.uploader.refreshLoaders();
	},
	
	_serializeFormInputData : function(){
		
		if (this.form) this.formInput.val($.json.write(this.formInputData));
	},
	_removeFileFromFormInput : function(file){

		if (this.form && $.inArray(file, this.formInputData.files) > -1) {
			
			this.formInputData.files.splice($.inArray(file, this.formInputData.files), 1);
			this._serializeFormInputData();
		}
	},
	_addFileToFormInput : function(file){
		
		if (this.form) {
			
			this.formInputData.files.push(file);
			this._serializeFormInputData();
		}
	},
	
	destroy : function(){
		
		$.Widget.prototype.destroy.call( this );
		// alert('destroy')
	}
	
});

})(jQuery);
