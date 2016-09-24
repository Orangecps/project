;(function($){
	$.fn.sel=function(opt){
		//扩展参数
		var _dis = $.extend({
			data:getData()
		},opt);
		//功能语句
		return $(this).each(function(i,ele){
			var key = $(this).attr("data-key"),
				arr,str="<option>请选择</option>",
				sel = $(this).find("select"),
				label = $(this).find("label");
			//判断arr是数组类型还是对象
			if(Object.prototype.toString.call(_dis.data[key])=="[object Array]"){
				arr = _dis.data[key];
			}else{
				arr = _dis.data[key].option;
			}
			$.each(arr,function(i,val){
				var name = val.name || val.text,
					value = val.id || val.value;
				str+="<option value='"+value+"'>"+name+"</option>";
			})
			sel.eq(0).html(str);
			label.eq(0).text(sel.eq(0)[0].options[0].text);
			sel.eq(0).on("change",function(){
				var thisInd = this.selectedIndex,
					opts = this.options[thisInd].text,
					html = "";
				label.eq(0).text(opts)
				if(thisInd>0){
					$(this).parent().next().css("visibility","visible");
					$.each(arr[thisInd-1].option,function(i,val){
						var tet = val.name || val.text,
							val1 = val.id || val.value;
						html+="<option value='"+val1+"'>"+tet+"</option>";
					})
					sel.eq(1).html(html);
					label.eq(1).text(sel.eq(1)[0].options[0].text);
					sel.eq(1).on("change",function(){
						label.eq(1).text(this.options[this.selectedIndex].text);
					})
				}else{
					$(this).parent().next().css("visibility","hidden");
				}
			})
		})
	}
})(jQuery)