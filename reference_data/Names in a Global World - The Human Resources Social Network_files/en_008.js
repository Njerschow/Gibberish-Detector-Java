



$.sfs = $.extend($.sfs, {
	
	socket : function(_method_or_attr, _opt) {
		
		var _ajaxResponseImpl = function(res){
			
			if (res.jquery) {
				
				if (!$.isArray(res.jquery)) res.jquery = [res.jquery];
				$.each(res.jquery, function(i, item) {
					
					var $ele = ($.isArray(item.selector))? $(item.selector[0], item.selector[1]) : $(item.selector); 
					
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
		}
		
		if (this.connection && _method_or_attr !== 'init') {
			
			if (_method_or_attr) return this.connection.socket[_method_or_attr];
			
			return this.connection;
			
		} else if ( this.connection && this.connection.socket['connected'] && _method_or_attr === 'init') {
			
			if ( _opt && _opt.controller ) {
				
				var controller = {
					url :  _opt.controller.url || _opt.controller,
					data : _opt.controller.data || {}
				};
				
				var requestParam = {
					socket : $.json.write({
						action : 'connect',
						data : controller.data
					})
				};
				$.get(decodeURIComponent(controller.url), requestParam, function(res){_ajaxResponseImpl(res);});
			}
			
			return this.connection;
			
		} else if (!this.connection) {
			
			var url = (_opt.protocoll || 'http') + '://' + (_opt.host || 'socket.siteforum.com:') + (_opt.port || 80) + '?' + 'apiKey=' + _opt.apiKey + '&socketId=' + _opt.id;
			var opt = $.extend ({
				// 'remember transport' : true,
				'flash policy port' : 843,
				url : url
			}, _opt);
			
			this.connection = io.connect(opt.url, opt);
			this.connection.on('__jquery__', function(param){
				
				if ($.isPlainObject(param)) {
					
					var $ele = ($.isArray(param.selector))? $(param.selector[0], param.selector[1]) : $(param.selector);
					var args = ($.isArray(param.arguments))? param.arguments : [param.arguments];
					$ele[param.method].apply($ele, args);
					
				} else if ($.isArray(param)) {
					
					$.each(param, function(i, data){
						
						var $ele = ($.isArray(data.selector))? $(data.selector[0], data.selector[1]) : $(data.selector);
						var args = ($.isArray(data.arguments))? data.arguments : [data.arguments];
						$ele[data.method].apply($ele, args || []);
					});
				}
			});
		}
		
		if (!this.connection || !this.connection.socket['connected']) {
			
			this.connection.on('connect', function(){
				
				if ( _opt && _opt.controller ) {
					
					var controller = {
						url :  _opt.controller.url || _opt.controller,
						data : _opt.controller.data || {}
					};
					
					var requestParam = {
						socket : $.json.write({
							action : 'connect',
							data : controller.data
						})
					};
					
					$(function(){
						$.get(decodeURIComponent(controller.url), requestParam, function(res){_ajaxResponseImpl(res);});
					});
				}
				
			});

			this.connection.on('reconnect', function(){
				
				if ( _opt && _opt.controller ) {
					
					var controller = {
						url :  _opt.controller.url || _opt.controller,
						data : _opt.controller.data || {}
					};
					
					var requestParam = {
						socket : $.json.write({
							action : 'reconnect',
							data : controller.data
						})
					};
					
					$(function(){
						$.get(decodeURIComponent(controller.url), requestParam, function(res){_ajaxResponseImpl(res);});
					});
				}
				
			});
		}
		
	}
});


