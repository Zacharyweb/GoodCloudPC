/**
 * Created by 111 on 2017/4/19.
 */
var Promoter = function() {
    var module = this;
    //模块数据全局缓存数据
    //region 模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index,params) {
                var allParams = $.extend({},globalData.queryData,{ page: index-1, rows: globalData.page.pagesize });
                loader.loadData(allParams);
            },
            getparams:function(){
                return {
                }
            },
            pagesize: 10,
            showpage: 6,
        },
        data:{},
        queryData:{
            page:'',
            rows:'',
            title:'',
            firstClassId:''
        }
    }
    //endregion
    //ui绘制
    var renders = {
        builderRows:function(result){
            var html= template("promoter",result);
            $("#brandTable tbody").html(html);
        },
        //个人信息加载
        guideAward:function(result){
            var html= template("shopName",result);
            $("#guideAward").html(html);
        }
    }
    // 操作处理
    var action = {

    }
    //  数据加载器
    var loader = {
        loadData:function(params){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/activity/getActivities"),
                data: params,
                dataType: "json",
                success: function(result) {
                    renders.builderRows(result);
                    action.modal();
                }
            });
        },
        count:function(callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/activity/getActivityCount"),
                data: globalData.page.getParams(),
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
            //分页器
            $("#btnQuery").on("click",function(){
                var userQueryData = $('#queryImgListForm').serializeObject();
                console.log(userQueryData);
                $.extend(globalData.queryData,userQueryData);
                loader.count(function(result){
                    $("span.pager").Pager("init", result.data.number, globalData.page);
                });
            });
            //点弹窗的查询
            $("#searchBtn").on("click",function(){
                var userQueryData = $('#queryListForm').serializeObject();
                console.log(userQueryData);
                $.extend(globalData.queryData,userQueryData);
                /*loader.count(function(result){*/
                $("span.pager").Pager("init", 50, globalData.page);
                /* });*/
            });
        }
    };

    /**begin 公开方法**/

    //初始化模块
    this.create = function(options) {
        //初始化事件
        for(var item in events) {
            if(events.hasOwnProperty(item)) {
                events[item]();
            }
        }
    };
}