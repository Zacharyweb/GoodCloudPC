/**
 * Created by 111 on 2017/6/29.
 */
var DecorationDry = function() {
    var module = this;

    //region 模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index) {
                var allParams = $.extend({}, globalData.data, { page: index-1,rows: globalData.page.pagesize });
                loader.loadData(allParams);
            },
            getparams:function(){
                return {
                    /*text:$("#text").val()*/
                }
            },
            pagesize: 15,
            showpage: 6
        },
        data:{
            firstId:'',
            secondId:'',
            title:'',
            remark:'',
            isBack:'',
            isClick:''
        }
    };
    //endregion
    //排序


    //region ui绘制
    var renders = {
        builderRows:function(result){
            var html= template("loadArticle",result);
            $("#articleList tbody").html(html);
        }
    };
    //endregion

    //region 操作处理
    var action = {
        //日期格式化
        timeAccept:function (time) {
            var date = new Date(time);
            var seperator1 = "-";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (hour >= 0 && hour <= 9) {
                hour = "0" + hour;
            }
            if (minute >= 0 && minute <= 9) {
                minute = "0" + minute;
            }
            if (second >= 0 && second <= 9) {
                second = "0" + second;
            }
            hour = hour + ':';
            minute = minute + ':';
            var currentDate = date.getFullYear() + seperator1 + month + seperator1 + strDate+ " " +hour +minute +second;
            return currentDate;
        }
    };
    //endregion

    //region 数据加载器
    var loader = {
        loadData:function(params){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("article/pclist"),
                data: params,
                dataType: "json",
                success: function(result) {
                    globalData.data=result;
                    $.each(result.data,function(i,data){
                        data.updateTime = action.timeAccept(data.updateTime);
                    });
                    console.log('paixuhao',result)
                    renders.builderRows(result);
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        count:function(callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("article/total"),
                data:globalData.queryData,
                dataType: "json",
                success: function(result) {
                    callback(result);
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //删除文章
        deleteArticle:function(articleId,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("article/delete"),
                data:{
                    articleId:articleId
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
    }
    //endregion

    //region 事件注册
    var events = {
        uiEvent: function() {
            $("#btnQuery").on("click",function(){
                var userQueryData = $('#queryListForm').serializeObject();
                $.extend(globalData.queryData,userQueryData);
                loader.count(function(result){
                    $("span#pager").Pager("init", result.data, globalData.page);
                });
            });
            //点击弹框查询
            $("#searchBtn").on("click",function(){
                var userQueryData = $('#queryForm').serializeObject();
                $.extend(globalData.queryData2,userQueryData);
                loader.classDataCount(globalData.queryData2);
            });
            //删除文章
            $('body').on("click",".massageDelete",function () {
                $("#deleteArt").css('display','block');
                $("#deleteArt").removeClass('fade');

            });
            $('body').on("click","#deleteArt .confirmDelete",function () {
                var $this=$(this);
                var $tr=$this.parents("tr");
                var articleId= $tr.attr("data-id");
                loader.deleteArticle(articleId,function (result) {
                    if(result.data == 200){
                        toastr.success("文章删除成功!");
                        $("#btnQuery").trigger("click");
                        $("#deleteArt").modal("hide");
                    }else{
                        toastr.warning("文章删除失败!");
                    }
                });
                $("#deleteArt").removeClass('fade');
                $("#deleteArt").css('display','none');
            });

        }

    };
    //region 公开方法

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
        $("#btnQuery").trigger("click");
    };
}


