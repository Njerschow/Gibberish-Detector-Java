						



(function($){

$.sfs = $.extend($.sfs, 
{
	lightbox :
	{
		init : function(_opt)
		{
			$(function() {
				
				var $lightbox = $((_opt.selector)? _opt.selector : _opt);
				
				var opt = $.extend (
					{
						imageLoading:'/global_files/javascript/jquery/plugins/lightbox/images/lightbox-ico-loading.gif'
						,imageBtnPrev:'/global_files/javascript/jquery/plugins/lightbox/images/lightbox-btn-prev.gif'
						,imageBtnNext:'/global_files/javascript/jquery/plugins/lightbox/images/lightbox-btn-next.gif'
						,imageBtnClose:'/global_files/javascript/jquery/plugins/lightbox/images/lightbox-btn-close.gif'
						,imageBlank:'/global_files/javascript/jquery/plugins/lightbox/images/lightbox-blank.gif'
					}
					,$.sfs.lightbox.events
					,_opt
				);
				
				// event handler
				for (e in $.sfs.lightbox.events) {
					
					if(opt[e] && typeof opt[e] !== 'function') opt[e] = eval('('+opt[e]+')');
				}
				
				// init
				if($lightbox.get(0)) {
					
					$lightbox
						.data('sfs', $.extend($lightbox.data('sfs'), {lightbox: opt}))
						.lightBox(opt);
				}
			});
		},
		
		events : {}
	}
});

})(jQuery);


