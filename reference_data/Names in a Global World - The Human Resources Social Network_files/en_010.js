



(function($){
	
	$.sfs = $.extend($.sfs, {newslet:{}});
	$.sfs.newslet.init = function(_opt){$(function(){
		
		$(_opt.selector).sfNewslet(_opt);
	});};
	
	$.widget('siteforum.sfNewslet', {
		
		options : {
			controlAttrs : ['id','class','target','href','title'],
			scrollLoader : false
		},
		
		_create : function(){
			
			var self = this;
			self.element.addClass('ui-state-loading');
			
			this.controller = {
				url : (this.options.controller)? this.options.controller.url || (((typeof this.options.controller).toLowerCase() == 'string')? this.options.controller : false )  : false,
				data : {
					action : '',
					element : {attr : {}},
					data : (this.options.controller)? this.options.controller.data || {} : {}
				}
			};
			
			$.each(self.options.controlAttrs, function(i, attrName){
				if (self.element.attr(attrName)) self.controller.data.element.attr[attrName] = self.element.attr(attrName);
			});
			
			// observer
			this.element.on('click', 'a', $.proxy(this._onLinkClick, this));
			$('input:submit', this.element).live('click', $.proxy(this._onFormInputClick, this));
			// delegate
			$(this.element).delegate('form', 'submit', function(e){
				e.preventDefault();
				e.stopImmediatePropagation();
				$('input:submit', this).eq(0).trigger('click');
			});
			
			// scrollLoader
			if (self.options.scrollLoader) {
				
				self.scrollLoader = (self.options.scrollLoader === 'window')? $(window) : $(self.options.scrollLoader);
				self.scrollLoader.scrollLoader({
					
					ratio : 0.1,
					loadContent : function(){
						
						self.scrollLoader.trigger('disableLoad');
						$('.js-showMoreMessagesLink', self.element).trigger('click');
					}
				});
			}
		},
		
		extendControllerData : function(data){
			
			$.extend(true, this.controller.data.data, data);
		},
		
		loadMessage : function(newsletMessageId){
			
			var self = this;
			
			this.controller.data.action = 'loadMessage';
			this.controller.data.messageId = newsletMessageId;
			
			self.element.addClass('ui-state-loading');
			$.get(self.controller.url, {newslet:$.json.write(self.controller.data)}, function(res){
				self._ajaxResponseImpl.apply(self, [res]);
			});
		},
		
		loadComment : function(newsletCommentId, newsletMessageId){
			
			var self = this;
			
			if (!$('.js-newsletMessage-' + newsletMessageId, self.element).get(0) ) return ;
			
			this.controller.data.action = 'loadComment';
			this.controller.data.commentId = newsletCommentId;
			
			self.element.addClass('ui-state-loading');
			$.get(self.controller.url, {newslet:$.json.write(self.controller.data)}, function(res){
				
				self._ajaxResponseImpl.apply(self, [res]);
			});
		},
		
		_onFormInputClick : function(e){
			
			var self = this;
			var $input = $(e.target);
			var $form = $input.closest('form');
			
			if (
				( $form.attr('href') && $form.attr('href').indexOf('http') == 0 ) ||
				( $form.attr('target') && $form.attr('target').indexOf('_') == 0 )
			){
				return true;
			}
			else if ($form.attr('href') == '#') {
				e.preventDefault();
				e.stopImmediatePropagation();
				return ;
			}
			else {
				e.preventDefault();
				e.stopImmediatePropagation();
			}
			
			// --> break
			if (self.element.hasClass('ui-state-loading')) return;
			
			delete(this.controller.data.action);
			this.controller.data.control = {attr:{}};
			$.each(self.options.controlAttrs, function(i, attrName){
				if ($input.attr(attrName)) self.controller.data.control.attr[attrName] = $input.attr(attrName);
			});
			
			var data = [];
			data.push({name:$input.attr('name'), value:$input.val()});
			data.push({name:'newslet', value:$.json.write(self.controller.data)});
			
			/*
			$.ajax({
				url : $form.attr('action'),
				method : 'POST',
				dataType : 'json',
				data : data,
				beforeSend : function(){
					self.element.addClass('ui-state-loading');
					$('input:submit', $form).prop('disabled', true);
				}
			})
			.done(function(res){
				// $form.resetForm();
				self._ajaxResponseImpl.apply(self, [res, $form.get(0)]);
			})
			.always(function(){
					self.element.removeClass('ui-state-loading');
					$('input:submit', $form).prop('disabled', false);
			});
			*/
			
			$form.ajaxSubmit({
				
				resetForm : true,
				beforeSubmit : function(){
					
					self.element.addClass('ui-state-loading');
					$('input:submit', $form).prop('disabled', true);
				},
				data : data,
				success : function(res){
					
					$('input:submit', $form).prop('disabled', false);
					self._ajaxResponseImpl.apply(self, [res, $input.get(0)]);
					if ($form.attr('target')) $($form.attr('target')).html(res);
				},
				error : function(){
					self.element.removeClass('ui-state-loading');
					$('input:submit', $form).prop('disabled', false);
				}
				
			});
			
		},
		
		_onLinkClick : function(e){
			
			var self = this;
			var $link = $(e.currentTarget);
			
			if (
				( $link.attr('href') && $link.attr('href').indexOf('http') == 0 ) ||
				( $link.attr('target') && $link.attr('target').indexOf('_') == 0 )
			){
				return true ;
			}
			else if ($link.attr('href') == '#') {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				return ;
			}
			else {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
			}
			
			// --> break
			if (self.element.hasClass('ui-state-loading')) return;
			
			self.element.addClass('ui-state-loading');
			delete(this.controller.data.action);
			this.controller.data.control = {attr:{}};
			$.each(self.options.controlAttrs, function(i, attrName){
				if ($link.attr(attrName)) self.controller.data.control.attr[attrName] = $link.attr(attrName);
			});
			
			$.get($link.attr('href'), {newslet:$.json.write(self.controller.data)}, function(res){
				
				self._ajaxResponseImpl.apply(self, [res, $link.get(0)]);
				if ($link.attr('target')) $($link.attr('target')).html(res);
			});
			
		},
		
		_ajaxResponseImpl : function(res, scope){
			
			var self = this;
			
			if (res.jquery) {
				
				if (!$.isArray(res.jquery)) res.jquery = [res.jquery];
				$.each(res.jquery, function(i, item) {
					
					var $ele = ($.isArray(item.selector))? $(item.selector[0], item.selector[1]) : $(item.selector || scope || self.element.get(0)); 
					
					if (item.methods) {
						
						var methodReturnValue = false;
						$.each(item.methods, function(i, method){
							var args = ($.isArray(method.params))? method.params : [method.params || ''];
							methodReturnValue = (methodReturnValue)? methodReturnValue[method.name].apply(methodReturnValue, args) : $ele[method.name].apply($ele, args);
						});
						
					} else {
						
						var args = ($.isArray(item.params))? item.params : [item.params || '']; 
						$ele[item.method].apply($ele, args);
					}
				}) 
			}
			
			if ($.isPlainObject(res.data)) {
				
				$.extend(true, self.controller.data.data, res.data);
			}
			
			if ($.isPlainObject(res.control)) {
				
				if ($.isPlainObject(res.control.attr)) $(scope).attr(res.control.attr);
				if ($.isPlainObject(res.control.jquery)) self._ajaxResponseImpl(res.control, scope);
			}
			
			if (self.scrollLoader) {
				$(self.scrollLoader).trigger('enableLoad');
			}
			
			self.element.removeClass('ui-state-loading');
		}
		
	});
	
	
	/**
	 * jQuery.scroll.loader
	 * Dual licensed under MIT and GPL.
	 * Date: 10/21/2009
	 *
	 * @description Auto load content when the user has scrolled towards the bottom
	 * @author Jim Yi
	 * @version 0.1
	 *
	 * @id jQuery.fn.scrollLoader
	 * @param {Object} settings Hash of settings, loadContent (function) is required.
	 * @return {jQuery} Returns the same jQuery object for chaining.
	 *
	 */
	
	$.fn.scrollLoader = function(options) {

		var defaults = {
			ratio: .05, // how close to the scrollbar is to the bottom before triggering a load
			loadContent: function() {} // function to call when the scrollbar has reached the threshold
		};

		var options = $.extend(defaults, options);

		return this.each(function() {
			var obj = this;
			var enabled = true;

			/* bind some custom events */
			$(obj).bind("enableLoad", function() {
				enabled = true;
			});
			$(obj).bind("disableLoad", function() {
				enabled = false;
			});
			$(obj).bind("manualLoad", function() {
				options.loadContent.call();
			});

			$(obj).bind("scroll", function() {
				if (enabled) {
					var scrollHeight, scrollPosition;
					if (obj == window) {
						scrollHeight = $(document).height();
					}
					else {
						scrollHeight = $(obj)[0].scrollHeight;
					}
					scrollPosition = $(obj).height() + $(obj).scrollTop();
					if ( (scrollHeight - scrollPosition) / scrollHeight <= options.ratio) {
						options.loadContent.call();
					}
				}
			});

			return false;
		});
	};
	
})(jQuery);


