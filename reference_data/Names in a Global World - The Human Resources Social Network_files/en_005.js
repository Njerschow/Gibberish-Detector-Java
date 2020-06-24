



$.sfs = $.extend($.sfs, {requestSequencer:{}});

$.sfs.requestSequencer = {
	
	init : function(_opt) { $(function(){
		
		var $elements = $(_opt.selector);
		
		if ($elements.get(0)) {
			
			$elements.requestSequencer(_opt);
			// $('form', '#sfsLoginForm').triggerHandler('submit');
		}
	
	})}
};

$.widget("ui.requestSequencer", {
	
	options : {
			
		dialog : {
			autoOpen: false,
			modal : true,
			zIndex : 11000
		},
		event : null
	},
	
	data : {
		
		timeout : false,
		currentEventTarget : false,
		dialog : false
		
	},
	
	_create : function() {
		
		this.tagName = this.element.get(0).tagName.toLowerCase();
		
		switch (this.tagName) {
			
			case 'form' : 
				this.options.event = 'submit';
				
				// break ->
				if ( this.element.find('input:submit[name=submit]').get(0) ) return;
				// if ( this.element.hasEvent('submit') ) return;
				
				this.element.find('input:submit, input:image').bind('click', $.proxy(this, '_registerCurrentEventTarget'));
				
			break;
			case 'a' : this.options.event = 'click';
			break;
			default : break;
		}
		
		if (!this.options.event) return false;
		
		this._createDialog();
		this.element.bind (this.options.event, $.proxy(this, '_start'));
	},
	
	_registerCurrentEventTarget : function(e){
	
		this.data.currentEvent = e;
		this.data.currentEventTarget = e.target;
	},
	
	_start : function (e) {
		
		e.preventDefault();
		this._disableInputElements();
		this._invokeController();
	},
	
	_invokeController : function(_opt) {
		
		var opt = this.options;
		var controller = (opt.controller) ? opt.controller.url || opt.controller : false;
		
		// break ->
		if (!controller) return this.admit({});
		
		// alert(this.element.attr('id').toString() || '')
		
		var requestSequencer = {
			attr:{id:(this.element.attr('id')) ? this.element.attr('id').toString() : ''}
			,data : opt.controller.data || {}
			,callback : this.option('callback') || {}
		};
		
		this.xhrRequest = $.ajax({
			async : (_opt) ? _opt.async || true : true,
			
			dataType : 'json',
			url : controller,
			data : {requestSequencer:$.json.write(requestSequencer)},
			success : $.proxy(this, '_delegateControllerResponse'),
			error : $.proxy(this, '_delegateControllerError')
		});
	},
	
	_delegateControllerResponse : function (res) {
		
		this.option('callback', res.callback || {});
		var delegate = $.proxy(this, res.action);
		delegate(res);
	},
	
	_delegateControllerError : function(xhr) {
		
		// alert(xhr.responseText);
		this.admit({});
	},
	
	_createDialog : function () {
		
		if (!this.options.dialog) return;
		
		var opt = $.extend({
			close : $.proxy(this, '_closeDialog')
		}
		, this.options.dialog);
		
		if (opt.selector) {
		
			this.dialog = $(dialog.selector).dialog(opt);
		} else {
			
			this.dialog = $('<div></div>');
			this.dialog.attr('title', opt.title || '');
			this.dialog.html(opt.content || '');
			this.dialog.dialog(opt);
		}
	},
	
	_openDialog : function() {
		
		if (!this.dialog) return;
		this.dialog.dialog('open');
	},
	
	_closeDialog : function() {
		
		this.xhrRequest.abort();
		this._clearCallbackTimeout();
		this._enableInputElements();
		this.data.currentEventTarget = false;
		// close if open
		if(this.dialog && this.dialog.dialog('isOpen')) this.dialog.dialog('close');
	},
	
	_updateDialog : function(opt) {
		
		if (!opt) return;
		if (!this.dialog) return;
		
		var $dialog = this.dialog;
		if (opt.content) {
			
			$dialog.dialog('widget').find('.ui-widget-content').html(opt.content);
		}
		
		if (opt.title) $dialog.dialog('option', 'title', opt.title);
	},
	
	_disableInputElements : function(){
		
		this.element.find('input[type=submit]').each(function(){this.disabled = true;});
	},
	
	_enableInputElements : function(){
		
		this.element.find('input:disabled').each(function(){this.disabled = false;});
	},
	
	_clearCallbackTimeout : function(){
		
		if (this.data.timeout) window.clearTimeout(this.data.timeout);
	
	},
	
	_setCallbackTimeout : function(_delay){
		
		this.data.timeout = window.setTimeout($.proxy(this, '_invokeController'), _delay);
	},
	
	deny : function(res) {
		
		this._openDialog();
		this._updateDialog(res.dialog);
		
		this._setCallbackTimeout((res.callback)? res.callback.delay || 5000 : 5000);
	},
	
	admit : function(res) {
		
		this._updateDialog(res.dialog);
		
		var element = this.element;
		this.destroy();
		
		switch (this.tagName) {
			
			case 'a' : document.location = element.attr('href'); break;
			
			case 'form' :
				
				// append the clicked target as input:hidden
				var clickedTarget = this.data.currentEventTarget;
				var $input = $('<input type="hidden" name="" value="" />');
				
				$input.attr('name', $(clickedTarget).attr('name'));
				$input.attr('value', $(clickedTarget).attr('value') || '');
				
				if ( $(clickedTarget).is('input:image') ) {
					
					var name = $input.attr('name');
					element.append($input.clone().attr({
						name : name + '.x',
						value : this.data.currentEvent.pageX || 0
					}));
					element.append($input.clone().attr({
						name : name + '.y',
						value : this.data.currentEvent.pageY || 0
					}));
					
				} else {
					
					element.append($input);
				}
				
				// trigger original event
				element.trigger(this.options.event);
				
			break;
			
			default: element.trigger(this.options.event); break;
		}
	},
	
	destroy : function() {
		
		$.Widget.prototype.destroy.apply(this, arguments); // default destroy
		
		this._clearCallbackTimeout();
		this._enableInputElements();
		
		this.element.unbind(this.options.event, $.proxy(this, '_start'));
		this.element.find('input:submit').unbind('click', $.proxy(this, '_registerCurrentEventTarget'));
		this.element.find('input:image').unbind('click', $.proxy(this, '_registerCurrentEventTarget'));
	}
	
});

