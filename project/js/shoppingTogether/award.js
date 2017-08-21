/**
 * Created by 111 on 2017/4/19.
 */
/**
 * Created by 111 on 2017/4/19.
 */
var Award = function() {
    var module = this;
    //模块数据全局缓存数据
    //region 模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index) {
                var allParams = $.extend({},globalData.queryData,{ pageIndex: index, pageSize: globalData.page.pagesize });
                loader.loadData(allParams);
            },
            pagesize: 10,
            showpage: 1,
        },
        data:{},
        queryData:{
            name:'',
            tel:'',
            state:'-1',
            pageIndex:'1',
            pageSize:'10'
        }
    }
    //endregion
    //ui绘制
    var renders = {
        builderRows:function(result){
            var html= template("userAward",result);
            $("#addAward tbody").html(html);
        },
        //下单店铺获取
        storeSingle:function(result){
            var html= template("container",result);
            $("#storeName1").html(html);
        },
        //領獎頁面獲取
        award:function(result){
            var html= template("gift",result);
            $("#confirmationAward tbody").html(html);
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
        loadData:function(allParams){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("order/getOranizeOrderByCompany"),
                data:allParams,
                dataType: "json",
                success: function(result) {
                    $.each(result.data,function(i,item){
                        item.GiftTime = action.timeAccept(item.GiftTime);
                    });
                    renders.builderRows(result);
                }
            });
        },
        count:function(callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("order/getOranizeOrderByCompanyCount"),
                data:{
                    name:'',
                    tel:'',
                    state:'-1'
                },
                dataType: "json",
                success: function(result) {
                    callback(result)
                }
            });
        },
        //点击添加新订单获取下单店铺名称
        store:function(params,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("organize/getOrganizeShopList"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
        //保存添加的訂單
        addOrder:function(params,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("order/addOrder"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
        //根據id獲取訂單詳情
            getOrderListByExtendId:function(id,callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("order/getOrderListByExtendId"),
                data:{
                    extendId:id
                },
                dataType: "json",
                success: function(result) {
                    console.log(result);
                    callback(result);
                }
            });
        },
        //领取奖品
        upateGift:function(id,callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("order/upateGift"),
                data:{
                    extendId:id
                },
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
        //删除订单
        delOrder:function(orderId,callback) {
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("order/delteOrder"),
                data: {
                    orderId: orderId
                },
                dataType: "json",
                success: function (result) {
                    callback(result);
                }
            });
        },
    };

    //事件注册
    var events = {
        uiEvent: function() {
            //input初始化
            $('input').on('focus',function () {
                var color = $(this).css('color');
                if( color == 'rgb(85, 85, 85)' || color == '#c2cad8'){
                    return
                }else{
                    $(this).val('');
                    $(this).css({
                        color:'#555',
                        borderColor:'#c2cad8'
                    })
                }
            });
            //分页器、查询
            $("#btnQuery").on("click",function(){
                var userQueryData = $('#queryImgListForm').serializeObject();
                $.extend(globalData.queryData,userQueryData);
                loader.count(function(result){
                    $("span.pager").Pager("init", result.data, globalData.page);
                });
            });
            //点击添加新订单获取下单店铺名称
            $("body").on('click','.addOrder',function () {
                var tel = $(this).parent().siblings('.tel').text();
                var name = $(this).parent().siblings('.name').text();
                var id = $(this).parent().parent('tr').attr('data-id');
                $("#addNewOrder .tel").val(tel);
                $("#addNewOrder .name").val(name);
                $("#addNewOrder .name").attr('data-id',id);
                var params = {
                    pagesize: '1000',
                    pageindex: '1',
                    shopName:'',
                    contacts:'',
                    status:-1,
                };
                loader.store(params,function (result) {
                    console.log(result);
                    renders.storeSingle(result);
                })
            });
            //点击提交保存新订单
            $("body").on('click','#addNewOrder .buttonSave',function () {
                var shopId =  $("#selectInput1").attr('data-id');
                var cash = $("#addNewOrder .cash").val();
                var join = $('#orderForm').serializeObject();
                var remark = $("#addNewOrder .remark").val();
                var accountExtendId = $("#addNewOrder .name").attr('data-id');
                var tel = $("#addNewOrder .tel").val();
                var name = $("#addNewOrder .name").val();
                var params = {
                    shopId:shopId,
                    cash:cash,
                    join:join.danxuan,
                    remark:remark,
                    accountExtendId:accountExtendId
                };
                console.log(params)
                if(tel == '' || tel == '请填写下单用户手机号'){
                    $("#addNewOrder .tel").val("请填写下单用户手机号");
                    $("#addNewOrder .tel").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else if(name == '' || name == '请填写下单用户名'){
                    $("#addNewOrder .name").val("请填写下单用户名");
                    $("#addNewOrder .name").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else if(shopId == undefined){
                    $("#selectInput1").val("请填写下单店铺");
                    $("#selectInput1").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else if(cash == '' || cash == '请输入金额'){
                    $("#addNewOrder .cash").val("请输入金额");
                    $("#addNewOrder .cash").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else{
                    loader.addOrder(params,function (result) {
                        if (result.statusCode == 0) {
                            toastr.success("添加新订单成功");
                            $('#addNewOrder').modal("hide");
                            $("#btnQuery").trigger("click");
                        } else {
                            toastr.error("添加新订单失败");
                        }
                    })
                }
            });
            //点击确定领奖获取领奖弹窗的内容
            $("body").on('click','.confirmationAward',function () {
                var id = $(this).parent().parent('tr').attr('data-id');
                var tel = $(this).parent().siblings('.tel').text();
                var name = $(this).parent().siblings('.name').text();
                var count = $(this).parent().siblings('.count').text();
                $("#award .tel").text(tel);
                $("#award .name").text(name);
                $("#award .count").text(count);
                $("#award .award").attr('data-id',id);
                loader.getOrderListByExtendId(id,function (result) {
                   renders.award(result)
                });
            });
            //领取奖品
            $("body").on('click','#award .award',function () {
               var id = $(this).attr('data-id');
               loader.upateGift(id,function (result) {
                   if(result.statusCode == 0){
                       toastr.success("领奖成功");
                   }else{
                       toastr.warning("领奖失败");
                   }
               })
            });
            //删除订单
            $("body").on("click",".del",function () {
                var orderId = $(this).attr("data-id");
                $("#confirmModal .confirmDelete").attr("data-id",orderId)
            });
            $("body").on("click",".confirmDelete",function () {
                var id = $("#award .award").attr('data-id');
                var orderId = $("#confirmModal .confirmDelete").attr("data-id");
                loader.delOrder(orderId,function (result) {
                    if(result.statusCode == 0){
                        toastr.success("删除定单成功");
                        $("#confirmModal").modal("hide");
                        loader.getOrderListByExtendId(id,function (result) {
                            renders.award(result);
                        });
                    }else{
                        toastr.warning("删除订单失败");
                    }
                })
            });
            //点击导出excel
            $("body").on("click","#excel .excel",function () {
                method('tableExcel');
                $("#excel").modal("hide");
            });
            //可输入的input
            $('#selectInput1').on('focus',function () {
                $("#storeName1").css('display','block');
            });
            $('#selectInput1').on('blur',function () {
                setTimeout("$('#storeName1').css('display','none')",170)
            });
            $('#selectInput1').bind('input propertychange',function () {
                $("#storeName1 li").each(function () {
                    if($(this).text().indexOf($('#selectInput1').val())>=0){
                        $(this).css('display','block')
                    }else{
                        $(this).css('display','none')
                    }
                });
            });
            $('body').on('click',"#storeName1 li",function () {
                $("#selectInput1").attr('data-id','');
                var text = $(this).text();
                var id = $(this).attr('data-id');
                $("#selectInput1").val(text);
                $("#selectInput1").attr('data-id',id);
                $("#storeName1").css('display','none');
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
}