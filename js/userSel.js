/*
	使用sel插件
*/
//获取json对象
function getData(){
	var data;
	$.ajax({
		url:"data.json",
		async:false,
		success:function(e){
			data = e;
		}
	})
	return data;
}
$("#box>section").sel({
	data:getData(),

})
