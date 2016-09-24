;(function($){
	var Dailog = function(opt){
		//扩展参数
		var _dis = $.extend({
			title:"",
			cont:"",
			container:$("#box"),
			btn:["确定"]
		},opt),
		//创建页面元素
			html=$("<div class='dailog'><div class='cont'>"+_dis.cont+"</div><p></p></div>");
			_dis.container.append(html);
			$.each(_dis.btn,function(i,val){
				html.find('p').append($("<span>"+val+"</span>"));
			})
			html.css({
				"bottom":0,
				"-webkit-transition":"all 1s"
			})
			_dis.container.append($("<div class='mark'></div>"));
			html.find("span").on("click",function(){
				html.css({
					"bottom":"-200%",
					"-webkit-transition":"all 1s"
				})
				html[0].addEventListener("webkitTransitionEnd",function(){
					$(this).remove();
					$(".mark").remove();
				},false);
			})
	}
	$.dailog=function(opt){
		new Dailog(opt);
	}
})(jQuery)