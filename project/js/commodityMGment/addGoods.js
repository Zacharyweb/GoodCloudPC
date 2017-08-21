
//返回
$("#back").on('click',function () {
    window.location="onShelf.html"
});
var AddGoods = function() {
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
            $("#container").html(html);
            for(var i=0; i<isList.length; i++){
                $("#container button").each(function(){
                    if($(this).attr('data-id') == isList[i]){
                        $(this).addClass('green');
                        $(this).val(1);
                    }
                });
            }
        },
    };
    //endregion

    //region 操作处理
    var action = {

    };
    //endregion

    //region 数据加载器
    var isList = [];
    var loader = {
        //获取商品分类内容
        classData:function(){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("goodCate/getAllList"),
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
        //添加/编辑商品
        addArticle:function(params,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("good/editFirst"),
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
        //编辑商品时的加载
        querySingle:function(id){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("good/single"),
                data: {
                    id:id
                },
                dataType: "json",
                success: function(result) {
                    $(".className1").val(result.data.Name);
                    $(".bigImg").siblings('input').attr("path",result.data.Img);
                    result.data.Img = urlFunc.imgFormat(result.data.Img,160,120);
                    $(".bigImg").attr("src",result.data.Img);
                    editor.html(result.data.Content);
                    $("#remark").val(result.data.Remark);
                    $.each(result.data.list,function (i, data) {
                        isList.push(data.sId);
                    })
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
            //添加商品/编辑商品
            $("#save").on("click",function(){
                var id = $.getUrlParam("id");
                if(id == undefined){
                   id = 0;
                };
                var title =$(".className1").val();
                var sId= [];
                $("#container button").each(function(){
                    if($(this).val() == 1){
                        sId.push($(this).attr("data-id"));
                    }
                });
                sId = sId.join(',');
                var bigImg = $(".inputImg").attr("path");
                var content = editor.html();
                var remark = $("#remark").val();
                var params = {
                    name:title,
                    category:sId,
                    img:bigImg,
                    content:content,
                    remark:remark,
                    id:id
                };
                if(bigImg == undefined){$('.theBigImg').css('display','inline');return}else{$('.theBigImg').css('display','none');}
                if(title == ''){$('.theTitle').css('display','inline');return}else{$('.theTitle').css('display','none');}
                if(sId == ''){$('.theLeiMu').css('display','inline');return}else{$('.theLeiMu').css('display','none');}
                if(content == ''){$('.theContent').css('display','inline');return}else {$('.theContent').css('display','none');}
                loader.addArticle(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('添加或编辑商品成功');
                        window.location="onShelf.html";
                    }else{
                        toastr.warning('添加或编辑商品失败')
                    }
                })
            });
            $("body").on('click','#container .isCont button',function () {
                if($(this).val() == 0){
                    $(this).addClass('green');
                    $(this).val(1);
                }else{
                    $(this).removeClass('green');
                    $(this).val(0);
                }
            });
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
        loader.classData();
        //取编辑页面时传过来的id
        var id = $.getUrlParam("id");
        if(id == undefined){
            $('h1,h3').html('添加商品');
        }else{
            $('h1,h3').html('编辑商品');
            $(".imgIcon").css('display','none');
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


