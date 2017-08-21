//全局工具类,依赖于 config.js
/**
 * url格式化
 */
var urlFunc = (function(config) {
    return {
        format: function(url) {
            return config.baseUrl + url;
        },
        imgFormat:function(url,width,height){
        	if(url.indexOf("http")!=-1){
        		return url;
			}
			var baseUrl=config.imgShowUrl +url+"?";
        	if(width&&height){
                baseUrl=baseUrl+"imageView2/2/w/"+width+"/h/"+height;
                return baseUrl;
			}
			if(width){
                baseUrl=baseUrl+"imageView2/2/w/"+width;
                return baseUrl;
            }
            if(height){
                baseUrl=baseUrl+"imageView2/2/h/"+height;
                return baseUrl;
			}
            return baseUrl;
        },
        videoFormat:function(url){
            if(url.indexOf("http")!=-1){
                return url;
            }
            var baseUrl=config.filesShowUrl +url;
            return baseUrl;
        }
    }
})(window.config||{baseUrl:"未配置",imgBaseUrl:"未配置"});

/**
 * 全局数据缓存类，跨页面
 */
var globalDataCache=(function(){
	
	/**
	 * 用户相关数据
	 */
	var userData={
		setToken:function(obj){
            localStorage.setItem("token",obj);
		},
		getToken:function(){
            return localStorage.getItem("token");
		},
        removeToken:function(){

			
            return localStorage.removeItem("token");
        },
        removeInfo:function(){
            return localStorage.removeItem("u");
        },
		setInfo:function(obj){
			localStorage.setItem("u",JSON.stringify(obj) );
		},
		getInfo:function(){
			return JSON.parse(localStorage.getItem("u")) ;
		},
		getIdentity:function(){
			return this.getInfo().identity;
		}
	}
	/**
	 * 存储全局数据
	 */
	var set=function(key,value){
		localStorage.setItem(key,value);
	}
	
	/**
	 * 获取全局数据
	 */
	var get=function(key){
		return localStorage.getItem(key);
	}
    var remove=function(key){
        return localStorage.removeItem(key);
    }
	return {
		set:set,
		get:get,
        remove:remove,
		userData:userData
	}
})()
/**
 * 日期格式化
 * @param fmt 格式
 * @returns {*}
 */
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//双击图标放大
function clickImg (b) {
    $('body').on('dblclick',''+b+'',function(){
        var src = $(this).attr('src').split('?')[0];
        console.log('双击了');
        $('body').append('' +
            '<div class="modal fade bs-modal-lg in imgFather">'+
            '<div class="layerMongolia">'+
            '<div class="imgContiner">'+
            '<div><img src="'+src+'"><span class="imgClose"><i class="icon-close"></i></span></div>'+
            '</div>'+
            '</div>'+
            '</div>')
    });
    $('body').on('click',".imgClose",function () {
        $(this).parent().parent().parent().parent().css('display','none')
    })
}
//上移下移时蒙层
function clickUpDown () {
    $('body').append('' +
        '<div class="modal fade bs-modal-lg in imgFather loadingFather">'+
        '<div class="layerMongolia">'+
        '<div class="loading">'+
        '<div><img src="../../img/loading.gif" alt=""></div>'+
        '</div>'+
        '</div>'+
        '</div>');
}
/*function chooseSelect(a,b) {
    $(""+a+"").on('focus',function () {
        $(b).css('display','block');
    });
    $(""+a+"").on('blur',function () {
        setTimeout("$("+b+").css('display','none')",170)
    });
    $(""+a+"").bind('input propertychange',function () {
        $(""+b+" li").each(function () {
            if($(this).text().indexOf($(""+a+"").val())>=0){
                $(this).css('display','block')
            }else{
                $(this).css('display','none')
            }
        });
    });
    $('body').on('click',""+b+" li",function () {
        var text = $(this).text();
        var id = $(this).attr('data-id');
        $(""+a+"").val(text);
        $(""+a+"").attr('data-id',id);
        $(""+b+"").css('display','none');
    });

}*/
