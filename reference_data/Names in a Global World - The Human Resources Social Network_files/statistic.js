
window.statistic = {
    mainUrl: 'http://web.hr.com/',
    urlParams: null,
    pageType: null,
    pager: null,
    parseUrl: function(query) {
        var urlParams = {},
                match,
                pl = /\+/g, // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function(s) {
                    return decodeURIComponent(s.replace(pl, " "));
                };

        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);

        var tmpArr = document.getElementsByName('t');
        if (tmpArr.length > 0)
            urlParams['t'] = tmpArr[0].value;

        var tmpArr = document.getElementsByName('account_layout');
        if (tmpArr.length > 0)
            urlParams['account_layout'] = tmpArr[0].value;

        return urlParams;
    },
    loadScoresDashboard: function() {
        var self = this;
        var widgets = $('div.head h3 a').filter(function() {
            return $(this).html() === 'Actions' || $(this).html() === 'My Actions' || $(this).html() === 'Notes &amp; actions'
        }).parent().parent().parent();

        widgets.find('ul.typeImg.typeIcon li div.item').each(function() {
            var userID, userName;
            $(this).find('a').each(function() {
                var patt = /\((.+)\)/;
                var m = patt.exec($(this).html());
                if (m && m.length > 1) {
                    var tmpParams = self.parseUrl($(this).attr('href').substr($(this).attr('href').indexOf('?') + 1));
                    userID = tmpParams['userID'];
                    userName = m[1];
                }
            });
            var scorePatt = /Customer score:\s+(\d{1,5})/;
            var match = scorePatt.exec($(this).find('div').html());
            if (match && match.length > 1) {
                var score = match[1];
                var html = $(this).html().replace(/Customer score:\s+\d{1,5}/, 'Customer score: <a class="statistic" href="http://www.hr.com/en?t=/CustomCode/pardot/customerStatistics&cid=' + userID + '&uid=' + 0 + '" title=" ' + userName + '">' + score + '</a>')
                $(this).html(html);
            }
        });
        $('a.statistic').fancybox({
            //		width:800,
            'titlePosition': 'inside',
            //		'transitionIn'		: 'none',
            //		'transitionOut'		: 'none',
            'titleFormat': function(title, currentArray, currentIndex, currentOpts) {
                return '<strong>Statistic for ' + title + '</strong>';
            },
            onComplete: function() {
                $('#stat').stupidtable();
            }
        });
        $('a.statistic').click(function() {

            return false;
        });
        widgets.find('div.sfsPager a').click(function() {
            var num = $(this).html();
            self.currentWidget = $(this).parent().parent().parent().parent().parent();
            self.onPageLoad(num);
        });
    },
    loadScoresHistory: function() {
        var self = this;
        $('table.dialogTableList tr.dialogListCell_1.c1, table.dialogTableList tr.dialogListCell_1.c2').each(function() {
            var lnk = $(this).find('td table.sf_customer td.item a');
            var userName = lnk.html();
            var tmpParams = self.parseUrl(lnk.attr('href'));
            var userID = tmpParams['userID'];
            //manager id
            lnk = $(this).find('td').next().next().find('a');
            tmpParams = self.parseUrl(lnk.attr('href'));
            var managerID = tmpParams['userID'];

            var history_body = $(this).find('td div.history_body')
            var scorePatt = /Customer score:\s+(\d{1,5})/;
            var match = scorePatt.exec(history_body.html());
            if (match && match.length > 1) {
                var score = match[1];
                var html = history_body.html().replace(/Customer score:\s+\d{1,5}/, 'Customer score: <a class="statistic" href="http://www.hr.com/en?t=/CustomCode/pardot/customerStatistics&cid=' + userID + '&uid=' + managerID + '" title=" ' + userName + '">' + score + '</a>')
                history_body.html(html);
            }
        });
        $('a.statistic').fancybox({
            'titlePosition': 'inside',
            'titleFormat': function(title, currentArray, currentIndex, currentOpts) {
                return '<strong>Statistic for ' + title + '</strong>';
            },
            onComplete: function() {
                $('#stat').stupidtable();
            }
        });
        $('a.statistic').click(function() {
            return false;
        });
    },
    onPageLoad: function(num) {
        var self = window.statistic;
        if (typeof self.currentWidget === 'undefined')
            return;
        if (num === '&gt;')
            num = parseInt(self.currentWidget.find('div.sfsPager strong').html(), 10) + 1;
        else if (num === '&lt;')
            num = parseInt(self.currentWidget.find('div.sfsPager strong').html(), 10) - 1;

        if (num === '&gt;&gt;')
            num = '>>';
        if (num === '&lt;&lt;')
            num = '<<';

        var searchEl = ((num === '>>' || num === '<<') ? 'span' : 'strong');
        if (self.currentWidget.find('div.sfsPager ' + searchEl + ':contains(' + num + ')').length === 0) {
            setTimeout(function() {
                self.onPageLoad(num)
            }, 300);
            return;
        }
        self.currentWidget = null;
        if (self.pageType === 'dashboard')
            self.loadScoresDashboard();
        else
            self.loadScoresHistory();
    },
    addOpportunity: function() {

        $('#dlg').dialog({
            title: 'Opportunity',
            width: 350,
            height: 215,
            closed: false,
            cache: false,
            href: '/en?t=/CustomCode/pardot/add_opportunity&get_form=1',
            modal: true,
            onLoad: function() {
                $('#opportunity_form').form({
                    url: '/en?t=/CustomCode/pardot/add_opportunity',
                    onSubmit: function(param) {
                        var isValid = $(this).form('validate');
                        if (!isValid) {
                            $.messager.progress('close');
                        }
                        param.oz_id = $('input[name="oz_id"]').val();
                        param.acc_name = $('input[name="acc_name"]').val();
                        param.notes = $('textarea[name="body2"]').val();
                        param.owner = $('select#action_owner').val();
                        param.user_id = $('input[name="user_id"]').val();
                        param.subject = $('#subject').val();
//                        var year = parseInt($('select[name="action_time_yyyy"]').val(), 10);
//                        var month = parseInt($('select[name="action_time_mm"]').val(), 10) - 1;
//                        var day = parseInt($('select[name="action_time_dd"]').val(), 10);
//                        var hour = parseInt($('select[name="action_time_hh"]').val(), 10);
//                        var min = parseInt($('select[name="action_time_dd"]').val(), 10);
//                        param.date = new Date(year, month, day, hour, min).getTime();
//                        param.year = $('select[name="action_time_yyyy"]').val();
//                        param.month = $('select[name="action_time_mm"]').val();
                        return isValid;	// return false will stop the form submission
                    },
                    success: function(data) {
                        var res = eval('[' + data + ']')[0];
                        $.messager.progress('close');
                        if (res.success) {
                            $('#dlg').dialog('close');
                            $('form.formStandard').submit();
                        } else
                            $.messager.alert('Add Opportunity', res.error);
                    }
                });
            }
        });
    },
    init: function() {
        var self = this;
        window.onload = function() {
            setCookie('hr_session', getCookie('session'), 1);

            self.urlParams = self.parseUrl(window.location.search.substring(1));

            //for(var k in self.urlParams) alert(k +' - ' + self.urlParams[k]);

            if ((self.urlParams['t'] === '/account/index' && self.urlParams['account_layout'] === 'admin')
                    || window.location.href.indexOf('dashboard.admin') > 0 || window.location.href.indexOf('history.admin') > 0) {

                //add checkbox to edit note page
                if (window.location.href.indexOf('/app/account/history.admin') > 0 && self.urlParams['action'] === 'edit') {
                    $('.button div.p2').prepend('<input type="checkbox" id="opportunity">&nbsp;<label for="opportunity" style="font-weight:bold">Add Opportunity</label>&nbsp;&nbsp;&nbsp;&nbsp;');
                    $('div.content').append($('<div id="dlg" />'));
                    //$('head').append('<link href="http://www.hr.com/javascript/easyui/themes/default/tooltip.css" rel="stylesheet" type="text/css">');
                    $.getScript("http://web.hr.com/js/jquery.easyui/easyloader.js").done(function(script, textStatus) {
                        easyloader.load('window');
                        easyloader.load('dialog');
                        easyloader.load('tooltip');
                        easyloader.load('messager');
                        easyloader.load('form');
                    });

                    $('.button div.p2 input[type="submit"]').click(function() {
                        if ($('#opportunity')[0].checked) {
                            window.sub_form = $(this).parent().parent().parent();
                            window.statistic.addOpportunity();
                            return false;
                        }
                    });
                } else {
                    self.pageType = (window.location.href.indexOf('dashboard.admin') > 0 ? 'dashboard' : '');
                    $('head').append('<link rel="stylesheet" type="text/css" href="/portals/hrcom/javascript/fancybox/jquery.fancybox-1.3.4.css" />');
                    $.getScript("/portals/hrcom/javascript/stupidtable.js");
                    $.getScript("/portals/hrcom/javascript/fancybox/jquery.fancybox-1.3.4.pack.js").done(function(script, textStatus) {
                        if (self.pageType === 'dashboard')
                            self.loadScoresDashboard();
                        else
                            self.loadScoresHistory();
                    });
                }
            }
            /*
             else if(self.urlParams['t']=='/account/index' && self.urlParams['context']=='planned_revenue' && self.urlParams['action']=='list'){
             window.onload = function(){
             $('#factor').append($('<option>0 %</option>'));
             }
             }
             */
        };
    }
};
window.statistic.init();

window.setCookie = function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString()) + ";domain=.hr.com;path=/";
    document.cookie = c_name + "=" + c_value;
};

window.getCookie = function(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
};