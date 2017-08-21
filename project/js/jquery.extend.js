(function ($) {
    $.fn.serializeObject = function (defaultData) {
        var o = {};
        defaultData=defaultData||{};
        var a = this.serializeArray();
        $.each(a, function () {
            if(!this.value && defaultData[this.name]){
                this.value = defaultData[this.name];
            }
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        for(i in defaultData){
            if(defaultData[i] && o[i]==undefined){
                o[i] = defaultData[i];
            }
        }
        return o;
    }
    $.fn.setParams = function (params) {
        var setarea = this.find('[form-data]');
        for (var i = 0; i < setarea.length; i++) {
            var area = $(setarea[i]);
            var types = area.attr('type');
            var fieldName = area.attr('form-data');
            var value = params[fieldName] || "";
            switch (types){
                case "text":
                    area.val(value);
                    break;
                case "radio","checkbox":
                    area.filter("[value=" + value + "]").prop("checked", true);
                    break;
                default:
                    break;
            }
        }
    }
    $.fn.sort = function (callback) {
        var container = this,Key = "createtime",ascending = true;
        $("th[order-field]", container).each(function () {
            var that = $(this);
            if (that.attr("order-field")) {
                that.append('<i class="fa fa-sort"></i>');
            }
        });
        $("th[order-field]", container).on("click",function () {
            var that = $(this),i = that.find("i");
            $(this).siblings("th[order-field]").find("i").removeClass("fa-caret-down").removeClass("fa-caret-up").addClass("fa-sort");
            if(i.hasClass("fa-caret-down")){
                i.removeClass("fa-sort").removeClass("fa-caret-down").addClass("fa-caret-up");
                ascending = true;
            }else{
                i.removeClass("fa-sort").removeClass("fa-caret-up").addClass("fa-caret-down");
                ascending = false;
            }
            Key = that.attr("order-field");
            container.data({sortKey:Key,ascending:ascending});
            callback();
        })
        $("th[order-field]", container).eq(0).trigger("click");
    }
    $.extend({
    	/**
		 * 带认证信息的ajax请求
		 * */
		ajaxAuthor: function(ajaxObj) {
			var token = localStorage.getItem("token");
			if(!token||token=="undefined") {
                location.href = "../user/login.html";
                return;
			}
			ajaxObj.headers = {
				'token': token
                // 'token':'I4AaTweWMp19SlPJf+3fy/AABbvaVvEw07xRjZnAhccTFk4IYObNVSuljtMNsOMa'//运营端
			};
			console.log(ajaxObj.url);
			if(!ajaxObj.error) {
				ajaxObj.error = function(xhr, msg, ex) {
					var statusCode = xhr.status;
					if(statusCode == 403) {
						alert("登陆信息已过期!");
						location.href = "../user/login.html";
					} else if(statusCode) {
						console.log(msg);
					}
				}
			} 
			$.ajax(ajaxObj);
		},
        getUrlParams: function () {
            if (window.location.href.indexOf('?') == -1) {
                return false;
            }
            var vars = {}, hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars[hash[0]] = hash[1];
            }
            return vars;
        },
        getUrlParam: function (name) {
            return $.getUrlParams()[name];
        },
        htmlDecode: function (str) {
            if (!str) {
                return "";
            }
            var s = "";
            if (str.length == 0) return "";
            s = str.replace(/&gt;/g, "&");
            s = s.replace(/&lt;/g, "<");
            s = s.replace(/&gt;/g, ">");
            s = s.replace(/&nbsp;/g, " ");
            s = s.replace(/&#39;/g, "\'");
            s = s.replace(/&quot;/g, "\"");
            s = s.replace(/<br>/g, "\n");
            return s;
        },
    });
    //添加手机号表单验证
    // jQuery.validator.addMethod("isMobile", function(value, element) {
    //     var length = value.length;
    //     var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
    //     return this.optional(element) || (length == 11 && mobile.test(value));
    // }, "请填写正确的手机号码");
})(jQuery);
