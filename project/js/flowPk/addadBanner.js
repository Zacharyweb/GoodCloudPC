/**
 * Created by 111 on 2017/6/5.
 */
    //初始化模块
var editor;
KindEditor.ready(function(K) {
    editor = K.create('textarea[name="content"]', {
        allowFileManager : true
    });
    K('input[name=getHtml]').click(function(e) {
        alert(editor.html());
    });
    K('input[name=isEmpty]').click(function(e) {
        alert(editor.isEmpty());
    });
    K('input[name=getText]').click(function(e) {
        alert(editor.text());
    });
    K('input[name=selectedHtml]').click(function(e) {
        alert(editor.selectedHtml());
    });
    K('input[name=setHtml]').click(function(e) {
        editor.html('<h3>Hello KindEditor</h3>');
    });
    K('input[name=setText]').click(function(e) {
        editor.text('<h3>Hello KindEditor</h3>');
    });
    K('input[name=insertHtml]').click(function(e) {
        editor.insertHtml('<strong>插入HTML</strong>');
    });
    K('input[name=appendHtml]').click(function(e) {
        editor.appendHtml('<strong>添加HTML</strong>');
    });
    K('input[name=clear]').click(function(e) {
        editor.html('');
    });
    //自定义上传图片
    K("span[data-name='images']").html('');
    K("span[data-name='images']").html('<img alt="上传图片">');
    K("span[data-name='images']").children('img').addClass('ke-toolbar-icon ke-toolbar-icon-url ke-icon-image');
    K("span[data-name='images']").css({'width':'20px','height':'20px'});
    K("span[data-name='images']").attr('title','上传图片');
    K("span[data-name='images']").addClass('timg');
    K("span[data-name='images']").click(function(e) {
        $.imgUpload({
            callbackEle:"[data-name='images'],.timg",
            successCallback:function(path){
                path = urlFunc.imgFormat(path);
                editor.insertHtml('<img src='+path+'>');
            },
            cropper:false,
            cropperOpts: {
                aspectRatio: 4/3,//截图框的比例
                zoomable:false, //禁用鼠标滚轮放大缩小
                viewMode:1 //截图框只能在图片区域内移动
            }
        },cos)
    });
});

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
            aspectRatio: 2/1,//截图框的比例
            zoomable:false, //禁用鼠标滚轮放大缩小
            viewMode:1 //截图框只能在图片区域内移动
        }
    },cos)
});
var AddAdBanner = function() {
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
                url: urlFunc.format("organizeAd/create"),
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
        //返回单个广告位
        single:function(id,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("organizeAd/single"),
                data:{
                    id:id
                },
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
                var bannerImg =  $(".inputImg").attr('path');
                var description = editor.html();
                var params ={
                    id:0,
                    bannerImg:bannerImg,
                    description:description
                };
                if(bannerImg == undefined){
                    $(".inputImg").siblings('span.prompt').html('请上传广告位');
                    $("#add").removeClass('thisDisabled');
                    return
                }else{
                    $(".inputImg").siblings('span.prompt').html('');
                }
                if(description == ''){
                    $("#description").siblings('span.prompt').html('请填写描述说明');
                    $("#add").removeClass('thisDisabled');
                    return
                }else{
                    $(".inputImg").siblings('span.prompt').html('');
                }
                loader.add(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('添加广告位成功');
                        setTimeout('window.location="adBanner.html"',1500);
                        $("#add").removeClass('thisDisabled');
                    }else{
                        toastr.warning('添加广告位失败')
                    }
                })
            });
            //编辑
            $("body").on('click','#edit',function(){
                var id = $.getUrlParam("id");
                var bannerImg =  $(".inputImg").attr('path');
                var description = editor.html();
                var params ={
                    id:id,
                    bannerImg:bannerImg,
                    description:description
                };
                console.log(params)
                loader.add(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('编辑广告位成功');
                        setTimeout('window.location="adBanner.html"',1500);
                    }else{
                        toastr.warning('编辑广告位失败')
                    }
                })
            });
            //返回
            $('#back').on('click',function () {
                window.location="adBanner.html"
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
            $('h3').html("添加广告位");
        }else {
            $("#edit").css('display','inline-block');
            $("#add").css('display','none');
            $('h3').html("编辑广告位");
            loader.single(id,function (result) {
                $(".inputImg").attr('path',result.data.bannerImg);
                result.data.bannerImg = urlFunc.imgFormat(result.data.bannerImg);
                $(".coverImg").attr('src',result.data.bannerImg);
                editor.html(result.data.description);
                $(".imgIcon1").css('display','none');
            })
        };
    };
}
