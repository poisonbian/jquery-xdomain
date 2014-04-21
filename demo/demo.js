var fb;

function check_feedback()
{
	if ($("#feedback_bug_type").val() == "")
	{
		return false;
	}
	if ($("#feedback_contact").val() == "")
	{
		return false;
	}
	if ($("#feedback_description").val() == "")
	{
		return false;
	}
	return true;
}

function submit_feedback() {
	if (!check_feedback())
	{
		alert("请填写反馈表单");
		return;
	}
	var settings = fb.feedback.getOption();
	var fb_result = fb.feedback.getResultString({
		'id'	: 'attr("id")',
		'html'	: 'prop("outerHTML")'
	});
	var browswer_info = fb.feedback.browserInfo();
	var data = {
		'url'		: document.URL,
		'form'		: JSON.stringify($(settings.dialogid).find("form").serializeArray()),
		'feedback'	: fb_result,
		'browser'	: JSON.stringify(browswer_info),
		'referer'	: document.referrer,
		'cookie'	: document.cookie,
		'html'		: fb.feedback.absHtml($("html").prop("outerHTML")),
		'subject'	: '[某某平台]用户反馈',
		'receiver'	: 'pm@mail178.com',
		'cc'		: ''
	};
	
	if (settings.submiturl != undefined)
	{
		$.ajax({  
	        type : 'POST',  
	        url : settings.submiturl,
	        dataType : 'json',  
	        data : data,
	        async : true,
	        success : function(data) {
	        	alert("反馈成功");
	    		fb.feedback.closeDialog();
	        },
	        error : function(data) {
	        	alert("反馈接口暂时无法服务");
	        }
		});
	}
}

$(document).ready(function() {
	fb = $("body").feedback({
		'feedbackcss':'css/feedback.css',
		'initdialog':"#feedback",
		'dialogid':'#container_drag',
		'closeposition':'left-up', 
		'allowsub':false, 
		'mintext':0,
		'offsetmp':true,
		'host': 'http://localhost/jquery-feedback/',
		'aftermousedown': function (e) {
			console.log(e);
		},
		'submiturl'	: 'http://localhost/jquery-feedback/php/feedback.php',
		'onsubmit': submit_feedback
	});
});