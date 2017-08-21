/**
 * Created by 111 on 2017/4/19.
 */
var EditGallery = function() {
    var module = this;
    //模块数据全局缓存数据
    //region 模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index,params) {
                var allParams = $.extend({}, params, { pageIndex: index, pageSize: globalData.page.pagesize });
                console.log(allParams)
                loader.loadData(allParams);
                console.log("回调");
            },
            getparams:function(){
                return {
                    text:$("#text").val()
                }
            },
            pagesize: 10,
            showpage: 6,
        },
        data:{},
        queryData:{
            utype:1,
            pageIndex:'1',
            pageSize:'20',
            organizeName:'',
            mpName:''
        }
    };

    //endregion
    //ui绘制
    var renders = {
        builderRows:function(result){
            var html= template("storeManagement",result);
            $("#sample tbody").html(html);
        },
        //建材城名称
        buildingCityName:function(result){
            var html= template("container1",result);
            $("#storeName1").html(html);
        },
        //店铺名称
        storeName:function(result){
            var html= template("container2",result);
            $("#storeName").html(html);
        },
        theTags:function(result){
            var html= template("isContainer",result);
            $("#selectTag tbody").html(html);
        },
    };
    // 操作处理
    var action = {};
    //
    var loader = {
        //获取建材城数据
        loadData:function(id,callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("pano/single"),
                data:{
                    id:id
                },
                dataType: "json",
                success: function(result) {
                   callback(result);
                }
            });
        },
        loadTags:function(id,callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("pano/singleTags"),
                data:{
                    id:id
                },
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
        //添加、编辑
        addEdit:function(params,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("pano/create"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callback(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //获取类目及标签
        tagsClass:function(callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("pano/getTagAndCate"),
                data:{},
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
    };

    //事件注册
    var events = {
        uiEvent: function() {
            //选择类目
            $("#chooseClass").on('click',function () {
                loader.tagsClass(function (result) {
                    renders.theClass(result.data);
                    console.log(result.data.cateList.length)
                    /*$("span#pager1").Pager("init", result.data.cateList.length, globalData.page);*/
                });
            });
            //确定选择类目
            $("body").on('click','.choose1',function () {
                var id = $(this).attr('data-id');
                var name = $(this).parent().siblings('td').text();
                $(".confirmChoose1").attr('data-id',id);
                $(".confirmChoose1").attr('data-name',name);
            });
            $("body").on('click','.confirmChoose1',function () {
                var id = $(this).attr('data-id');
                var name = $(this).attr('data-name');
                console.log(id,name)
                $("#leiMu").html('<p class="isClose">'
                    +'<b>'+name+'</b>'
                    +'<i data-id="'+id+'" class="thisClose">X</i>'
                    +'</p>');
                $("#selectCategory").modal('hide');
                $("#confirmModal1").modal('hide');
            });
            //选择标签
            $("#chooseTags").on('click',function () {
                loader.tagsClass(function (result) {
                    renders.theTags(result.data);
                    console.log(result.data.cateList.length)
                    /*$("span#pager2").Pager("init", result.data.cateList.length, globalData.page);*/
                });
            });
            //全选
            $("#select").on('click',function () {
                $('#sample input[type="checkbox"]').prop("checked", true);
                $('.confirm').prop('disabled',false);
            });
            //取消全选
            $("#noSelect").on('click',function () {
                $('#sample input[type="checkbox"]').prop("checked", false);
                $('.confirm').prop('disabled',true);
            });
            //单击单个checkBox
            $("body").on("click",'input[type="checkbox"]',function(){
                if($(this)[0].checked == true){
                    $(this).prop("checked", true);
                    $('.confirm').prop('disabled',false);
                }else{
                    $(this).prop("checked", false);
                    $('.confirm').prop('disabled',true);
                }
                $('#sample input[type="checkbox"]').each(function () {
                    if($(this)[0].checked == true){
                        $('.confirm').prop('disabled',false);
                    }
                })
            });
            //确定选择标签
            $("body").on('click','.confirm',function () {
                var strId = [];
                $('#sample input[type="checkbox"]:checked').each(function () {
                    strId.push($(this).attr('data-id')+'/'+$(this).parent().parent().siblings('td').text());
                });
                $(".confirmChoose2").attr('data-name',strId);
            });
            $("body").on('click','.confirmChoose2',function () {
                var strId = $(this).attr('data-name');
                strId = strId.split(',');
                var id = 0;
                var name = '';
                $.each(strId,function(index,value){
                    id = value.split('/')[0];
                    name = value.split('/')[1];
                    $("#biaoQian").append('<p class="isClose">'
                        +'<b>'+name+'</b>'
                        +'<i data-id="'+id+'" class="thisClose">X</i>'
                        +'</p>');
                });
                var arr = [];
                $("#biaoQian p").each(function () {
                    arr.push($(this).find('i').attr('data-id')+'/'+$(this).find('b').text());
                });
                var newArr =[];
                for(var i=0;i<arr.length;i++){
                    if($.inArray(arr[i],newArr)==-1) {
                        newArr.push(arr[i]);
                    }
                }
                $("#biaoQian").html('');
                $.each(newArr,function(index,value){
                    id = value.split('/')[0];
                    name = value.split('/')[1];
                    $("#biaoQian").append('<p class="isClose">'
                        +'<b>'+name+'</b>'
                        +'<i data-id="'+id+'" class="thisClose">X</i>'
                        +'</p>');
                });
                $("#selectTag").modal('hide');
                $("#confirmModal2").modal('hide');
            });
            //关闭
            $("body").on('click','.thisClose',function () {
                $(this).parent().remove();
            });
            //编辑保存
            $("#iconEdit").on('click',function () {
                var coverImg = $(".inputImg").attr('path');
                var panoImg = $(".inputImg1").attr('path');
                var remark = $("#remark").val();
                var title = $("#title").val();
                var idStr = $.getUrlParam("id");
                var tagArrs=[];
                $("#biaoQian").find ("[data-id]").each(function(){
                    tagArrs.push($(this).attr("data-id"));
                });
                var tagsId=tagArrs.join(",");
                var id = idStr.split('&v=')[0];
                var params ={
                    coverImg:coverImg,
                    panoImg:panoImg,
                    id:id,
                    remark:remark,
                    tagsId:tagsId,
                    title:title
                };
                console.log(params);
                loader.addEdit(params,function (result) {
                    if(result.statusCode == 0){
                        $("#iconEdit").addClass('isDisabled');
                        toastr.success('编辑成功');
                         setTimeout('window.location="panoramaHall.html"',1500);
                    }else{
                        toastr.warning('编辑失败')
                    }
                })
            });
            //添加保存
            $("#add").on('click',function () {
                $("#add").addClass('thisDisabled');
                var coverImg = $(".inputImg").attr('path');
                var panoImg = $(".inputImg1").attr('path');
                var title = $("#title").val();
                var idStr = $.getUrlParam("id");
                var tagArrs=[];
                $("#biaoQian").find ("[data-id]").each(function(){
                    tagArrs.push($(this).attr("data-id"));
                });
                var tagsId=tagArrs.join(",");
                var remark = $("#remark").val();
                if(coverImg == undefined){
                    $(".inputImg").siblings('span.prompt').html('请上传封面图');
                    $("#add").removeClass('thisDisabled');
                    return
                }else{
                    $(".inputImg").siblings('span.prompt').html('');
                }
                if(panoImg == undefined){
                    $(".inputImg1").siblings('span.prompt').html('请上传全景图');
                    $("#add").removeClass('thisDisabled');
                    return
                }else{
                    $(".inputImg1").siblings('span.prompt').html('');
                }
                var params ={
                    coverImg:coverImg,
                    panoImg:panoImg,
                    id:0,
                    tagsId:tagsId,
                    remark:remark,
                    title:title
                };
                loader.addEdit(params,function (result) {
                    if(result.statusCode == 0){
                        $("#add").addClass('isDisabled');
                        toastr.success('添加成功');
                        setTimeout('window.location="panoramaHall.html"',1500);
                    }else{
                        toastr.warning('添加失败')
                    }
                });
            });
            //返回
            $("#back").on('click',function () {
                window.location="panoramaHall.html"
            });
            $("#buildingCityName").on('change',function () {
                var id =$(this).val();
                loader.getStoreName(id,function (result) {
                    renders.storeName(result);
                });
            });
           //建材城可输入的select
            $('#selectInput1').on('focus',function () {
                $("#storeName1").css('display','block');
            });
            $('#selectInput1').on('blur',function () {
                setTimeout("$('#storeName1').css('display','none')",170)
            });
            $('#selectInput1').bind('input propertychange',function () {
                $("#storeName1 li").each(function () {
                    if($(this).text().indexOf($('#selectInput1').val())>=0){
                        $(this).css('display','block')
                    }else{
                        $(this).css('display','none')
                    }
                });
            });
            loader.tagsClass(function (result) {
                renders.theTags(result.data);
                console.log(result.data.cateList.length)
                /*$("span#pager2").Pager("init", result.data.cateList.length, globalData.page);*/
            });
            $('body').on('click',"#storeName1 li",function () {
                var text = $(this).text();
                var id = $(this).attr('data-id');
                $("#selectInput1").val(text);
                $("#selectInput1").attr('data-id',id);
                $("#storeName1").css('display','none');
            });
            //店鋪可输入的select
            $('#selectInput').on('focus',function () {
                $("#storeName").css('display','block');
            });
            $('#selectInput').on('blur',function () {
                setTimeout("$('#storeName').css('display','none')",170)
            });
            $('#selectInput').bind('input propertychange',function () {
                $("#storeName li").each(function () {
                    if($(this).text().indexOf($('#selectInput').val())>=0){
                        $(this).css('display','block')
                    }else{
                        $(this).css('display','none')
                    }
                });
            });
            $('body').on('click',"#storeName li",function () {
                var text = $(this).text();
                var id = $(this).attr('data-id');
                $("#selectInput").val(text);
                $("#selectInput").attr('data-id',id);
                $("#storeName").css('display','none');
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

        var id = $.getUrlParam("id");
        if(id == undefined){
            $("#iconEdit").css('display', 'none');
            $("#add").css('display', 'inline-block');
            $("#galleryContainer i").css({
                position: 'absolute',
                border: 'none',
                top: 48,
                left: 195,
            });
            $('h1').html("添加全景展厅");
            $('h3').html("添加全景展厅");

        }else {
            id = $.getUrlParam("id");
            $("#iconEdit").css('display','inline-block');
            $("#add").css('display','none');
            loader.loadData(id,function (result) {
                console.log('传过来的结果：',result);
                $('h1').html("编辑全景展厅");
                $('h3').html("编辑全景展厅");
                $(".inputImg").attr("path",result.data.coverImg);
                $(".inputImg1").attr("path",result.data.panoImg);
                $("#title").val(result.data.title);
                var coverImg = urlFunc.imgFormat(result.data.coverImg,400,200);
                var panoImg = urlFunc.imgFormat(result.data.panoImg,400,200);
                if(coverImg == ''){}else{
                    $("#icon").find('i').css('display',"none");
                }
                if(panoImg == ''){}else{
                    $("#icon1").find('i').css('display',"none");
                }
                $(".coverImg").attr("src",coverImg);
                $(".panoImg").attr("src",panoImg);
                $("#remark").val(result.data.remark);
            });
            loader.loadTags(id,function(result){
                $.each(result.data,function(index,value){
                    id = value.id;
                    name = value.name;
                    $("#biaoQian").append('<p class="isClose">'
                        +'<b>'+name+'</b>'
                        +'<i data-id="'+id+'" class="thisClose">X</i>'
                        +'</p>');
                });
            })
        };
    };
}
