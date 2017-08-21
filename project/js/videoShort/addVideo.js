var AddVideo = function() {
    var module = this;
    //模块数据全局缓存数据
    //region 模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index) {
                var allParams = $.extend({},globalData.queryData,{ pagesize: index-1, pageindex: globalData.page.pagesize });
                loader.tagsClass(function (result) {
                    renders.theClass(result.data);
                });
            },
            getparams:function(){
                return {
                    text:$("#searchIpt").val()
                }
            },
            pagesize: 10,
            pageindex: 6,
        },
        data:{},
        queryData:{
            pagesize: '50',
            pageindex: '1',
            shopName:'',
            contacts:'',
            status:-1,
        }
    };
    //endregion
    //ui绘制
    var renders = {
        theClass:function(result){
            var html= template("tages",result);
            $("#cateList tbody").html(html);
        },
        theTags:function(result){
            var html= template("isContainer",result);
            $("#selectTag tbody").html(html);
        },
    };
    // 操作处理
    var action = {
        // 店铺管理数据加载

    };
    //  数据加载器
    var loader = {
        loadData:function(params){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("organize/getOrganizeShopList"),
                data:globalData.queryData,
                dataType: "json",
                success: function(result) {
                    renders.builderRows(result);
                }
            });
        },
        //获取类目及标签
        tagsClass:function(callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("demoVideo/getTagAndCate"),
                data:{},
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
        //添加范例短视频
        addVideo:function(params,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("video/createDemoVideo"),
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
        //获取单个详情
        videoSingle:function(videoId,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("video/single"),
                data:{videoId:videoId},
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
        //上移下移
        switchSortValue:function(videoId,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("video/switchSortValue"),
                data:{videoId:videoId},
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
               $(this).parent().css('display','none')
            });
            //添加范例短视频
            $("body").on('click','#add',function () {
                $("#add").addClass('isDisabled');
                var videoSrc = $(".inputImg1").attr('path');
                var coverImg = $(".inputImg2").attr('path');
                var demoHeaderImg = $(".inputImg3").attr('path');
                var categoryId = $("#leiMu i").attr('data-id');
                var tagIds = [];
                $("#biaoQian p").each(function () {
                    tagIds.push($(this).find('i').attr('data-id'))
                });
                tagIds = tagIds.join(',');
                var brandName = $(".brandName").val();
                var viewCount = $(".viewCount").val();
                var title = $("#title").val();
                if(videoSrc == undefined){
                    $(".Verification1").css('display','inline-block');
                    $("#add").removeClass('isDisabled');
                    return
                }else{
                    $(".Verification1").css('display','none');
                }
                if(coverImg == undefined){
                    $(".Verification2").css('display','inline-block');
                    $("#add").removeClass('isDisabled');
                    return
                }else{
                    $(".Verification2").css('display','none');
                }
                if(demoHeaderImg == undefined){
                    $(".Verification3").css('display','inline-block');
                    $("#add").removeClass('isDisabled');
                    return
                }else{
                    $(".Verification3").css('display','none');
                }
                if(categoryId == undefined){
                    $(".Verification4").css('display','inline-block');
                    $("#add").removeClass('isDisabled');
                    return
                }else{
                   $(".Verification4").css('display','none');
                }
                if(tagIds == ''){
                    $(".Verification5").css('display','inline-block');
                    $("#add").removeClass('isDisabled');
                    return
                }else{
                    $(".Verification5").css('display','none');
                }
                if(brandName == ''){
                    $(".Verification6").css('display','inline-block');
                    $("#add").removeClass('isDisabled');
                    return
                }else{
                    $(".Verification6").css('display','none');
                }
                if(viewCount == ''){
                    $(".Verification7").css('display','inline-block');
                    $('.Verification8').css('display','none');
                    $("#add").removeClass('isDisabled');
                    return
                }else{
                    $(".Verification7").css('display','none');
                }
                var params = {
                    id:0,
                    videoSrc:videoSrc,
                    coverImg:coverImg,
                    demoHeaderImg:demoHeaderImg,
                    categoryId:categoryId,
                    tagIds:tagIds,
                    brandName:brandName,
                    viewCount:viewCount,
                    title:title
                };
                loader.addVideo(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('添加范例短视频成功');
                        setTimeout('window.location="addExample.html"',1500);
                    }else{
                        toastr.warning('添加范例短视频失败')
                    }
                })
            });
            //编辑范例短视频
            $("body").on('click','#edit',function () {
                var videoSrc = $(".inputImg1").attr('path');
                var coverImg = $(".inputImg2").attr('path');
                var demoHeaderImg = $(".inputImg3").attr('path');
                var categoryId = $("#leiMu i").attr('data-id');
                var tagIds = [];
                $("#biaoQian p").each(function () {
                    tagIds.push($(this).find('i').attr('data-id'))
                });
                tagIds = tagIds.join(',');
                var brandName = $(".brandName").val();
                var viewCount = $(".viewCount").val();
                var title = $("#title").val();
                var id = location.search;
                id = id.split('?id=')[1];
                id  = id.split("&v=")[0];
                if(videoSrc == undefined){
                    $(".Verification1").css('display','inline-block');
                    $("#add").removeClass('isDisabled');
                    return
                }else{
                    $(".Verification1").css('display','none');
                }
                if(coverImg == undefined){
                    $(".Verification2").css('display','inline-block');
                    $("#add").removeClass('isDisabled');
                    return
                }else{
                    $(".Verification2").css('display','none');
                }
                if(demoHeaderImg == undefined){
                    $(".Verification3").css('display','inline-block');
                    $("#add").removeClass('isDisabled');
                    return
                }else{
                    $(".Verification3").css('display','none');
                }
                if(categoryId == undefined){
                    $(".Verification4").css('display','inline-block');
                    $("#add").removeClass('isDisabled');
                    return
                }else{
                    $(".Verification4").css('display','none');
                }
                if(tagIds == ''){
                    $(".Verification5").css('display','inline-block');
                    $("#add").removeClass('isDisabled');
                    return
                }else{
                    $(".Verification5").css('display','none');
                }
                if(brandName == ''){
                    $(".Verification6").css('display','inline-block');
                    $("#add").removeClass('isDisabled');
                    return
                }else{
                    $(".Verification6").css('display','none');
                }
                if(viewCount == ''){
                    $(".Verification7").css('display','inline-block');
                    $('.Verification8').css('display','none');
                    $("#add").removeClass('isDisabled');
                    return
                }else{
                    $(".Verification7").css('display','none');
                }
                var params = {
                    id:id,
                    videoSrc:videoSrc,
                    coverImg:coverImg,
                    demoHeaderImg:demoHeaderImg,
                    categoryId:categoryId,
                    tagIds:tagIds,
                    brandName:brandName,
                    viewCount:viewCount,
                    title:title
                };
                loader.addVideo(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('编辑范例短视频成功')
                        setTimeout('window.location="addExample.html"',1500);
                    }else{
                        toastr.warning('编辑范例短视频失败')
                    }
                })
            });
            //返回
            $("#back").on('click',function () {
                window.location="addExample.html"
            });
            //验证次数
            $('body').on('blur','.viewCount',function () {
                if($(this).val() < 0){
                    $('.Verification8').css('display','inline-block');
                    $(this).val('');
                }
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
        $("#btnQuery").trigger("click");
        var id = location.search;
        if(id.indexOf("id") > 0){
            id = id.split('?id=')[1];
            id  = id.split("&v=")[0];
            $('h3').html("编辑范例短视频");
            $("#add").css('display','none');
            $("#edit").css('display','inline-block');
            loader.videoSingle(id,function (result) {
                console.log('result',result);
                $(".inputImg1").attr('path',result.data.videoSrc);
                $(".inputImg2").attr('path',result.data.coverImg);
                $(".inputImg3").attr('path',result.data.demoHeaderImg);
                 var videoSrc = urlFunc.imgFormat(result.data.videoSrc);
                var coverImg = urlFunc.imgFormat(result.data.coverImg);
                var demoHeaderImg = urlFunc.imgFormat(result.data.demoHeaderImg);
                $(".brand-logo-img1").attr('src',"http://image.yetong.org//web/1495612550051.png?");
                $(".brand-logo-img2").attr('src',coverImg);
                $(".brand-logo-img3").attr('src',demoHeaderImg);

                $("#leiMu").html('<p class="isClose">'
                 +'<b>'+result.data.category+'</b>'
                 +'<i data-id="'+result.data.categoryId+'" class="thisClose fa fa-close" style="line-height: 18px;"></i>'
                 +'</p>');
                 var tagIds = result.data.tagIds.split(',');
                 var tagNames = result.data.tagNames.split(',');
                 for(var i=0;i<tagIds.length;i++){
                 $("#biaoQian").append('<p class="isClose">'
                 +'<b>'+tagNames[i]+'</b>'
                 +'<i data-id="'+tagIds[i]+'" class="thisClose fa fa-close" style="line-height: 18px;"></i>'
                 +'</p>');
                 }
                 $(".brandName").val(result.data.demoBrandName);
                 $(".viewCount").val(result.data.viewCount);
                 $("#title").val(result.data.title);
            })
        }else{
            $('h3').html("添加范例短视频");
            $("#edit").css('display','none');
            $("#add").css('display','inline-block');
            $("i.brand-logo-img1").css('display','block');
            $("i.brand-logo-img2").css('display','block');
            $("i.brand-logo-img3").css('display','block');
        }
    };
}