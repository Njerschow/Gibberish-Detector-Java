function isArray(value) {
	var s = typeof value;
	if (s === 'object') {
		if (value) {
			if (typeof value.length === 'number' && !(value.propertyIsEnumerable('length')) && typeof value.splice === 'function') {
				return true;
			}
		}
	}
	return false;
}

function ajAd(divName) {
	if (isArray(aj_div_tmp) && typeof(aj_content) != 'undefined' && aj_content != null) {
		for (i=0; i<aj_div_tmp.length; i++ ){
			if (aj_div_tmp[i] == divName) {
				document.write(aj_content[i]);				
				break;
			}
		}		
	}
}

function aj_popup_obj(num, ajtag, ajpopunder, ajwinparams, ajclickwrnd) {
	this.showpopup = function() {
		if (aj_popups[num]) {
			ajwin = window.open(ajtag, "aj_popup"+num, ajwinparams);
			aj_popups[num] = null;
			if (ajwin && ajpopunder) {
				ajwin.blur();
				window.focus();
				window.setTimeout(window.focus, 1000);
                if(navigator.userAgent.indexOf('Firefox') > 0){ 
                	window.open("", "_self", "");
                }				
			}
		}
	};
		
	this.process = function() {
		if (ajclickwrnd) {
			if(window.Event) {
				document.captureEvents(Event.CLICK);
			}
			if (document.addEventListener) {
				document.addEventListener ("click",this.showpopup,false);
			} else if (document.attachEvent) {
				document.attachEvent ("onclick",this.showpopup);
			} else {
				document.onclick = this.showpopup;
			}				
		} else {
			this.showpopup();
		}
	};
}

function aj_popup(tag) {
	if (typeof(aj_popups) == 'undefined') {
		aj_popups = [];
	}
	
	aj_win_params = "width=" + aj_popup_width + ",height=" + aj_popup_height+ ",toolbar=1,menubar=1,resizable=1,scrollbars=1"; 
	aj_popup_tmp = new aj_popup_obj(aj_popups.length, tag, aj_popunder, aj_win_params , aj_popup_onclick_wrnd);
	aj_popups.push(aj_popup_tmp);
	aj_popup_tmp.process();
}

function param(name, value) {
	if (typeof(value) != 'undefined' && value != "") {
		return name + value;
	}
	
	return "";
}

function pos() {
	if (typeof(aj_pos) == 'undefined') {
		aj_pos = 1;
	} else {
		aj_pos++;
	}
	
	return "&pos="+aj_pos;
}

function pv(aj_pv) {
	if (typeof(aj_pv) != 'undefined' && aj_pv == true) {
		if (typeof(aj_pv_rnd) == 'undefined') {
			aj_pv_rnd = Math.round( (Math.random() + "") * 10000000000000000 ) + 1;
		}
		return "&pv=" + aj_pv_rnd;
	}
	
	return "";
}

if (typeof(aj_server) != 'undefined' && typeof(aj_adspot) != 'undefined' && typeof(aj_zone) != 'undefined') {
	aj_tag = aj_server;

	if (typeof(aj_page) == 'undefined') {
		aj_page = "0";
	}

	if (typeof(aj_pv) == 'undefined' || aj_pv == 'true') {
		aj_pv = true;
	}

	if (typeof(aj_div) != 'undefined' && aj_div != null) {
		view = 'mvj';
	} else if (typeof(aj_popup_title) != 'undefined' || (typeof(aj_fmt) != 'undefined' && aj_fmt == 'iframe')) {
		view = 'vh';
	} else {
		view = 'vj';
	}

	aj_tag += aj_adspot + "/" + aj_page + "/" + view + "?z=" + aj_zone;

	if (typeof(aj_ch) != 'undefined') {
		aj_tag += param("&ch=", aj_ch);
	}
	aj_tag += param("&dim=", aj_dim);

	if (typeof(aj_ct) != 'undefined') {
		aj_tag += param("&ct=", aj_ct);
	}

	aj_tag += pos();

	if (typeof(aj_kw) != 'undefined') {
		aj_tag += param("&kw=", aj_kw);
	}

	aj_tz = new Date().getTimezoneOffset();
	aj_url = "";
	try {
	    aj_url = window.top.location.href;
	} catch (err) {
	    aj_url = window.location.href;
	}
	aj_referrer = document.referrer;

	aj_tag += pv(aj_pv);

	aj_tag += param("&nc=", Math.round( (Math.random() + "") * 100000000 ) + 1);

	if (typeof(aj_click) != 'undefined') {
		aj_tag += param("&click=", encodeURIComponent(aj_click));
	}

	aj_tag += param("&tz=", aj_tz);
	aj_tag += param("&url=", encodeURIComponent(aj_url));
	aj_tag += param("&refer=", encodeURIComponent(aj_referrer));

	if (typeof(aj_popup_title) != 'undefined') {
		aj_tag += param ("&ajpopuptitle=", encodeURIComponent(aj_popup_title));
		aj_popup(aj_tag);
	} else if (typeof(aj_fmt) != 'undefined' && aj_fmt == 'iframe' && typeof(aj_width) != 'undefined' && typeof(aj_height) != 'undefined') {
	    document.write('<iframe scrolling="no" frameborder="0" marginheight="0" marginwidth="0" src="' + aj_tag + '" width="' + aj_width + '" height="' + aj_height + '"></iframe>');
	} else {
		document.write('<'+'scr'+'ipt type="text/javas'+'cript" src="'+aj_tag+'"></'+'scr'+'ipt>');
	}
	if (typeof(aj_div) != 'undefined' && aj_div != null) {	
		aj_div_tmp = aj_div;
		aj_div = undefined;
	}
	if (typeof(aj_page) != 'undefined') {
		aj_page = undefined;
	}
	if (typeof(aj_pv) != 'undefined') {
		aj_pv = undefined;
	}
	if (typeof(aj_server) != 'undefined') {
		aj_server = undefined;
	}
	if (typeof(aj_adspot) != 'undefined') {
		aj_adspot = undefined;
	}
	if (typeof(aj_zone) != 'undefined') {
		aj_zone = undefined;
	}
	if (typeof(aj_tagver) != 'undefined') {
		aj_tagver = undefined;
	}
	if (typeof(aj_dim) != 'undefined') {
		aj_dim = undefined;
	}
	if (typeof(aj_ch) != 'undefined') {
		aj_ch = undefined;
	}
	if (typeof(aj_ct) != 'undefined') {
		aj_ct = undefined;
	}
	if (typeof(aj_kw) != 'undefined') {
		aj_kw = undefined;
	}
	if (typeof(aj_popup_title) != 'undefined') {
		aj_popup_title = undefined;
	}

	if (typeof(aj_width) != 'undefined') {
	    aj_width = undefined;
    }
	if (typeof(aj_height) != 'undefined') {
	    aj_height = undefined;
	}
	if (typeof(aj_fmt) != 'undefined') {
	    aj_fmt = undefined;
	}
}
