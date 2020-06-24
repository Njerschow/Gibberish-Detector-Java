



(function($){

$.sfs = $.extend($.sfs, {roundabout:{}});

$.sfs.roundabout = {
	
	init : function(_opt) { $(function(){
		
		var $roundabout = $(_opt.selector ? _opt.selector : _opt);
		var opt = $.extend({
			
			minOpacity : 1
			
		},_opt);
		
		// event handler
		/* for (e in $.sfs.jsTree.events) { if(opt[e] && typeof opt[e] !== 'function') opt[e] = eval('('+opt[e]+')'); } */
		
		// init
		if($roundabout.get(0)) {
			
			$roundabout
				// .data('sfs', $.extend($roundabout.data('sfs'), {roundabout: opt}))
				.roundabout(opt)
			;
		}
	})}
};

})(jQuery);


