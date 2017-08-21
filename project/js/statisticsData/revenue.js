
var Revenue = function() {
    var module = this;
    //日期插件設置
    $(function(){
        $('#startDate').datetimepicker({
            lang: 'ch',
            format: 'Y-m-d',
            timepicker: false,
            BeforeSelectData: function (a, b, c) {
                if (new Date(c) < new Date($('#startDate').val())) {
                    console.log("结束时间不能小于开始时间", false);
                    return false;
                }
                return true;
            },
            readonly: true,
            clearButton: true,
            //失去焦点不赋值
            validateOnBlur: false,
            //禁用滚动
            scrollInput: false
        });
        $('#endDate').datetimepicker({
            lang: 'ch',
            format: 'Y-m-d',
            timepicker: false,
            step:5,
            BeforeSelectData: function (a, b, c) {
                if (new Date(c) < new Date($('#startDate').val())) {
                    console.log("结束时间不能小于开始时间", false);
                    return false;
                }
                return true;
            },
            readonly: true,
            clearButton: true,
            //失去焦点不赋值
            validateOnBlur: false,
            //禁用滚动
            scrollInput: false
        });
    })

    //region 模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index,params) {
                var allParams = $.extend({},globalData.queryData,{ page: index-1, rows: globalData.page.pagesize });
                loader.loadData(allParams);
            },
            pagesize: 10,
            showpage: 6,
        },
        data:{},
        queryData:{
            name:'',
            tel:'',
            state:'-1',
            pageIndex:'1',
            pageSize:'10'
        }
    };
    //endregion
    //ui绘制
    var renders = {
        builderRows:function(result){
            var html= template("userAward",result);
            $("#addAward tbody").html(html);
        },

    };
    // 操作处理
    var action = {
        //日期格式化
        timeAccept:function (time) {
            var date = new Date(time);
            var seperator1 = "-";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var hour = date.getHours() + ':';
            var minute = date.getMinutes() + ':';
            var second = date.getSeconds();
            var currentDate = date.getFullYear() + seperator1 + month + seperator1 + strDate+ " " +hour +minute +second;
            return currentDate;
        }
    };
    //  数据加载器
    var loader = {

    };

    //事件注册
    var events = {
        uiEvent: function() {
            //分页器、查询
            $("#btnQuery").on("click", function () {
                var userQueryData = $('#queryImgListForm').serializeObject();
                $.extend(globalData.queryData, userQueryData);
                /*loader.count();*/
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
        $("#btnQuery").trigger("click");
    };
    $("b").each(function () {
        console.log($(this).html())
        if($(this).html()<0){
            $(this).addClass('expenditure');
            $(this).removeClass('income')
        }else{
            $(this).addClass('income');
            $(this).removeClass('expenditure')
        }
    })
};