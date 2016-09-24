/*
	
*/
function Upload(opt){
	this.set=$.extend({
		file:$("#file"),//file添加文件的文件域
		counter:$("#counter"),//计算添加多少图片的容器
		addImg:$("#addImg"),//存放新添加的图片的容器
		maxNum:8,//最多上传图片的张数
		maxMb:2,//上传图片的大小
		scale:0.8,//上传图片的压缩大小
		ajaxUrl:"upload.php",//ajax请求后台的路径名
		key:"img"//ajax请求图片的key键值
	},opt)
	this.init();//调用初始化方法
	this.counter();//调用统计数量方法
}
Upload.prototype={
	init:function(){
		//给文件域添加change时间
		var _this = this;
		this.set.file.on("change",function(){
			//获取上传文件对象 以及里面所保存的所有信息
			var files = this.files,//files.name存放文件的名称 files存放文件的大小
				reg = /(jpg|png|gif|jpeg)$/;
			//判断上传图片的格式以及大小
			if(!reg.test(files[0].name)){//文件格式
				var rem = "请你上传jpg/png/gif/jpeg格式的图片";
			}else{//格式正确 判断文件大小
				if(files[0].size>_this.set.maxMb*1024*1024){
					var rem = "请你上传小于2MB的图片";
				}
			}
			//如果rem存在 证明文件格式错误或者大于2MB
			if(rem){
				//调用单弹出框插件
				$.dailog({
					container:_this.addImg,
					cont:rem,
					btn:["确定"]
				});
				return false;
			}
			//图片格式大小都正确 添加图片
			var html=$('<li class="up_load">'+
						'<img src="">'+
						'<span class="remove"></span>'+
					'</li>');
			_this.set.addImg.prepend(html);
			//判断添加图片的张数 还能添加几张
			_this.counter();
			//压缩图片
			console.log(this.files)
			_this.zipImg({
				files:files,//
				scale:0.8,//
				callback:function(res){
					// res为压缩后的图片 判断是否是数组的类型
					if(res.constructor!=Array){
						res=[res];
					}
					//把压缩后的图片ajax请求上传到服务器
					_this.upImg(res[0]);
				}
			})
		})
		//删除添加的图片
		this.set.addImg.on("click","span.remove",function(){
			$(this).parent().remove();
			_this.counter();
		})
	},
	counter:function(){
		var num = this.set.addImg.find("li").size(),
			overAdd = this.set.addImg.find(".up_load").size(),
			canAdd = this.set.maxNum-overAdd,
			span = this.set.counter.find("span");
		span.eq(0).text(overAdd);
		span.eq(1).text(canAdd);
		if(overAdd>=this.set.maxNum){
			$(".up").hide();
		}else{
			$(".up").show();
		}
	},
	//压缩图片方法
	zipImg: function(cfg){
	    /*
	     * cfg.files      input对象触发onchange时候的files
	     * cfg.scale      压缩比例
	     * cfg.callback     压缩成功后的回调
	     */
	     var _this = this;
	     var options = cfg;

	    [].forEach.call(options.files, function(v, k){
	      var fr = new FileReader();  
	      fr.onload= function(e) {  
	        var oExif = EXIF.readFromBinaryFile(new BinaryFile(e.target.result)) || {};
	        var $img = document.createElement('img');                         
	        $img.onload = function(){                 
	          _this.fixDirect().fix($img, oExif, options.callback,options.scale);
	        };  
	        // if(typeof(window.URL) != 'undefined'){
	        //  $img.src = window.URL.createObjectURL(v);
	        // }else{
	        //  $img.src = e.target.result;       
	        // }
	        $img.src = window.URL.createObjectURL(v);
	      };  
	      //fr.readAsDataURL(v);
	      fr.readAsBinaryString(v);
	    }); 
	   },
	   //调整图片方向
	   fixDirect: function(){
	    var r = {};
	    r.fix = function(img, a, callback,scale) {
	      var n = img.naturalHeight,
	        i = img.naturalWidth,
	        c = 1024,
	        o = document.createElement("canvas"),
	        s = o.getContext("2d");
	      a = a || {};
	      //o.width = o.height = c;
	      //debugger;
	      if(n > c || i > c){
	        o.width = o.height = c;
	      }else{
	        o.width = i;
	        o.height = n;
	      }
	      a.Orientation = a.Orientation || 1;
	      r.detectSubSampling(img) && (i /= 2, n /= 2);
	      var d, h;
	      i > n ? (d = c, h = Math.ceil(n / i * c)) : (h = c, d = Math.ceil(i / n * c));
	      // var g = c / 2,
	      var g = Math.max(o.width,o.height)/2,
	        l = document.createElement("canvas");
	      if(n > c || i > c){
	        l.width = g, l.height = g;
	      }else{
	        l.width = i;
	        l.height = n;
	        d = i;
	        h =n;
	      }
	      //l.width = g, l.height = g;
	      var m = l.getContext("2d"), u = r.detect(img, n) || 1;
	      s.save();
	      r.transformCoordinate(o, d, h, a.Orientation);
	      var isUC = navigator.userAgent.match(/UCBrowser[\/]?([\d.]+)/i);
	      if (isUC && $.os.android){
	        s.drawImage(img, 0, 0, d, h);
	      }else{
	        for (var f = g * d / i, w = g * h / n / u, I = 0, b = 0; n > I; ) {
	          for (var x = 0, C = 0; i > x; )
	            m.clearRect(0, 0, g, g), m.drawImage(img, -x, -I), s.drawImage(l, 0, 0, g, g, C, b, f, w), x += g, C += f;
	          I += g, b += w
	        }
	      }
	      s.restore();
	      a.Orientation = 1;
	      img = document.createElement("img");
	      img.onload = function(){
	        a.PixelXDimension = img.width;
	        a.PixelYDimension = img.height;
	        //e(img, a);
	      };
	      
	      callback && callback(o.toDataURL("image/jpeg", scale).substring(22));//压缩图片
	    };
	    r.detect = function(img, a) {
	      var e = document.createElement("canvas");
	      e.width = 1;
	      e.height = a;
	      var r = e.getContext("2d");
	      r.drawImage(img, 0, 0);
	      for(var n = r.getImageData(0, 0, 1, a).data, i = 0, c = a, o = a; o > i; ) {
	        var s = n[4 * (o - 1) + 3];
	        0 === s ? c = o : i = o, o = c + i >> 1
	      }
	      var d = o / a;
	      return 0 === d ? 1 : d
	    };
	    r.detectSubSampling = function(img) {
	      var a = img.naturalWidth, e = img.naturalHeight;
	      if (a * e > 1048576) {
	        var r = document.createElement("canvas");
	        r.width = r.height = 1;
	        var n = r.getContext("2d");
	        return n.drawImage(img, -a + 1, 0), 0 === n.getImageData(0, 0, 1, 1).data[3]
	      }
	      return !1;
	    };
	    r.transformCoordinate = function(img, a, e, r) {
	      switch (r) {
	        case 5:
	        case 6:
	        case 7:
	        case 8:
	          img.width = e, img.height = a;
	          break;
	        default:
	          img.width = a, img.height = e
	      }
	      var n = img.getContext("2d");
	      switch (r) {
	        case 2:
	          n.translate(a, 0), n.scale(-1, 1);
	          break;
	        case 3:
	          n.translate(a, e), n.rotate(Math.PI);
	          break;
	        case 4:
	          n.translate(0, e), n.scale(1, -1);
	          break;
	        case 5:
	          n.rotate(.5 * Math.PI), n.scale(1, -1);
	          break;
	        case 6:
	          n.rotate(.5 * Math.PI), n.translate(0, -e);
	          break;
	        case 7:
	          n.rotate(.5 * Math.PI), n.translate(a, -e), n.scale(-1, 1);
	          break;
	        case 8:
	          n.rotate(-.5 * Math.PI), n.translate(-a, 0)
	      }
	    };
	    return r;
   },
   upImg:function(imgUrl){
   		var obj={};
   		obj[this.set.key]=imgUrl;
   		console.log(obj)
   		$.ajax({
			url:this.set.ajaxUrl,
			data:obj,
			dataType:"json",
			type:"post",
			success:function(e){
				$(".up_load").eq(0).find("img").attr("src",e.url);
			}
	})
   }
}