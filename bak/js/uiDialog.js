"use static";
var win = $(window);
function Dialog(options){
	opt = {
		"mask" : true,
		"time" : 0,
		"msg"  : "Loading...",
		"oktext" : "\u786e\u5b9a", //确定
		"cancaltext" : "\u53d6\u6d88" ,//取消
		"okfun" : undefined,
		"cancalfun" : undefined,
		"confirmtext" :"\u7ee7\u7eed" , //继续
		"confirmfun" : undefined,
		"theme" : "",
		"zIndex" : "9999"
	}
	var options = options || {};
	var that = this ,timmer ;
	that.settings = $.extend({}, opt, options);
	that.count =1000;
	that.dialog="";

	that.destroy = function(){
		$(".dialog_global_layout").remove();
	}
	// tip 弹层
	Dialog.prototype.tip = function(argu){
		var tmp;
		that.destroy();
		if(typeof(argu) ==="object"){
			var t = argu, msg = t.msg,time = t.time ,icon = t.icon;
			tmp = '<p class="tip_msg '+icon+'">'+ msg +'</p>';
			that.dialog = $('<div>').addClass('dialog_global_layout').css("z-index", +that.settings.zIndex + (that.count++) ).html(tmp).prependTo('body');
			if(time > 0){
				setTimeout(function(){
					that.dialog.remove();
				},time);
			}
		}else if(typeof(argu) ==="string"){
			var msg = argu;
			tmp = '<p class="tip_msg">'+ msg +'</p>';
			that.dialog = $('<div>').addClass('dialog_global_layout').css("z-index", +that.settings.zIndex + (that.count++) ).html(tmp).prependTo('body');
		}else{
			throw "tip argumens type error need String or Object" ;
		}

	}
	// 对外关闭接口
	Dialog.prototype.destroy = function(){
		var dom = $(".dialog_global_layout");
		if(that){ //部分情况下 先创建dialog ，调用tip后手动destroy时无法找到diaolog对应的that对象
			that.destroy();
		}else if(dom){
			dom.remove();
		}else{
			throw "Dialog not found" ;
		}

	}
	window.Dialog = Dialog;
}
