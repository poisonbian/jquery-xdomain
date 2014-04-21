function load_script(url, judge, callback) {
	if (judge != null) {
		judge = eval(judge);
		if (judge) {
			callback();
			return;
		}
	}
	
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.readyState ? script.onreadystatechange = function() {
        if (!script.readyState || script.readyState === 'loaded' || script.readyState === 'complete') {
        	script.onreadystatechange = null;
        	callback();
        }
    } : script.onload = function() {
        callback();
    };
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

var scripts=document.getElementsByTagName("script"),  
script = scripts[scripts.length - 1],
src = script.src;
if (src.indexOf("?") == -1) {
	
}
else
{
	//var import_path = "http://localhost/jquery-feedback/Plugin/import/param/" + src;
	var import_path = "http://playboy.sinaapp.com/Plugin/import/param/" + src;
	
	load_script("http://libs.baidu.com/jquery/1.8.3/jquery.min.js", "window.jQuery", function() {
		load_script("http://fankui.qiniudn.com/resources/1.0/json2.min.js", "window.JSON", function () {
			load_script("http://playboy.sinaapp.com/js/jquery.feedback.js", null, function() {
				load_script(import_path, null, function() {
		        });
		    });
		});    
	});
}
