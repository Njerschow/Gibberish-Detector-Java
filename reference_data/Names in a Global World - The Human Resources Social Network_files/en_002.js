
if(typeof quick_reg === 'undefined'){

	var quick_reg = (function(){
		"use strict";
		var _default_settings = {
			reg_mode: "simple",
			login_title: 'LOGIN TO <span class="highlight">HR.COM</span>',
			login_description: null,
			redirect_url: '/'			
		};
		var _settings = {
			success: [],
			ready: [],
			is_ready: false
		};
				
		var init = function(){
			if (typeof head === 'undefined') { 
				var jq = document.createElement('script'); jq.type = 'text/javascript';
				jq.src = '/en?t=/CustomCode/jqueryPlugins/head.js';
				var sc = document.getElementsByTagName('script')[0];
				sc.parentNode.insertBefore(jq, sc);
			
				var cnt = 0;
				var wait_for_head = function(){
					if (typeof head === 'undefined'){
						if(cnt < 100)
							setTimeout(wait_for_head, 100);
						else
							throw "head init timeout after 10000ms";
						cnt++;
					}else{
						head.test(typeof jQuery === 'undefined', "//ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js", null , popup_form.init);
					}
				}
				wait_for_head();
				
			}else{
		     	head.test(typeof jQuery === 'undefined', "//ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js", null , popup_form.init);
			}
				
		};
		
		var bindClick = function($elem){
			popup_form.init_click($elem);
		}
		var success = function(success){
			_settings.success.push(success);
		}
		var ready = function(ready){
			_settings.ready.push(ready);
			if(_settings.is_ready)
				ready();
		}		
		
		var popup_form = (function(){
			var init = function(){
				head.test(
					!jQuery().littlePopup, "/en?t=/CustomCode/jqueryPlugins/HApopup.js", null , function(){
						head.test(!jQuery().onFirst,  "/en?t=/CustomCode/jqueryPlugins/bind_first.js", null , ready)
					}
				);
			};
			var ready = function(){
				$.each(_settings.ready, function(){
					this();
				})	
				init_click();
				_settings.is_ready = true;
			}
			
			var init_click = function($elem){
				//$('body').onFirst('click', '.quick-login', click_handler);
				if(typeof $elem === 'undefined')
					$('.quick-login').bindFirst('click', click_handler);
				else
					$elem.bindFirst('click', click_handler);
			}
			
			var click_handler = function(event){
				var $this = $(this);
				if($this.hasClass("full-registration")){
					_settings.reg_mode = "full";
				}
				else
					_settings.reg_mode = _default_settings.reg_mode;
					
				_settings.login_title = $this.data('login-title')?
					$this.data('login-title').replace('[highlight]', '<span class="highlight">').replace('[/highlight]', '</span>') : 
						_default_settings.login_title;
						
				_settings.login_description = $this.data('login-description')?
					$this.data('login-description') : null;
			
				_settings.redirect_url = $this.data('login-redirect')? $this.data('login-redirect') : 
					$this.data('login-refresh') ? location.href : null;
					//	$(this).attr('href') ? $(this).attr('href') : null; //_default_settings.redirect_url;
				
				_settings.action_elm = $(this);
				
				_settings.set_session = $this.data('login-set-return-after') == 1;
				
				
				show();
				
				event.stopImmediatePropagation();
				
				return false;	
			}
			
			var show = function(){
				var $popup = $('<div id="quick-login-dialog"></div>');
				render_login($popup);
				$popup.littlePopup({
					width: 450,
					height: "auto"
				});
			}
			
			var logged_in = function($popup){
				var act = function(){
					var do_default = true;
					$.each(_settings.success, function(){
						if(!this(_settings.action_elm)){
							do_default = false;
							return false;
						}
					})
					
					if(do_default){
						if (_settings.action_elm) _settings.action_elm.unbind('click', click_handler);
						$('.quick-login').unbind('click', click_handler);
						
						if(_settings.redirect_url)
							location.assign(_settings.redirect_url);
						else if (_settings.action_elm.length)
							_settings.action_elm[0].click();
						//else
						//	location.reload(); 
					}

				};
				
				$popup.data('littlePopup').close();
				
				if(_settings.set_session){
					do_login_action({set_session:1}, function(results){
						act();
					})
				}else
					act();	
					
				
			}
						
			var render_login = function($popup, c_form){
				$popup.html('');
				$popup.append('<div class="title">'+_settings.login_title+'</div>');
				
				if(_settings.login_description){
					$popup.append('<p>'+_settings.login_description+'</p>');
				}
				
				var form = typeof c_form === 'undefined'?get_login_form():c_form;
			
				var $form_cont = $('<form class="horizontal-form"></form>')
				render_form($form_cont, form);
				
				$popup.append($form_cont);

				$form_cont.append($('<div class="clickable action input">Forgot your password?</div>').click(function(){
					if(!$(this).hasClass('disabled'))
						render_forgot_password($popup);
				}));				
				
				$form_cont.append($('<input type="submit" id="sfsLoginAreaBt" value="Login"/>').click(function(){
					$form_cont.find('input').prop('disabled', true);
					$popup.find('.clickable').addClass('disabled');
					$popup.data('littlePopup').can_close(false);
					validate_form("/quick_login/login", form, function(success){
						if(success){
							$popup.data('littlePopup').can_close(true);
							logged_in($popup);
						}else{
							form.global_message.find('.forgot').click(function(){
								render_forgot_password($popup, form.form.email.input.val());
								return false;
							});
							$form_cont.find('input').prop('disabled', false);
							$popup.find('.clickable').removeClass('disabled');
							$popup.data('littlePopup').can_close(true);
						}
					});
					return false;
				}));
			
				$popup.append($('<div class="clickable action"><img border="0" alt="Register Now - It\'s Free" src="/portals/hrcom/remoteimages/website-images/2013_siteupdate/signup_button.gif"></div>').click(function(){
					if(!$(this).hasClass('disabled')){
						if(_settings.reg_mode === "simple")
							render_simple_reg_form($popup);
						else if(_settings.reg_mode === "full")
							render_full_reg_form($popup);
					}
				}).css({'margin-top': '3px' })); //.css({float: 'left', 'margin-left': '5px', 'margin-top': '1px' })
				
			}
			
			var render_forgot_password = function($popup, email){
				$popup.data('littlePopup').setSize(450, "auto");
				
				var form = get_forget_password_form();
				form.form.email.input.val(email?email:'');
				
				var $form_cont = $('<form class="horizontal-form"></form>')
				render_form($form_cont, form);
				
				$popup.html('');
				$popup.append('<div class="title">FORGOT YOUR <span class="highlight">PASSWORD</span>?</div>');
				$popup.append('<p>Forgot your password? Enter in your email address and we will send it you you.</p>');
				$popup.append($form_cont);
				
				$form_cont.append($('<input type="submit" value="Get Password"/>').click(function(){
					$form_cont.find('input').prop('disabled', true);
					validate_form("/quick_login/forgot", form, function(success, data){
						if(success){
							var login_form = get_login_form();
							login_form.global_message.html('<div class="info">'+data.message+'</div>');
							login_form.form.email.input.val(form.form.email.input.val());
							render_login($popup, login_form);
						}else
							$form_cont.find('input').prop('disabled', false);
					});
					return false;
				}));
				
			}
			
			var render_full_reg_form = function($popup){
				$popup.html('');
				$popup.data('littlePopup').setSize(800, 540);
				$popup.data('littlePopup').can_close(false);
				var si = function(){
					$.ajax({
						url: "/en?t=/CustomCode/signup2/index",
						success: function(signup_form_data){
							var $prog_bar = $('<div id="progressBar"><div class="progressSeg first">Facebook</div><div class="progressSeg">LinkedIn</div><div class="progressSeg">Twitter</div><div class="progressSeg">Details</div><div class="progressSeg">Company</div><div class="progressSeg">Success</div><div class="progress"></div></div>');
							var $signup_cont = $('<div/>').html(signup_form_data);
							$popup.append($prog_bar);
							$popup.append($signup_cont);
							signup.init({
								signupContainer: $signup_cont,
								scrollContainer: $popup,
								progress: $prog_bar.children('.progress'),
								auto_callback: true,
								success_message: " PLEASE WAIT WHILE YOU ARE REDIRECTED TO YOUR REQUESTED PAGE.",
								success: function(){
									$popup.data('littlePopup').can_close(true);
									logged_in($popup);
								}
							});
							signup.bootstrap($popup, 'facebook', 'info');
							//$popup.data('littlePopup').setSize(800, "auto");
						}
					})						
				}
				
				$("head").append("<link rel='stylesheet' type='text/css' href='/en?t=/CustomCode/signup2/main.css' />");
				$("head").append("<link rel='stylesheet' type='text/css' href='/en?t=/CustomCode/globalCat/cat2.css' />");
				head.test(
					typeof signup === 'undefined', 
					[
						"/en?t=/CustomCode/signup2/main.js",
						"/portals/hrcom/steps2give_site/ajaxupload.js",
						"/en?t=/CustomCode/jqueryPlugins/bbq.js",
						"http://www.google.com/recaptcha/api/js/recaptcha_ajax.js",
						"/en?t=/CustomCode/globalCat/cat2.js",
						"/en?t=/tools/js/countryState/default.js",
						"http://connect.facebook.net/en_US/all.js",
						"/en?t=/CustomCode/SocialFeed/js/linkedin.js",
						"/en?t=/CustomCode/SocialFeed/js/twitter.js",
						"//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"
					], 
					null , 
					si
				);
				
			}
			
			var render_simple_reg_form = function($popup){
				$popup.data('littlePopup').setSize(430, "auto");
				
				var reg_form = get_reg_form();
				var $reg_form_cont = $('<form class="horizontal-form"></form>')
				render_form($reg_form_cont, reg_form);
				
				$popup.html('');
				$popup.append('<div class="title"><span class="highlight">HR.COM</span> REGISTRATION</div>');
				$popup.append('<p>Dont have a login? Quickly register with HR.com.</p>');
				$('<p>You will be prompted to fill out your complete profile after 24 hours. Click <span class="clickable">here</span> to complete your full profile now.</p>')
					.appendTo($popup)
					.find('span').click(function(){
						render_full_reg_form($popup);
						return false;
					});
				
				var $agree = $('<input type="checkbox" name="agree">');
				var $agree_error = $('<div class="error">Please agree to our TOS and privacy policy</div>').hide();
				$reg_form_cont.append(
					$('<label style="display:block; margin:12px 0;">'+
						'Agree to HR.com\'s <a target="_blank" href="/en/about_us/legal_information/">terms of service</a> and <a target="_blank" href="/en/about_us/privacy_information/">privacy policy</a>.'+
					'</label>').prepend($agree).append($agree_error)
				);
				
				$popup.append($reg_form_cont);
				$reg_form_cont.append($('<input type="submit" value="Signup" />').click(function(){
					if($agree.prop('checked')){
						$agree_error.hide();
						
						$reg_form_cont.find('input, select').prop('disabled', true);
						$popup.data('littlePopup').can_close(false);
						validate_form("/quick_login/register", reg_form, function(success){
							if(success){
								$popup.data('littlePopup').can_close(true);
								logged_in($popup);							
							}else{
								$reg_form_cont.find('input, select').prop('disabled', false);
								$reg_form_cont.find('div.error span.clickable.forgot').click(function(){
									render_forgot_password($popup, reg_form.form.email.input.val());
									return false;
								});
								$popup.data('littlePopup').can_close(true);
							}
							
						});
					}else{
						$agree_error.show()
					}
					return false;
				}));
				$popup.data('littlePopup').setSize(430, "auto");
			}
		
			var do_login_action = function(data, success){
				$.ajax({
					url: "/quick_login/do_action",
					type: 'POST',
					data: data,
					success: success
				})
			}
		
			var validate_form = function(url, form, done){
				var to_send = {}
				for ( var el in form.form ){
					to_send[el] = form.form[el].input.val();
					form.form[el].error.slideUp('fast');
				}
				$.ajax({
					url: url,
					type: "POST",
					data: to_send,
					success: function(data){
						if(!data.success){
							form.global_message.html('');
							if(data.global){
								if(data.global.error){
									form.global_message.append('<div class="error">'+data.global.error.join('</div><div class="error">')+'</div>');
								}
							}
							
							for ( var el in form.form ){
								form.form[el].error.html(data[el].error.join('<br>'));
								
								if(data[el].error.length)
									form.form[el].error.slideDown('fast');
							}	
						}
						done(data.success, data);
					}
				});			
			}

			var get_forget_password_form = function(){
				return {
					global_message: $('<div class="message"></div>'),
					form: {
						email: {name: "Email Address", input: $('<input type="text">'), error: $('<div class="error input"></div>')}
					}
				}
			}
			
			var get_login_form = function(){
				return {
					global_message: $('<div class="message"></div>'),
					form: {
						email: {name: "Email Address", input: $('<input type="text">'), error: $('<div class="error input"></div>')},
						password: {name: "Password", input: $('<input type="password">'), error: $('<div class="error input"></div>')}
					}
				}
			}
			
			var get_reg_form = function(){
				return {
					global_message: $('<div class="message"></div>'),
					form: {
						title: {name: "Title", input: $('<select />').append('<option value="Mr.">Mr.</option>').append('<option value="Ms.">Ms.</option>').append('<option value="Mrs.">Mrs.</option>'), error: $('<div class="error input"></div>')},
						first_name: {name: "First Name", input: $('<input type="text">'), error: $('<div class="error input"></div>')},
						last_name: {name: "Last Name", input: $('<input type="text">'), error: $('<div class="error input"></div>')},
						email: {name: "Email", input: $('<input type="email" required="required">'), error: $('<div class="error input"></div>')},
						password: {name: "Password", input: $('<input type="password">'), error: $('<div class="error input"></div>')},
						password_confirm: {name: "Confirm Password", input: $('<input type="password">'), error: $('<div class="error input"></div>')}
					}
				}
			}
			
			var render_form = function($form_cont, form){
				$form_cont.append(form.global_message);
				for ( var el in form.form ){
					$form_cont.append($('<label><div class="lbl">'+form.form[el].name+'</div></label>').append(form.form[el].input));
					$form_cont.append(form.form[el].error.hide());
				}			
			}
				
			return{
				init: init,
				init_click: init_click
			};
		})();
		
		return{
			init: init,
			bindClick: bindClick,
			success: success,
			ready: ready
		}
		
	})();
		
		
	if ( document.addEventListener ) {
		document.addEventListener( "DOMContentLoaded", quick_reg.init, false )
	}else{
		if(window.attachEvent) {
		    window.attachEvent('onload', quick_reg.init);
		} else {
		    if(window.onload) {
		        var curronload = window.onload;
		        var newonload = function() {
		            curronload();
		            quick_reg.init();
		        };
		        window.onload = newonload;
		    } else {
		        window.onload = quick_reg.init;
		    }
		}	
	}


}

   
   