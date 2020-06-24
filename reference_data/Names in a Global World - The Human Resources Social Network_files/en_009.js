

$(function(){
	facebook_connect.init()
});

var facebook_connect = (function(){

	var access_token = -1;
	var user_id = -1;
	
	var _ready_callback = [];
	var _ready = false;
		
	var init = function(){
		if($('#fb-root').length == 0)
			$('body').prepend('<div id="fb-root"></div>');
			
		if(typeof FB === "undefined"){
			jQuery.getScript('http://connect.facebook.net/en_US/all.js', function() {
				initFaceBook(); // inits the facebook api
				checkLogin();
			});		
		}else
		{
			checkLogin();
		}
		
	};
		
	var ready = function(ready_callback){
		_ready_callback.push(ready_callback);
		if(_ready) ready_callback.call(this);
	}

	var checkLogin = function(){		
		if(typeof FB.getLoginStatus !== "undefined"){
			FB.getLoginStatus(function(response) { // gets the login status response is sent in the callback
				if (response.status === 'connected') { // if we have been authorised
					access_token = response.authResponse.accessToken;
					user_id = response.authResponse.userID
					//setCookie(response.authResponse.accessToken, response.authResponse.expiresIn )
				}
				
				for(callback in _ready_callback){
					_ready_callback[callback].call(this);
				}
				_ready = true;			
			});				
		}	
	};	
	
	var setCookie = function(access_token, expiresSec){
		var currtime = new Date();
		var expires = new Date(currtime.getTime() + (100*expiresSec));
		document.cookie = 
			'HBfb=' + access_token + '#' + expires.getTime() +';' +
			'expires=' + expires.toGMTString() + ';'+
			'path=/'
		;	
	}
	
	var initFaceBook = function(){		
		FB.init({ 
			appId:264291506925933, 
			cookie:true, 
			status:true,
			oauth:true
		});	
		FB.XFBML.parse()
	};		
	
	var getAccessToken = function(){
		return access_token;
	}
	var getUserID = function(){
		return user_id;
	}
	
	var login = function(permissions, success){

		FBpermissions = permissions.toString()
		FB.login(function(loginResponse){ // logs in and authorises us
			access_token = loginResponse.authResponse.accessToken;
			user_id = loginResponse.authResponse.userID
			success();
		}, {scope: FBpermissions});	 
	
	}
	
	var hasPermissions = function(permissions, success){
		FB.getLoginStatus(function(response) { // gets the login status response is sent in the callback
			if (response.status === 'connected') { // if we have been authorised	
				FB.api('/me/permissions', function (perm_response) {
					if(typeof perm_response.data !== "undefined"){
						for(i in perm_response.data[0]){
							for(j in permissions) (permissions[j] == i) ? permissions.splice(j, 1) : 1;
						}
						success.call(this,{status: true, permissions: permissions});
					}else
						success.call(this,{status: false, permissions: permissions});								
				});	
			}else
				success.call(this,{status: false, permissions: permissions});
		});
	}
	
	var getPages = function(success){
		FB.api('/me/accounts', success);
	}
		
	var prependToAnchorHref = function($anchor){
		href = $anchor.attr('href');
		
		(href.indexOf("&") == -1)? prepend = '?': prepend = '&';
		
		prepend += 'fb_access_token='+getAccessToken();
		prepend += '&fb_user_id='+getUserID();
	
		$anchor.attr('href', href+prepend);		
	}

	var prependToAnchorHrefOnClick = function($anchor){
		$anchor.click(function(){
			prependToAnchorHref($anchor)
		});
	}
	
	var parseXFBML  = function(){
		if(typeof FB !== "undefined")
			FB.XFBML.parse()
	}
	
	var convertAccessToken = function(callback){	
		if(user_id !== -1)
			$.getJSON('/social_feed/network/status/save?user_id='+getUserID()+'&access_token='+getAccessToken(), callback);
	};
	
			
	return{
		init: init,
		ready: ready,
		getAccessToken: getAccessToken, 
		getUserID: getUserID,
		login: login,
		hasPermissions: hasPermissions,
		getPages: getPages,
		prependToAnchorHref: prependToAnchorHref,
		prependToAnchorHrefOnClick: prependToAnchorHrefOnClick,
		parseXFBML: parseXFBML,
		convertAccessToken: convertAccessToken
	}
})();

