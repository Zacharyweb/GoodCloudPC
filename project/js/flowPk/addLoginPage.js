/**
 * Created by 111 on 2017/6/5.
 */
//封面图
$(".brand-logo-img").click(function(){
    $.imgUpload({
        callbackEle:"[name='brandImg'],.brand-logo-img",
        successCallback:function(path){
            $("input[type='file']").css('display','none');
            $("#icon").find('i').css('display',"none");
            $('.inputImg').attr("path",path);
        },
        progressCallBack:function(curr){
            if(curr>0){
                $("#canvas").css('display','block');
                $("#canvas").parent().find('i').css('display','none');
            }
            var canvas = document.getElementById("myCanvas");
            if(canvas.getContext){
                var ctx = canvas.getContext("2d");
                ctx.beginPath();
                ctx.lineWidth = 5;
                ctx.lineWidth = 5;//线条宽度
                var circle = {
                    x : 60,    //圆心的x轴坐标值
                    y : 60,    //圆心的y轴坐标值
                    r : 30      //圆的半径
                };
                ctx.strokeStyle ='#32c5d2';
                ctx.arc(circle.x,circle.y,circle.r,0,2*curr*Math.PI,false);
                ctx.stroke();
                var percent = (curr.toFixed(2)*100).toFixed(0);
                $(".percent").html(""+percent+"%");
                if(curr == 1){
                    $("#canvas").css('display','none');
                }
            }
        },
        cropper:true,
        cropperOpts: {
            aspectRatio: 3/4,//截图框的比例
            zoomable:false, //禁用鼠标滚轮放大缩小
            viewMode:1 //截图框只能在图片区域内移动
        }
    },cos)
});
var AddLoginPage = function() {
    var module = this;

    var renders = {

    };
    // 操作处理
    var action = {

    };
    //  数据加载器
    var loader = {
        loadData:function(id,callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("loginAd/single"),
                data:{id:id},
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
        //添加、编辑类别
        add:function(params,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("loginAd/create"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callback(result);
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
    };

    //事件注册
    var events = {
        uiEvent: function() {
            //保存
            $("#add").on('click',function(){
                $("#add").addClass('thisDisabled');
                var adImg =  $(".inputImg").attr('path');
                var params ={
                    id:0,
                    adImg:adImg,
                };
                if(adImg == undefined){
                    $(".inputImg").siblings('span.prompt').html('请上传登录页封面');
                    $("#add").removeClass('thisDisabled');
                    return
                }else{
                    $(".inputImg").siblings('span.prompt').html('');
                }
               loader.add(params,function (result) {
                   if(result.statusCode == 0){
                       toastr.success('添加登录页封面成功');
                       setTimeout('window.location="loginPage.html"',1500);
                   }else{
                       toastr.warning('添加登录页封面失败')
                   }
               })
            });
            //编辑
            $("body").on('click','#edit',function(){
                var id = $.getUrlParam("id");
                var adImg =  $(".inputImg").attr('path');
                var params ={
                    id:id,
                    adImg:adImg,
                };
                loader.add(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('编辑登录页封面成功');
                        setTimeout('window.location="loginPage.html"',1500);
                    }else{
                        toastr.warning('编辑登录页封面失败')
                    }
                })
            });
            //返回
            $('#back').on('click',function () {
                window.location="loginPage.html"
            })
        }
    };


    //初始化模块
    this.create = function(options) {
        //初始化事件
        for(var item in events) {
            if(events.hasOwnProperty(item)) {
                events[item]();
            }
        }

        var id = $.getUrlParam("id");
        if(id == undefined){
            $("#edit").css('display', 'none');
            $("#add").css('display', 'inline-block');
            $('h3').html("添加登录页封面");
        }else {
            $("#edit").css('display','inline-block');
            $("#add").css('display','none');
            $('h3').html("编辑登录页封面");
            loader.loadData(id,function (result) {
                result.data.adImg = urlFunc.imgFormat(result.data.adImg,300,400);
                $(".coverImg").attr('src',result.data.adImg);
                $(".imgIcon1").css('display','none');
            })
        };
    };
}
