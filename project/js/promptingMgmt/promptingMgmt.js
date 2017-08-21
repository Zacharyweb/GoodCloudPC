
//返回
$("#back").on('click',function () {
    window.location="decorationCollectionList.html"
})
var PromptingMgmt = function() {
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
        //添加子类目
        addLei:function(result){
            var html= template("addLei",result);
            $("#addZiLei tbody").html(html);
        },

    }
    //endregion

    //region 操作处理
    var action = {

    }
    //endregion

    //region 数据加载器
    var loader = {
        //点击关联发送请求
        addChild:function(secondId,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("secondClass/getFirstClass"),
                data:{
                    secondId:secondId
                },
                dataType: "json",
                success: function(result) {
                    callback(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        count:function(){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("secondClass/list"),
                data: globalData.queryData,
                dataType: "json",
                success: function(result) {
                    $("span.pager").Pager("init", result.data.length, globalData.page);
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
            // 全选
            $('body').on("click",'.allSelect',function(){
                $('#Header input[type="checkbox"]').prop("checked", true);
                $('.toggle-disabled').prop('disabled',false);
            });
            // 取消全选
            $('body').on("click",'.cancelSelect',function(){
                $('#Header input[type="checkbox"]').prop("checked", false);
                $('.toggle-disabled').prop('disabled',true);
            });
            //单击单个checkBox
            $("body").on("click",'input[type="checkbox"]',function(){
                if($(this).attr("a")==0){
                    $(this).prop("checked", true);
                    $('.toggle-disabled').prop('disabled',false);
                    $(this).attr("a",1)
                }else{
                    $(this).attr("a",0)
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
        //取编辑页面时传过来的id
        var id = $.getUrlParam("id");
    };
    //富文本编辑器
    var editor;
    KindEditor.ready(function(K) {
        editor = K.create('.textArea', {
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
                    alert(path)
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
};


