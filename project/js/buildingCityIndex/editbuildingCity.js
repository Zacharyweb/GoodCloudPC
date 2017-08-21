//图片上传
$("body").on("click",".brand-logo-img",function(){
    $.imgUpload({
        callbackEle:"[name='brandImg'],.brand-logo-img",
        successCallback:function(path){
            $(".isLogoImg").attr('path',path)
        },
        progressCallBack:function(curr) {
            if (curr > 0) {
                $("#canvas1").css('display', 'block');
                $("#canvas1").parent().find('i').css('display', 'none');
            }
            var canvas = document.getElementById("myCanvas1");
            if (canvas.getContext) {
                var ctx = canvas.getContext("2d");
                ctx.beginPath();
                ctx.lineWidth = 5;
                ctx.lineWidth = 5;//线条宽度
                var circle = {
                    x: 60,    //圆心的x轴坐标值
                    y: 60,    //圆心的y轴坐标值
                    r: 30      //圆的半径
                };
                ctx.strokeStyle = '#32c5d2';
                ctx.arc(circle.x, circle.y, circle.r, 0, 2 * curr * Math.PI, false);
                ctx.stroke();
                var percent = (curr.toFixed(2) * 100).toFixed(0);
                $(".percent").html("" + percent + "%");
                if (curr == 1) {
                    $("#canvas1").css('display', 'none');
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
$("body").on("click",".coverImg,.imgIcon1",function(){
    $.imgUpload({
        callbackEle:"[name='coverImg'],.coverImg",
        successCallback:function(path){
            $(".inputImg1").attr('path',path)
        },
        progressCallBack:function(curr) {
            if (curr > 0) {
                $("#canvas").css('display', 'block');
                $("#canvas").parent().find('i').css('display', 'none');
            }
            var canvas = document.getElementById("myCanvas");
            if (canvas.getContext) {
                var ctx = canvas.getContext("2d");
                ctx.beginPath();
                ctx.lineWidth = 5;
                ctx.lineWidth = 5;//线条宽度
                var circle = {
                    x: 60,    //圆心的x轴坐标值
                    y: 60,    //圆心的y轴坐标值
                    r: 30      //圆的半径
                };
                ctx.strokeStyle = '#32c5d2';
                ctx.arc(circle.x, circle.y, circle.r, 0, 2 * curr * Math.PI, false);
                ctx.stroke();
                var percent = (curr.toFixed(2) * 100).toFixed(0);
                $(".percent").html("" + percent + "%");
                if (curr == 1) {
                    $("#canvas").css('display', 'none');
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
var map = new BMap.Map("allmap");
map.centerAndZoom("杭州，滨江区",12);
map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
map.enableContinuousZoom();
var geoc = new BMap.Geocoder();
map.addEventListener("click", function(e){
    var pt = e.point;
    geoc.getLocation(pt, function(rs){
        map.centerAndZoom(pt, 16);
        map.addOverlay(new BMap.Marker(pt));
        $("#thisAddress").val(rs.address);
        $("#thisX").val(rs.point.lat);
        $("#thisY").val(rs.point.lng);
    });
});
$("#changeAddress").click(function(){
    var text=$("#adress").val();
    geoc.getPoint(text, function(point){
        if (point) {
            map.centerAndZoom(point, 16);
            map.addOverlay(new BMap.Marker(point));
            geoc.getLocation(point, function(rs){
                console.log(rs.point.lat);
                console.log(rs.point.lng);
            });
        }else{
        }
    },"杭州");
});
var EditbuildingCity = function() {
    var module = this;
    //region 模块数据全局缓存数据
    var renders = {};
    // 操作处理

    //region 数据加载器
    var loader = {
        building:function(callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("organize/getCompanyDetail"),
                data:{},
                dataType: "json",
                success: function(result) {
                    console.log(result);
                    callback(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        confirmModification:function(params,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("organize/updateCompanyByCompany"),
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
    //endregion

    //region 事件注册
    var events = {
        uiEvent: function() {
            //input初始化
            $('input').on('focus',function () {
                var color = $(this).css('color');
                if( color == 'rgb(85, 85, 85)' || color == '#c2cad8'){
                    return
                }else{
                    $(this).val('');
                    $(this).css({
                        color:'#555',
                        borderColor:'#c2cad8'
                    })
                }
            });
            //确认修改
            $("body").on("click","#add",function () {
                var tel = $("#phone").val();
                var addrees = $("#thisAddress").val();
                var x = $("#thisX").val();
                var y = $("#thisY").val();
                var logo = $(".isLogoImg").attr("path");
                var name = $("#name").val();
                var desc = $("#desc").val();
                var panoUrl = $("#panoUrl").val();
                var userName = $("#createModelTmpl").attr("UserName");
                var password = $("#createModelTmpl").attr("PassWord");
                var remark = $("#createModelTmpl").attr("Remark");
                var coverImg = $(".inputImg1").attr("path");
                $(".isCoverImg").css('display','none');
                $(".isLogo").css('display','none');
                var params ={
                    tel:tel,
                    addrees:addrees,
                    x:x,
                    y:y,
                    logo:logo,
                    name:name,
                    userName:userName,
                    password:password,
                    remark:remark,
                    panoUrl:panoUrl,
                    myDescribe:desc,
                    bannerImg:coverImg
                };
                console.log(params)
                if(logo == undefined ||logo == ''){
                    $(".isLogo").css('display','inline-block');
                    return
                }else if(name == '' || name == '请填写建材城名称'){
                    $("#name").val('请填写建材城名称');
                    $("#name").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                } else if(tel == '' || tel == '请填写联系电话'){
                    $("#phone").val('请填写联系电话');
                    $("#phone").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else if(addrees == '' || addrees == '请填写地址'){
                    $("#thisAddress").val('请填写地址');
                    $("#thisAddress").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else if(panoUrl == '' || panoUrl == '请填写全景地址'){
                    $("#panoUrl").val('请填写全景地址');
                    $("#panoUrl").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else if(desc == '' || desc == '请填写建材城介绍'){
                    $("#desc").val('请填写建材城介绍');
                    $("#desc").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else if(coverImg == undefined || coverImg == ''){
                    $(".isCoverImg").css('display','inline-block');
                    return
                }else {
                    loader.confirmModification(params,function (result) {
                        if(result.statusCode == 0){
                            toastr.success('编辑建材城成功');
                            /* setTimeout('window.location="buildingCityIndex.html"',1500);*/
                        }else{
                            toastr.warning('编辑建材城失败');
                        }
                    })
                }
            });
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
        loader.building(function (result) {
            $('.imgIcon1').css('display','none');
            $(".inputImg1").attr("path",result.data.BannerImg);
            $(".isLogoImg").attr("path",result.data.Logo);
            result.data.BannerImg = urlFunc.imgFormat(result.data.BannerImg);
            result.data.Logo = urlFunc.imgFormat(result.data.Logo);
            $("#logo").attr("src",result.data.Logo);
            $(".coverImg").attr("src",result.data.BannerImg);
            $("#name").val(result.data.Name);
            $("#phone").val(result.data.Tel);
            $("#thisAddress").val(result.data.Addrees);
            $("#thisX").val(result.data.X);
            $("#thisY").val(result.data.Y);
            $("#panoUrl").val(result.data.PanoUrl);
            $("#desc").val(result.data.MyDescribe);
            $("#createModelTmpl").attr("UserName",result.data.UserName);
            $("#createModelTmpl").attr("PassWord",result.data.PassWord);
            $("#createModelTmpl").attr("Remark",result.data.Remark);
        })
    };
};




