
 


var prevEventTimeout;
var prevEventCall;
$(function(){

	
	/*
	$.ajax({
	  url: '/en?t=/network/event/calendar/showCalAjax',
	  success: function(data) {
	    $('#HRContainer').append(data);
	  }
	});
	*/
	$('#HRContainer').append('<div id="calWrap"><a href="#" style="left: 15px; position: relative; top: -11px; float: right;" id="calClose"><img style="border:0;" src="http://www.hr.com/portals/hrcom/buyers_g_files/close.png"></a><img class="sEventLoading" border="0" style="display:none; float:right;" src="/event_module/images/loading_small.gif"><div id="calCont"></div></div><div id="sEventPreview" style=""></div>');	
	
	$("#showCal").click(function(){
		var cat = $(this).attr("data-cat");
		if(!cat){cat=-1}
		loadCal("/en?t=/network/event/calendar/calendar&action=find&category="+cat);
		return false;
	});
	$("#calCont a").live("click", function(){
		var url = $(this).attr("href");
		if((url.indexOf("/en?t=/network/event/calendar/calendar") != -1))
		{  loadCal(url);
			return false; }
	});
	$("#calClose").live("click", function(){
		$("#calWrap").fadeOut("slow");
		return false;
	});
	
	$("table.calendar a.event0").live("mouseenter",function(e){			
		startEventPreview($(this).attr("href"), e.pageX, e.pageY);
	});
	$("table.calendar a.event0").live("mouseleave",function(){
		if (prevEventTimeout)
			clearTimeout(prevEventTimeout);
		if(prevEventCall && prevEventCall.readyState != 4)
			prevEventCall.abort;	
		$("#sEventPreview").fadeOut();
		$('table.calendar').unbind('mousemove');
	});
		
});
function startEventPreview(arg,X,Y)
{	
	$('table.calendar').bind('mousemove', function(e) {
		shiftEventPreview(e.pageX, e.pageY);
	});
	prevEventTimeout = setTimeout('showEventPreview("'+arg+'",'+X+','+Y+')', 500);
}
function shiftEventPreview(X, Y){
		if($("#sEventPreview").height()+Y > $(window).height()+$(window).scrollTop()-30)
		{
			$("#sEventPreview").css({
				top: $(window).height()+$(window).scrollTop()-$("#sEventPreview").height()-30 + "px",
				left: (X + 20) + "px"
			});			
		}else
		{
			$("#sEventPreview").css({
				top: (Y + 20) + "px",
				left: (X + 20) + "px"
			});
		}
}

function showEventPreview(arg, X, Y)
{
	if(prevEventCall && prevEventCall.readyState != 4)
		prevEventCall.abort;
	prevEventCall = $.ajax({
		url: "/en?t=/network/event/calendar/showPreview",
		data: { 'eArg': arg },
		success: function(data, Status) {
			if(data != "")
			{			
				$("#sEventPreview").html(data);
				shiftEventPreview(X, Y);
				$("#sEventPreview").fadeIn(function(){
						
				})
				//$("#sEventPreview").show();
								
						
			}
		}
	});
	/*
	$("#sEventPreview").load("/en?t=/network/event/calendar/showPreview",{ 'eArg': arg },function(){
			if($("#sEventPreview").text() != "")
				$("#sEventPreview").fadeIn();
	});*/
}

function loadCal(url){ 
	$("img.sEventLoading").fadeIn("slow");
	$("#calCont").load(url,function(){
		$("#calWrap").fadeIn("slow");
		$("img.sEventLoading").fadeOut("slow");
	}); 
}

function popLayer(a){}
function hideLayer(a){}
