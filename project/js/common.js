    //显示Loading
    function showLoading(curr){
        $('.spinner').show();
        $('.custom-modal-mask').show();
        var progressText = curr.toFixed(2);
        $('.spinner .progress-text span').text(progressText*100);
    };
    //隐藏Loading
    function hideLoading(){
        $('.spinner').hide();
        $('.custom-modal-mask').hide();
        $('.spinner .progress-text span').text(0);
    };
    //检验要上传的文件的类型及大小（要求小于20M）是否合格
    function uploadFileCheck(uploadBtn,type,typeErrMsg,callback){
            $(uploadBtn).off('change').on('change',function(e){
                var file = e.target.files[0];
                var fileType = file.type;
                var fileSize = file.size / 1024 / 1024;
                if(fileType.indexOf(type) < 0){
                    showErrMsgModal(typeErrMsg);  
                }
                else if(fileSize>20){
                    showErrMsgModal('文件必须小于20M');
                }
                else{
                    if(callback){
                        callback(file);
                    };
                };
            });
            setTimeout(function () {
                $(uploadBtn).click();
            }, 0);
           return false;
    };


$(function() {
    //region 菜单控制
    $(".nav-link").each(function(i,item){
        var href=$(item).attr("href").replace(/..\//g,"");
        if(location.href.indexOf(href)!=-1){
            $(item).parents("li.nav-item").addClass("active").parents(".nav-item.has-items").addClass("open").addClass("active");
        }
    });
    //endregion
    //region 全局用户信息设置
    var userInfo= globalDataCache.userData.getInfo();
    $("#nickName").html(userInfo.nickName);
    $("#updateAccountForm").validate({
        rules: {
            oldPassword: "required",
            password:"required",
            confirmPassword: {
                required: true,
                equalTo: "#password"
            },
        },
        messages: {
            oldPassword: "请输入旧密码",
            password:"请输入密码",
            confirmPassword: {
                required: "*请输入确认密码",
                equalTo: "*请再次输入相同的密码"
            },
        },
        submitHandler:function(){
            if($("#updateAccountForm").valid()){
                var obj= $("#updateAccountForm").serializeObject();
                $.ajaxAuthor({
                    type: "post",
                    url: urlFunc.format("login/updatePassword"),
                    data: obj,
                    dataType: "json",
                    success: function(result) {
                        if(result.statusCode==0){
                            $("#updatePassword").modal("hide");
                            location.href="../user/login.html"
                        }else{
                            toastr.error(result.errorMsg);
                        }

                    },
                    error: function(xhr, msg, ex) {
                        console.log(ex);
                    }
                });

            }
            return false;
        }

    });
    $("#savePassword").on("click",function(){
        $("#updateAccountForm").submit();
    })
    //endregion
    //region 退出系统
    $("#quit").on("click",function(){
        globalDataCache.userData.removeToken();
        globalDataCache.userData.removeInfo();
        location.href="../user/login.html";
    });
    //endregion
    //region 页面菜单
    $('.page-sidebar .nav-item').on('click', function() {
        if (!$(this).hasClass('has-items')) {
            $('.has-items .nav-item').removeClass('active');
            $(this).addClass('active').siblings('li').removeClass('active');
        } else {
            $('.has-items .nav-item').on('click', function() {
                $(this).parent().parent().addClass('active').siblings('li').removeClass('active');
            })
        }
    });
    //endregion
    //region 自动隐藏菜单
    function resize() {
        var windowWidth = $(window).width();
        if (windowWidth <= 1300) {
            $('.page-sidebar-menu').addClass('page-sidebar-menu-closed');
            $('body').addClass('page-sidebar-closed');
        } else {
            $('.page-sidebar-menu').removeClass('page-sidebar-menu-closed');
            $('body').removeClass('page-sidebar-closed');
        }
    };
    resize();
    $(window).on("resize", function() {
        resize();
    });
    //endregion
    //region 全局可拖动
    if(jQuery().draggabilly){
       $('.draggable').each(function(i,ele){
          var halfWidth = $(ele).width()/2 + 20;
          var halfHeight = $(ele).height()/2 + 20;
          $(ele).css({'margin-top':-halfHeight,'margin-left':-halfWidth});
       });
       $('.draggable').draggabilly({});
    };
    //endregion
    //region 模态模式下的全局控制
    var pattern=$.getUrlParam("pattern");
    if(pattern=="window"){
        $(".page-header").hide();
        $(".page-sidebar-wrapper").hide();
        $(".page-footer").hide();
        $(".page-content").attr("style","margin-left:0!important");
    }
    //endregion
    //region  全局控制href的跳转,加入版本控制
    $("body").on("click","a",function(){
        var href=$(this).attr("href");
        href=href?href:"";
        if(href.indexOf(".html")==-1){
            return true;
        }
        if(href.indexOf("?")!=-1){
            href=href+"&v="+config.version;
        }else{
            href=href+"?v="+config.version;
        }
        $(this).attr("href",href);
    })
    //endregion
});