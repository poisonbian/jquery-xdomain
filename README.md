jquery-feedback
===============

插件功能说明
-----
提供用户反馈的入口，便于用户针对平台界面进行bug、建议的提交和收集

1. 用户反馈时可在页面直接点选，精确地告知开发者bug发生的位置

2. 默认上传url、bug位置、html代码、cookie信息等，此外开发者也可以自定义增加上传信息

3. 开发者能够自定义反馈表单，结合自动上传的信息，收集更多的用户建议，或进行信息分类

4. 上传全局html代码，自动替换资源引用路径（将相对路径转化为绝对路径），在网站资源引入没有使用反盗链技术时，上传的html代码大多数即可直接在本地预览

5. 统一使用JSON作为信息交互手段，提供PHP的后台demo（发出通知邮件）

6. 提供了较多的对外配置、接口及回调机制，开发者可以根据需要进行样式定义、接口扩展等

需要的环境
-----
目前支持jquery1.7+

文件说明
-----
	css/feedback.css					本地版本的核心css文件

	js/jquery.feedback.js				定义了feedback核心功能的js代码（基于JQuery插件形式）
	js/jquery.feedback.remote.js		目前的版本暂时无需关心
	js/jquery.min.js					jQuery 1.8.3的最小化版本，如有需要，可使用
	js/json2.min.js						json2的最小化版本（使IE7及以下版本可以支持JSON格式）

	php/feedback.php					服务端样例代码（发出通知邮件）
	php/dummy.php						服务端样例代码（不做任何处理）
	php/PHPMailer.php					php发邮件的库

	main.html							样例html代码1，简单页面（有div和表格）
	baidu.html							样例html代码2，基于百度搜索结果页面，去除了一些无法远程调用的资源引入
	remote.html							目前的版本暂时无需关心

使用方法
-----
### 前端页面html
可结合main.html进行参考

1. 引入文件，Jquery、json2、feedback插件定义、自己的js代码（也可以直接写在页面中，详细写法见后面一段）

		<script type="text/javascript" src="js/jquery.min.js"></script>
		<!--[if lte IE 7]>
		<script type="text/javascript" src="js/json2.min.js"></script>
		<![endif]-->
		<script type="text/javascript" src="js/jquery.feedback.js"></script>
		<script type="text/javascript" src="demo/demo.js"></script>	

2. 定义一个按钮或者a标签，点击后开始执行反馈流程
		
		<button id="feedback">反馈</button>
		
3. 定义一个反馈框的div，并默认隐藏，并赋一个唯一id

		<div id="container_drag" style="display:none;">
		</div>

### javascript代码
		最简单的调用方式
		$(document).ready(function() {
			fb = $("body").feedback({
				'feedbackcss':'css/feedback.css',
				'initdialog':"#feedback",
				'dialogid':'#container_drag',
				'host': 'http://localhost/jquery-feedback/',
				'submiturl'	: 'http://localhost/jquery-feedback/php/feedback.php'
			});
		});
	
feedbackcss: 默认引入的feedback css文件路径，如果不定义，默认使用 http://bcs.duapp.com/fankui/1.0/feedback.min.css

initdialog: 显示反馈框的点击按钮，见html代码

dialogid: 反馈框的div，见html代码

host: 资源前缀，用于替换html代码中的资源路径。

> 例如host设置为http://www.baidu.com/，若代码中有css资源定义为
> <link rel="stylesheet" type="text/css" href="a.css">
> 
> 那么反馈的时候，提交的html代码中就会变成	
> <link rel="stylesheet" type="text/css" href="http://www.baidu.com/a.css">
> 
> 这样的话，收到反馈直接打开，就可以正确地使用到对应的css资源了
> 除此之外js、img也会做相同处理
> 
> 大部分情况下，反馈邮件中的附件邮件即可直接在浏览器中打开查看效果了
	
submiturl: 用户反馈的内容提交的url（以JSON格式post过去）

### 后端代码
你可以根据自己的需要，自定义后端代码，比如用php、java、python什么的都没问题，只要接收并处理post过来的数据即可

至于处理方式也完全可以根据自己的需要，例如发邮件、存入数据库、做统计等等

此处，给出了一个样例php代码（发邮件），使用PHPMail库，仅供参考，见php/feedback.php

反馈数据说明
-----
		默认反馈数据的代码如下：
		var fb_result = $.fn.feedback.getResultString({
			'id'	: 'attr("id")',
			'html'	: 'prop("outerHTML")'
		});
		var browswer_info = $.fn.feedback.browserInfo();
		var data = {
			'url'		: document.URL,
			'form'		: JSON.stringify($(settings.dialogid).find("form").serializeArray()),
			'feedback'	: fb_result,
			'browser'	: JSON.stringify(browswer_info),
			'referer'	: document.referrer,
			'cookie'	: document.cookie,
			'html'		: $.fn.feedback.absHtml($("html").prop("outerHTML"))
		};

传回服务端的数据以JSON格式传输

url: 当前页面的url地址

form: 反馈表单中的内容，例如选择的反馈类型、联系方式、具体说明

feedback: 反馈时被选中的页面元素信息，包括id和html代码，可根据自己的需要再进行增加

browser: 浏览器信息

referer: referer

cookie: cookie信息

html: 整个页面的html代码（css/js/img资源的相对路径被替换为绝对路径）

以上内容可以根据需要再进行增删，之后会详细说明

配置说明
-----
		以下是默认配置，请直接参照注释内容
		$.fn.feedback.defaults = {
			/** 和样式相关的配置 **/
			'unit'		: 'div,span,p,h1,h2,h3,h4,h5,h6,td,th,a,strong,em,input,i,button,textarea,b,img,hr',	// 允许的标签
			'background': "#00FF00",	// 鼠标点击后的样式 
			'opacity'	: 50,			// 鼠标点击后的透明度
			'border'		: undefined, // shade元素边框样式, 样例："1px solid #000000",
			'tempbackground': "#FFFF00",	// 鼠标经过时的样式
			'tempopacity'	: 50,			// 鼠标经过时的透明度
			'tempborder'	: undefined,	// 鼠标经过时的shade元素边框样式
			'zIndex'	: 1000,		// shade元素的zindex，close元素的zindex=zIndex+1
			'minwidth'	: 0,		// 可点选元素的最小宽度
			'maxwidth'	: 2000,		// 可点选元素的最大宽度
			'minheight'	: 0,		// 可点选元素的最小高度
			'maxheight'	: 200,		// 可点选元素的最大高度
			'mintext'	: 0,		// 可点选元素的最少字数
			'maxtext'	: 2000000,	//可点选元素的最大字数
			'allowsub'	: true,		// 选中父元素之后，是否还保留子元素
			'host'		: undefined,	// 主机前缀，用于替换资源路径，获得absHtml时必须指定
			'offsetmp'	: true,		// 计算shade时，补充计算margin和padding（否则看起来和div内部的文字、图片等元素会有偏移）
			'feedbackcss'	: 'http://bcs.duapp.com/fankui/1.0/feedback.min.css',	// 动态加载的css文件位置
			
			/** 和弹出dialog相关的配置 **/
			'initdialog': undefined,
			'dialogid'	: undefined,
			'addbutton'	: true,
			
			/** 可以设置的回调事件 **/
			'targetvalid'	: undefined,	// 判断元素是否可选
			
			'beforeinit'	: undefined,	// 初始化反馈对话框之前
			'afterinit'		: undefined,	// 初始化反馈对话框完成
			'beforestart'	: undefined,	// 开始标注之前
			'afterstart'	: undefined,
			'beforestop'	: undefined,	// 停止标注之前
			'afterstop'		: undefined,
			'beforecancel'	: undefined,	// 取消标注之前
			'aftercancel'	: undefined,
			'onsubmit'		: undefined,	// 点击提交按钮的时候触发
			
			/** 以下回调事件可增加参数e **/
			'beforemouseover'	: undefined,	// 标注时鼠标经过元素
			'aftermouseover'	: undefined,	
			'beforemouseout'	: undefined,	// 标注时鼠标离开元素
			'aftermouseout'		: undefined,	
			'beforemousedown'	: undefined,	// 标注时鼠标点击落下
			'aftermousedown'	: undefined,	
			
			/** 以下一般不需要修改 **/
			'dialogclass'	: 'jquery-feedback-container',		// dialog元素的class
			'dialogtopclass': 'jquery-feedback-drag-top',	// dialog元素顶部的class
			'feedbackclass'	: 'jquery-feedback-shade',		// feedback shade的class
			'closeclass'	: 'jquery-feedback-close',		// feedback close按钮的class
			'shadeidprefix'	: 'fb_shade_',			// shade元素的id前缀
			'closeidprefix'	: 'fb_close_',			// close元素的id前缀
			'closetext'	: '&times;',				// close按钮的文本
			'closeposition'	: 'right-up',			// close按钮的位置
			'closefontsize'		: 30,				// close按钮的文本自号
			'closefontweight'	: 400,				// close按钮的font-weight
			'closefontfamily'	: 'arial',			// close按钮的font-family
			'closefontcolor'	: '#000000',		// close按钮的颜色
			'closewidth'		: 16,				// 根据closewidth和closeheight设置close按钮的位移（以shade右上角为基准）
			'closeheight'		: 10,
			'flagdialog'	: 'jq-flag-dialog',
			'flagshade'		: 'jq-flag-shade',
			'flagclose'		: 'jq-flag-close',
			'flagindex'		: 'jq-flag-index'
		};

更多接口说明
-----
例如：
		var fb = $("body").feedback({
				//blabla
			});

则可以用以下方式调用：
		fb.feedback.method();
		
可用接口：

		init();						// 初始化反馈对话框
		start();					// 开始进行反馈标注
		stop();						// 结束反馈标注
		getOption();				// 返回配置
		addUnit(unit);				// 增加可选的html tag配置，例如增加一个<h2>，即addUnit("h2")
		removeUnit(unit);			// 删减配置可选的html tag配置，例如不允许选择<h2>，即removeUnit("h2")
		getHtmlJQ();				// 获得所有选中的html元素（target），以jquery元素数组的形式返回
		getHtmlArray();				// 获得所有选中的html元素（target），以html代码数组的形式返回
		
		/**
		 * 根据配置，返回一个json数组
		 * 配置格式：
		 * {
		 * 		'html'	: 'html()'
		 * 		'key'	: 'jquery_function_name()'
		 * }
		 * 这表示返回的数组中，html对应的内容为所有选中元素执行对应的jquery_function_name得到的结果
		 * 例如'html':html()
		 * 表示结果
		 * {
		 * 		'html': $(页面点选元素).html()
		 * }
		 */
		getResult(option);
		
		closeDialog();				// 关闭feedback窗口
		browserInfo();				// 获得浏览器基础信息
		
		/**
		 * 将HTML中的资源引用变成绝对地址, 此时必须设置settings.host
		 * 例如在代码中使用：
		 * <link rel="stylesheet" href="css/style.css">
		 * 
		 * 仅仅将此html代码保存下来的话，由于css资源文件不存在，会导致该html文件在浏览器中显示错乱
		 * 因此需要设置一个host，例如http://www.baidu.com
		 * 
		 * 则会将前面的代码自动更改为
		 * <link rel="stylesheet" href="http://www.baidu.com/css/style.css">
		 * 
		 * 此函数会修改js、css、img图片的引入路径，大多数情况下，可以使html代码的显示与用户显示的内容相同
		 * 特殊情况除外（image有反盗链机制、资源动态引入规则过于复杂等）
		 */
		absHtml(html, host);
		
		getResultString(option);	// 将json array转化为字符串
		addCSS(csspath);			// 动态加载css文件
