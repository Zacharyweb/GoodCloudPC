/**
 * Created by 111 on 2017/4/19.
 */
/**
 * Created by 111 on 2017/4/19.
 */



var FlowPk = function() {
    //时间日历
    $('#startDate').datetimepicker({
        lang: 'ch',
        format: 'Y-m-d',
        timepicker: false,
        readonly: true,
        clearButton: true,
        //失去焦点不赋值
        validateOnBlur: false,
        //禁用滚动
        scrollInput: false,
        onChangeDateTime:function (date) {
            var seperator1 = "-";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
            $("#theTime").text(currentdate);
            loader.peopleNumber(function (result) {
                $("span.pager").Pager("init", result.data, globalData.page);
                renders.dayPeople(result);
            })
        }
    });
    var module = this;
    //模块数据全局缓存数据
    //region 模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index) {
                var date = $("#startDate").val();
                var dayTime = new Date(date).getTime();
                var userQueryData = $('#queryBrandsForm').serializeObject();
                $.extend(globalData.queryData,userQueryData);
                var allParams = $.extend({},globalData.queryData,{ pageIndex: index, pageSize: globalData.page.pagesize,current: dayTime });
                loader.loadData(allParams);
            },
            getparams:function(){
                return {
                }
            },
            pagesize: 10,
            pageIndex: 6,
        },
        data:{},
        queryData:{

        }
    }
    //endregion
    //ui绘制
    var renders = {
        builderRows:function(result){
            var html= template("flowPK",result);
            $("#brandTable tbody").html(html);
        },
        dayPeople:function(result){
            var html= template("dayFlow",result);
            $("#peopleNumber").html(html);
        },
        allPeople:function (result) {
            var html= template("allFlow",result);
            $("#total").html(html);
        }
    }
    // 操作处理
    var action = {
        // 终止活动
        modifyState:function (params){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/activity/modifyState"),
                data: params,
                dataType: "json",
                success: function(result) {
                    alert("操作成功");
                    $("#searchBtn").trigger("click");
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //时间获取
        timeAccept:function () {
           var date = new Date();
           var seperator1 = "-";
           var month = date.getMonth() + 1;
           var strDate = date.getDate();
           if (month >= 1 && month <= 9) {
                month = "0" + month;
           }
           if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
           }
           var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
           $("#theTime").text(currentdate);
            $("#startDate").val(currentdate);
        }
    }
    //  数据加载器
    var loader = {
        //加载数据
        loadData:function(allParams){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/shared/summaryOrgGuideShared"),
                data: allParams,
                dataType: "json",
                success: function(result) {
                    renders.builderRows(result);
                    console.log("数据",result)
                }
            });
        },
        //获取单日人流量
        peopleNumber:function(callback){
            var date = $("#startDate").val();
            var dayTime = new Date(date).getTime();
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/shared/userCountByDay"),
                data:{
                    current:dayTime
                },
                dataType: "json",
                success: function(result) {
                   callback(result)
                }
            });
        },
        //获取总流量
        total:function(){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/shared/userCountAll"),
                data:{},
                dataType: "json",
                success: function(result) {
                    renders.allPeople(result);
                }
            });
        },
    };

    //事件注册
    var events = {
        uiEvent: function() {
            $("#queryBrandsBtn").on('click',function () {
                loader.peopleNumber(function (result) {
                    $("span.pager").Pager("init", result.data, globalData.page);
                    renders.dayPeople(result);
                })
            });
            //点击前一天
            $("#Yesterday").off("click").on("click",function () {
                var time = $("#startDate").val(); //当前日历时间
                var date = new Date(time).getTime() //当前日历时间戳
                date = date -  24*60*60*1000;//现在日历时间戳
                //时间戳转化伪时间
                date = new Date(date)
                var seperator1 = "-";
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
                $("#startDate").val(currentdate)
                $("#theTime").text(currentdate);
                loader.peopleNumber(function (result) {
                    $("span.pager").Pager("init", result.data, globalData.page);
                    renders.dayPeople(result);
                })
            });
            //点击后一天
            $("body").on("click","#Tomorrow",function () {
                var time = $("#startDate").val(); //当前日历时间
                var date = new Date(time).getTime() //当前日历时间戳
                date = date + 24*60*60*1000;//现在日历时间戳
                //时间戳转化伪时间
                date = new Date(date)
                var seperator1 = "-";
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
                $("#startDate").val(currentdate)
                $("#theTime").text(currentdate);
                loader.peopleNumber(function (result) {
                    $("span.pager").Pager("init", result.data, globalData.page);
                    renders.dayPeople(result);
                })
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
        $("#queryBrandsBtn").trigger("click");
        loader.total();
        //时间初始化
        action.timeAccept();
        loader.peopleNumber(function (result) {
            $("span.pager").Pager("init", result.data, globalData.page);
            renders.dayPeople(result);
        })
    };
};