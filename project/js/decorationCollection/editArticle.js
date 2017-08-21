
//返回
$("#back").on('click',function () {
    window.location="decorationCollectionList.html"
})
var EditArticle = function() {
    var module = this;
    //region 模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index,params) {
                var allParams = $.extend({}, params, { pageIndex: index, pageSize: globalData.page.pagesize });
                /*loader.classData(allParams);*/
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
            page:'0',
            rows:'10',
            title:'',
            firstClassId:''
        }
    };
    //endregion

    //region ui绘制
    var renders = {
        //渲染二级目录内容
        addLei:function(result){
            var html= template("addLei",result);
            $("#Header2").html(html);
        },
    };
    //endregion

    //region 操作处理
    var action = {

    };
    //endregion

    //region 数据加载器
    var loader = {
        //获取关联类目内容
        classData:function(){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("artCategory/getAllList"),
                data:{},
                dataType: "json",
                success: function(result) {
                    renders.addLei(result);
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //点击关联查询所属一级类目
        transSecondId:function(sIds){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("article/transSecondId"),
                data:{
                    sIds:sIds
                },
                dataType: "json",
                success: function(result) {
                    $.each(result.data,function (i, item) {
                        $("#container").append('<p childrenId="'+item.sId+'' +
                            '" fatherId="'+item.fId+'" class="isClose"> ' +
                            '<b >'+item.fTitle+'>'+item.sTitle+'</b> ' +
                            '<i class="thisClose">X</i> ' +
                            '</p>');
                    });
                    $('.theLeiMu').css('display','none');
                    $("#linksToSpace").modal('hide');
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //添加文章
        addArticle:function(params,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("article/editArticle"),
                data: params,
                dataType: "json",
                success: function(result) {
                    callback(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //编辑文章时的加载
        querySingle:function(id){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("article/singleArticle"),
                data: {
                    id:id
                },
                dataType: "json",
                success: function(result) {
                    $(".className1").val(result.data.Title);
                    $(".bigImg").siblings('input').attr("path",result.data.BigImg);
                    result.data.BigImg = urlFunc.imgFormat(result.data.BigImg,160,120);
                    $(".bigImg").attr("src",result.data.BigImg);
                    editor.html(result.data.Content);
                    $(".brand-logo-img1").siblings('input').attr("path",result.data.SmallImg.split(';')[0]);
                    $(".brand-logo-img2").siblings('input').attr("path",result.data.SmallImg.split(';')[1]);
                    $(".brand-logo-img3").siblings('input').attr("path",result.data.SmallImg.split(';')[2]);
                    $(".brand-logo-img4").siblings('input').attr("path",result.data.SmallImg.split(';')[3]);
                    var img1 = urlFunc.imgFormat(result.data.SmallImg.split(';')[0],80,60);
                    var img2 = urlFunc.imgFormat(result.data.SmallImg.split(';')[1],80,60);
                    var img3 = urlFunc.imgFormat(result.data.SmallImg.split(';')[2],80,60);
                    var img4 = urlFunc.imgFormat(result.data.SmallImg.split(';')[3],80,60);
                    $(".brand-logo-img1").attr("src",img1);
                    $(".brand-logo-img2").attr("src",img2);
                    $(".brand-logo-img3").attr("src",img3);
                    $(".brand-logo-img4").attr("src",img4);
                    $("#remark").val(result.data.Remark);
                    var list =[];
                    $.each(result.data.list,function (i,data) {
                        list.push(data.sId);
                    });
                    list = list.join(',');
                    if(list){
                        loader.transSecondId(list);
                    }
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
            //添加文章
            $("#save").on("click",function(){
                var title =$(".className1").val();
                var sId= [];
                $("#container p").each(function(){
                    sId.push($(this).attr("childrenid"));
                });
                sId = sId.join(',');
                var bigImg = $(".inputImg").attr("path");
                var img = [];
                $("#smallImg img").each(function(){
                    img.push($(this).siblings('input').attr("path"));
                });
                var smallImg = img.join(';');
                var content = editor.html();
                var remark = $("#remark").val();
                var params = {
                    title:title,
                    sId:sId,
                    bigImg:bigImg,
                    smallImg:smallImg,
                    content:content,
                    remark:remark,
                    id:0
                };
                if(title == ''){$('.theTitle').css('display','inline');return}else{$('.theTitle').css('display','none');}
                if(sId == ''){$('.theLeiMu').css('display','inline');return}else{$('.theLeiMu').css('display','none');}
                if(bigImg == undefined){$('.theBigImg').css('display','inline');return}else{$('.theBigImg').css('display','none');}
                if(smallImg == ',,,'){$('.theSmallImg').css('display','inline');return}else{$('.theSmallImg').css('display','none');}
                if(content == ''){$('.theContent').css('display','inline');return}else {$('.theContent').css('display','none');}
                loader.addArticle(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('添加文章成功');
                        window.location="decorationCollectionList.html";
                    }else{
                        toastr.warning('添加文章失败')
                    }
                })
            });
            //编辑文章
            $("#keep").on("click",function(){
                var id = $.getUrlParam("id");
                var title =$(".className1").val();
                var sId= [];
                $("#container p").each(function(){
                    sId.push($(this).attr("childrenid"));
                });
                sId = sId.join(',');
                var bigImg = $(".inputImg").attr("path");
                var img = [];
                $("#smallImg img").each(function(){
                    img.push($(this).siblings('input').attr("path"));
                });
                var smallImg = img.join(';');
                var content = editor.html();
                var remark = $("#remark").val();
                var params = {
                    title:title,
                    sId:sId,
                    bigImg:bigImg,
                    smallImg:smallImg,
                    content:content,
                    remark:remark,
                    id:id
                };
                console.log(params);
                if(title == ''){$('.theTitle').css('display','inline');return}else{$('.theTitle').css('display','none');}
                if(sId == ''){$('.theLeiMu').css('display','inline');return}else{$('.theLeiMu').css('display','none');}
                if(bigImg == undefined){$('.theBigImg').css('display','inline');return}else{$('.theBigImg').css('display','none');}
                if(smallImg == ',,,'){$('.theSmallImg').css('display','inline');return}else{$('.theSmallImg').css('display','none');}
                if(content == ''){$('.theContent').css('display','inline');return}else {$('.theContent').css('display','none');}
                loader.addArticle(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('编辑文章成功');
                        window.location="decorationCollectionList.html";
                    }else{
                        toastr.warning('编辑文章失败')
                    }
                })
            });

            $("#linkSpace").on("click",function () {
                loader.classData();
            });
            $("body").on('click','#Header2 .container button',function () {
                if($(this).val() == 0){
                    $(this).addClass('green');
                    $(this).val(1);
                }else{
                    $(this).removeClass('green');
                    $(this).val(0);
                }
            });
            //确认关联
            $('body').on("click",".isGuanlian",function () {
                var secondId = [];
                $("#Header2 button").each(function(){
                    if($(this).val() == 1){
                        secondId.push($(this).attr("data-id"));
                    }
                });
                var secondIds = secondId.join(',');
                loader.transSecondId(secondIds)
            })
            $("body").on("click",".thisClose",function () {
                $(this).parent("p").remove();
            })

        }
    };
    //初始化模块
    this.create = function(options) {
        //合并配置
        for(var item in options) {
            if(options.hasOwnProperty(item)) {
                globalData[item]=options[item];
            }
        }
        //初始化事件
        for(var item in events) {
            if(events.hasOwnProperty(item)) {
                events[item]();
            }
        }
        //取编辑页面时传过来的id
        var id = $.getUrlParam("id");
        if(id == undefined){
            $("#save").css('display','inline-block');
            $("#keep").css('display','none');
            $('h3').html('新建文章')
        }else{
            $("#save").css('display','none');
            $("#keep").css('display','inline-block');
            $('.imgIcon1').css('display','none');
            $('.imgIcon').css('display','none');
            loader.querySingle(id);
        }
    };
    //富文本编辑器
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
                    editor.appendHtml('<img src='+path+'>');
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
}


