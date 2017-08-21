/**
 * Created by 111 on 2017/6/7.
 */
//业务js参考模板
var ManagementApp = function() {
    var module = this;

    //region 模块数据全局缓存数据
    var globalData = {
        page: {
            callback: function (index) {
                var allParams = $.extend({}, {pageIndex: index, pageSize: globalData.page.pagesize});
                loader.loadData(allParams);
                console.log("回调");
            },
            getparams: function () {
                return {
                    companyName: $("#text").val()
                }
            },
            pageIndex: 1,
            pagesize: 10,
        },
        data: {},
    }
    //endregion

    //region ui绘制
    var renders = {
        builderRows: function (result) {
            var html = template("container", result);
            $("#articleList tbody").html(html);
        }
    }
    //endregion

    //region 操作处理
    var action = {};
    //endregion

    //region 数据加载器
    var loader = {
        loadData: function (allParams) {
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("app/getList"),
                data: allParams,
                dataType: "json",
                success: function (result) {
                    console.log(result);
                    renders.builderRows(result);
                }
            });
        },
        count: function (callback) {
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/count"),
                data: {},
                dataType: "json",
                success: function (result) {
                    callback(result);
                }
            });
        }
    };
    //endregion

    //region 事件注册
    var events = {
        uiEvent: function () {

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
        loader.count(function(result){
            $("span.pager").Pager("init", result.data, globalData.page);
        });
    };
}
//endregion

