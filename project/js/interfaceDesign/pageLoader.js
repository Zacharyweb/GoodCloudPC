/**
 * Created by Spring on 2017/3/21.
 */
/**
 * Created by Spring on 2017/3/17.
 */
//业务js参考模板
var PageLoader = function () {
    var module = this;

    //region 模块数据全局缓存数据
    var globalData = {
        createActivity:null,
        activityId: 0,
        defaultQuestion: []
    }
    //endregion

    //region ui绘制
    var renders = {
        builderTab: function (result) {
            $.each(result.data, function (i, item) {
                item.formatLogo = urlFunc.imgFormat(item.logo);
            })
            var html = template("dataTmpl", result);
            $("#dataTable tbody").html(html);
        },
        builderBanner:function(activityInfo){
            var bannerList = [];
            var imgArr= activityInfo.bannerImg.split(",");
            $.each(imgArr,function(i,item){
                if(item){
                    bannerList.push({
                        src:item,
                        imgSrc:urlFunc.imgFormat(item)
                    })
                }
            })
            var htmlStr = template("bannerImgTemp", {
                bannerList:bannerList
            });
            $("#bannerWarpper").append(htmlStr);
        },
        builderCover:function(activityInfo){
            var videoList = [];
            var imgArr= activityInfo.videoCoverImg.split(",");
            $.each(imgArr,function(i,item){
                if(item){
                    videoList.push({
                        src:item,
                        imgSrc:urlFunc.imgFormat(item)
                    })
                }
            })
            for(var i=0;i<4;i++){
                if(!imgArr[i]){
                    videoList.push({
                        src:"",
                        imgSrc:""
                    })
                }
            }
            var htmlStr = template("videoTempl", {
                videoList:videoList
            });
            $(".video-list").append(htmlStr);
        },
        createTab:function(sealImgId,src){
            var data={
                    hide:0,
                    drag:1,
                    seal:1,
                    code:sealImgId,
                    text:"活动海报",
                    src:src
                };
           var html= template("moduleConfigTmpl",{data:[data]});
            $("#addPoster").before(html);
            data.imgSrc= urlFunc.imgFormat(data.src);
            var posterPaneHtml= template("posterPaneTemp",{data:[data]});
            $(".tab-content").append(posterPaneHtml);
            action.configModule();
            $("#addPoster").prev().find("a").trigger("click");
        }
    }
    //endregion

    //region 操作处理
    var action = {
        createQuestion: function (right1, right2) {
            var defaultQuestion = [];
            defaultQuestion.push({
                id: "q1",
                title: "本次活动的地点?",
                select: [
                    {opt: "A", value: "白马湖"},
                    {opt: "B", value: "黑马湖"},
                    {opt: "C", value: "芝麻湖"},
                    {opt: "D", value: right1}
                ],
                right: "D"
            })
            defaultQuestion.push({
                id: "q2",
                title: "本次活动的时间?",
                select: [
                    {opt: "A", value: "15号-16号"},
                    {opt: "B", value: "17号-19号"},
                    {opt: "C", value: "10号-11号"},
                    {opt: "D", value: right2}
                ],
                right: "D"
            });
            return defaultQuestion;
        },
        createModuleConfig:function(){
            return [
                {
                    code:"task",
                    text:"任务奖券",
                    hide:0,
                    drag:0,
                    seal:0
                },{
                    code:"banner",
                    text:"轮播Banner",
                    hide:0,
                    drag:0,
                    seal:0
                },{
                    code:"basic",
                    text:"活动基础信息",
                    hide:0,
                    drag:0,
                    seal:0
                },{
                    code:"brand",
                    text:"品牌活动",
                    hide:0,
                    drag:1,
                    seal:0
                },{
                    code:"video",
                    text:"小视频入口",
                    hide:0,
                    drag:1,
                    seal:0
                },{
                    code:"groupon",
                    text:"组团签到",
                    hide:0,
                    drag:1,
                    seal:0
                }
            ]
        },
        taskSet: function (result, activityInfo) {
            var question = [];
            if (result.data.TaskQuestions) {
                question = JSON.parse(result.data.TaskQuestions);
            } else {
                var start = new Date(activityInfo.relBeginTime).format("MM月dd号");
                var end = new Date(activityInfo.relEndTime).format("MM月dd号");
                question = this.createQuestion(activityInfo.address, start + "~" + end);
            }
            var html = template("questionTmpl", {data: question});
            $("#questionSet").html(html);
            $("#totalMoney").val(result.data.TotalMoney || 0);
            $("#maxMoney").val(result.data.MaxMoney || 0);
        },
        menuSet:function(result,activityInfo){
            var moduleConfig=[];
            if(result.data.ModuleConfig){
              moduleConfig = JSON.parse(result.data.ModuleConfig);
            }else{
                moduleConfig= this.createModuleConfig();
            }
            $.each(moduleConfig,function(i,item){
                if(item.hide==1){
                    $('[data-target-tab="#'+item.text+'"].hide-module').hide();
                    $('[data-target-tab="#'+item.text+'"].show-module').show();
                }else{
                    $('[data-target-tab="#'+item.text+'"].hide-module').show();
                    $('[data-target-tab="#'+item.text+'"].show-module').hide();
                }
                if(item.seal&&item.seal==1){
                    //绘制海报图界面
                    item.imgSrc=urlFunc.imgFormat(item.src) ;
                    var sealhtml = template("posterPaneTemp", {data: [item]});
                    $(".tab-content").append(sealhtml);
                }
            })
            var html = template("moduleConfigTmpl", {data: moduleConfig});
            $("#dragNav").prepend(html);
        },configModule:function(){
            var moduleConfig=[];
            $("#dragNav").find('a[data-toggle="tab"]').each(function(i,item){
                moduleConfig.push({
                    code:$(item).attr("data-code"),
                    text:$(item).attr("data-text"),
                    hide:parseInt($(item).attr("data-hide")),
                    seal:parseInt($(item).attr("data-seal")),
                    drag:parseInt($(item).attr("data-drag")),
                    src:$(item).attr("data-src")
                })
            })
            loader.setModuleConfig(globalData.activityId,JSON.stringify(moduleConfig))
        }
    }
    //endregion

    //region 数据加载器
    var loader = {
        loadActivity: function (id,callback) {
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/activity/getSimgle"),
                data: {activityId: id},
                dataType: "json",
                success: function (result) {
                    var html = template("activityInfoTmpl", result.data);
                    $("#activityInfo").html(html);
                    callback(result.data);
                }
            });
        },
        loadActivityConfig: function (id, activityInfo) {
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/activity/getActivityConfigs"),
                data: {activityId: id},
                dataType: "json",
                success: function (result) {
                    action.taskSet(result, activityInfo);
                    action.menuSet(result,activityInfo);
                }
            });
        },
        saveTaskAwardConfig: function (id, totalMoney,maxMoney) {
            $.ajaxAuthor({
                type: "POST",
                url: urlFunc.format("api/activity/saveTaskAwardConfig"),
                data: {activityId:id,totalMoney: totalMoney,maxMoney:maxMoney},
                dataType: "json",
                success: function (result) {
                    console.log(result);
                }
            });
        },
        saveTaskQuestionsConfig: function (id, questionsJson) {
            $.ajaxAuthor({
                type: "POST",
                url: urlFunc.format("api/activity/saveTaskQuestionsConfig"),
                data: {activityId:id,questionsJson:questionsJson},
                dataType: "json",
                success: function (result) {
                    console.log(result);
                }
            });
        },
        setModuleConfig:function(id,configInfo){
            $.ajaxAuthor({
                type: "POST",
                url: urlFunc.format("api/activity/setModuleConfig"),
                data: {activityId:id,configInfo:configInfo},
                dataType: "json",
                success: function (result) {
                    console.log(result);
                }
            });
        },
        setSealImg:function(sealImgId,activityId,sealImg,callback){
            $.ajaxAuthor({
                type: "POST",
                url: urlFunc.format("api/activity/setSealImg"),
                data: {activityId:activityId,sealImgId:sealImgId,sealImg:sealImg},
                dataType: "json",
                success: function (result) {
                    callback(result.data);

                }
            });
        },
        setBannerImg:function(activityId,imgs){
            $.ajaxAuthor({
                type: "POST",
                url: urlFunc.format("api/activity/setBannerImg"),
                data: {activityId:activityId,imgs:imgs},
                dataType: "json",
                success: function (result) {
                    console.log(result);
                }
            });
        },
        getBrands:function(activityId){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/activity/getBrandsImg"),
                data: {activityId:activityId},
                dataType: "json",
                success: function (result) {
                    var brandList =[];
                    $.each(result.data,function (i, item) {
                        brandList.push({
                            imgSrc:urlFunc.imgFormat(item.Logo),
                            id:item.Id
                        })
                    })
                    var brandContent = template("brandTemp", {
                        brandList:brandList
                    });
                    $('#dragBrand').html(brandContent);
                    var dragBrand = $("#dragBrand")[0];
                    Sortable.create(dragBrand, {
                        onEnd: function() {
                            console.log(arguments);
                        }
                    });
                }
            });
        },
        resortBrands:function(activityId,ids){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/activity/resortBrands"),
                data: {activityId:activityId,ids:ids},
                dataType: "json",
                success: function (result) {
                    console.log(result);
                }
            });
        },
        setVideoCoverImg:function(activityId,imgs){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/activity/setVideoCoverImg"),
                data: {activityId:activityId,imgs:imgs},
                dataType: "json",
                success: function (result) {
                    console.log(result);
                }
            });
        },
        getGroupon:function(activityId){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/activity/getGroupon"),
                data: {activityId:activityId},
                dataType: "json",
                success: function (result) {
                    var data=result.data||{id:0,number:0,awardDesc:""};
                    for(var item in data){
                        if(data.hasOwnProperty(item)){
                            var value =data[item];
                            $("#grouponForm").find("[name='"+item+"']").val(value);
                        }
                    }
                }
            });
        },
        setGroupon:function(activityId,number,awardDesc){
            $.ajaxAuthor({
                type: "POST",
                url: urlFunc.format("api/activity/setGroupon"),
                data: {activityId:activityId,number:number,awardDesc:awardDesc},
                dataType: "json",
                success: function (result) {
                   console.log(result);
                }
            });
        },
    };
    //endregion

    //region 事件注册
    var events = {
        uiEvent: function () {
            $("#saveTaskConfig").change(function(){
                var totalMoney= $("#totalMoney").val();
                var maxMoney= $("#maxMoney").val();
                loader.saveTaskAwardConfig(globalData.activityId,totalMoney,maxMoney);
                var question=[];
                $("#questionSet").find("[data-id]").each(function(i,item){
                    var json={
                        id:$(item).attr("data-id"),
                        title:$(item).find('[data-name="title"]').html(),
                        select:[],
                        right:"D"
                    };
                    $(item).find(".custom-options p").each(function(j,jitem){
                        var single={
                            opt:$(jitem).find('[data-name="opt"]').html(),
                            value:$(jitem).find('[data-name="value"]').val(),
                        };
                        json.select.push(single);
                    });
                    question.push(json);
                })
               loader.saveTaskQuestionsConfig(globalData.activityId,JSON.stringify(question));
            });
            $('.hide-module').on('click',function(){
                var targetTab = $(this).data('targetTab');
                var $tartgetTab=$('[href="'+targetTab+'"]');
                $tartgetTab.attr("data-hide",1).find('.tab-text .hideTxt').html("（已隐藏）")

                $(this).hide().siblings('.show-module').show();
                action.configModule();
            });
            $('.show-module').on('click',function(){
                var targetTab = $(this).data('targetTab');
                var $tartgetTab=$('[href="'+targetTab+'"]');
                $tartgetTab.attr("data-hide",0).find('.tab-text .hideTxt').html("")
                $(this).hide().siblings('.hide-module').show();
                action.configModule();
            });
            //拖动 Tab栏
            var dragNav = $("#dragNav")[0];
            Sortable.create(dragNav, {
                draggable: '.drag-nav-item',
                onEnd: function() {
                    action.configModule();
                }
            });
            $("#addPoster").click(function(){
                $.imgUpload({
                    callbackEle:"",
                    successCallback:function(path){
                         loader.setSealImg(0,globalData.activityId,path,function(result){
                             renders.createTab(result,path);
                         });
                    },cropper:false
                },cos)
            });
            $("body").on("click",".change-poster",function(){
                var $this=$(this);
               var data= $(this).data();
                $.imgUpload({
                    callbackEle:"",
                    successCallback:function(path){
                        loader.setSealImg(data.id,globalData.activityId,path,function(result){
                            $('a[data-code="'+data.id+'"]').attr("data-src",path);
                            $this.prev().attr("src",urlFunc.imgFormat(path));
                            action.configModule();
                        });
                    },cropper:false
                },cos)
            });
            $("body").on("click",".deletePoster",function(){
                var $this=$(this);
                var id= $(this).attr("data-target-tab");
                $('.drag-nav-item>a[data-code="'+id+'"]').parent().remove();
                $("#"+id).remove();
                $("#addPoster").prev().find("a").trigger("click");
                action.configModule();
            });
            $("#addBanner").click(function(){
                var $this=$(this);
                var len=$("#bannerWarpper").find(".content-item").length-1;
                if(len==5){
                    toastr.warning("最多上传5张Banner图片");
                    return;
                }
                $.imgUpload({
                    successCallback:function(path){
                        if(len+1==5){
                            $this.hide();
                        }
                       var html=template("bannerImgTemp",{bannerList:[{
                           id:len+1,
                           src:path,
                           imgSrc:urlFunc.imgFormat(path)
                       }]});
                       $("#bannerWarpper").append(html);
                    },cropper:true,cropperOpts: {
                        aspectRatio: 2.3 / 1,
                        crop: function(e) {

                        }
                    }
                },cos)

            });
            $("#bannerWarpper").on("click",".to-prev",function(){
                var prev=$(this).parents(".content-item").prev(".content-item.relative");
                if(prev.length!=0){
                    prev.before($(this).parents(".content-item"));
                }
            })
            $("#bannerWarpper").on("click",".to-next",function(){
                var next=$(this).parents(".content-item").next(".content-item.relative");
                if(next.length!=0){
                    next.after($(this).parents(".content-item"));
                }
            })
            $("#bannerWarpper").on("click",".banner-delete",function(){
                $(this).parents(".content-item").remove();
                $("#addBanner").show();
            })
            $("#saveBanner").click(function(){
                var imgArr=[];
                $("#bannerWarpper").find("div.relative").each(function(i,item){
                    imgArr.push($(item).attr("data-id"));
                })
                loader.setBannerImg(globalData.activityId,imgArr.join(","));
            })
            $("#saveBrand").click(function(){
                var idArr=[];
                $("#dragBrand").find("div[data-id]").each(function (i,item) {
                    idArr.push( parseInt($(item).attr("data-id")));
                })
                loader.resortBrands(globalData.activityId,idArr.join(","));
            });
            $("#saveVideo").click(function(){
                var idArr=[];
                $(".video-list").find(".video-item").each(function (i,item) {
                    var src=$(item).find(".video-cover img").attr("data-src");
                    if(src){
                        idArr.push(src);
                    }

                })
                loader.setVideoCoverImg(globalData.activityId,idArr.join(","));
            });
            $(".video-list").on('click','.video-add-item',function(){
               var $this =$(this);
                $.imgUpload({
                    callbackEle:"",
                    successCallback:function(path){
                        $this.hide();
                        $this.next().show().find("img").attr("data-src",path).attr("src",urlFunc.imgFormat(path));
                    },cropper:true,
                    cropperOpts: {
                        aspectRatio: 9 / 9,
                        zoomable:false, //禁用鼠标滚轮放大缩小
                        viewMode:1, //截图框只能在图片区域内移动
                        crop: function(e) {

                        }
                    }
                },cos)
            });
            $(".video-list").on('click','.delete-video-cover',function(){
                $(this).parents(".video-cover").prev().show();
                $(this).parents(".video-cover").hide().find("img").removeAttr("data-src").removeAttr("src");
            });
            $("#saveGroupon").on("click",function(){
                var obj=$("#grouponForm").serializeObject();
                loader.setGroupon(globalData.activityId,obj.number,obj.awardDesc);
            });
            $("#saveBasicInfo").click(function(){
                globalData.createActivity.save();
            })
        }
    };
    //endregion

    //region 公开方法

    //初始化模块
    this.create = function (options) {
        //合并配置
        for (var item in options) {
            if (options.hasOwnProperty(item)) {
                globalData[item] = options[item];
            }
        }
        //初始化事件
        for (var item in events) {
            if (events.hasOwnProperty(item)) {
                events[item]();
            }
        }
        loader.loadActivity(globalData.activityId, function (data) {
            $("#qrImg").attr("src",urlFunc.imgFormat(data.qrImg));
            globalData.createActivity.create({container: $('#basic').find(".form"), data: data, id: globalData.activityId});
            renders.builderBanner(data);
            renders.builderCover(data);
            loader.loadActivityConfig(globalData.activityId, data);
            loader.getBrands(globalData.activityId);
            loader.getGroupon(globalData.activityId);
        });

    };

    //endregion
}

