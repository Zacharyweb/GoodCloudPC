/**
 * Created by 111 on 2017/4/19.
 */
var ShortVideo = function() {
    var module = this;
    //模块数据全局缓存数据
    //region 模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index,params) {
                var allParams = $.extend({},globalData.queryData,{ pagesize: index-1, pageindex: globalData.page.pagesize });
                loader.loadData(globalData.queryData);
            },
            getparams:function(){
                return {
                    text:$("#searchIpt").val()
                }
            },
            pagesize: 10,
            pageindex: 6,
        },
        data:{},
        queryData:{
            pagesize: '50',
            pageindex: '1',
            shopName:'',
            contacts:'',
            status:-1,
        }
    };
    //endregion
    //ui绘制
    var renders = {
        builderRows:function(result){
            console.log('1111111',result);
            var html= template("storeManagement",result);
            $("#tableExcel tbody").html(html);
        },
    };
    // 操作处理
    var action = {
        // 店铺管理数据加载

    };
    //  数据加载器
    var loader = {
        loadData:function(params){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("organize/getOrganizeShopList"),
                data:globalData.queryData,
                dataType: "json",
                success: function(result) {
                    console.log("结果",result.data[0]);
                    renders.builderRows(result);
                }
            });
        },
        //页码请求的接口？？？
        count:function(parmas){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("organize/getOrganizeShopListCount"),
                data:parmas,
                dataType: "json",
                success: function(result) {

                }
            });
        },
        //添加店铺
        addShop:function(params){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("organize/addOrganizeShop"),
                data:params,
                dataType: "json",
                success: function(result) {

                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
    };

    //事件注册
    var events = {
        uiEvent: function() {
            //input初始化
            $('input').on('focus',function () {
                $(this).val('')
                $(this).css({
                    color:'#555',
                    borderColor:'#c2cad8'
                })
            });
            //查询
            $("#btnQuery").on("click",function(){
                //分页器
                var userQueryData = $('#queryImgListForm').serializeObject();
                $.extend(globalData.queryData,userQueryData);
                /* loader.count(function(result){
                 $("span.pager").Pager("init", result.data.number, globalData.page);
                 });*/
                loader.loadData();
            });
            //点击保存添加菜单
            /* $("#addMenu").validate({
             rules: {
             brandName: "required",
             tel: "required",
             name:"required"
             },
             ignore: "",
             messages: {
             brandName: "菜单名称名必须填写",
             tel: "菜单地址必须填写",
             name:"默认图标必须上传",
             name:"选中态图标必须上传"
             },
             submitHandler: function () {
             if ($("#addMenu").valid()) {

             }
             return false;
             }
             });*/
            //点击保存编辑菜单
            /* $("#editMenu").validate({
             rules: {
             brandName: "required",
             tel: "required",
             name:"required"
             },
             ignore: "",
             messages: {
             brandName: "菜单名称名必须填写",
             tel: "菜单地址必须填写",
             name:"默认图标必须上传",
             name:"选中态图标必须上传"
             },
             submitHandler: function () {
             if ($("#addMenu").valid()) {

             }
             return false;
             }
             });*/

            //table切换样式切换
            $(".switch span").each(function () {
                $(this).on('click',function () {
                    $(this).addClass('afterHover');
                    $(this).removeClass('hover');
                    $(this).siblings().addClass('hover');
                    $(this).siblings().removeClass('afterHover');
                })
            });
            //起始页保存
            $('#save1').on('click',function () {
                var val = $(this).siblings('input').val();
                if(val == ''){
                    $(this).siblings('input').val('请填写起始页地址');
                    $(this).siblings('input').css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else{

                }
            });
            //成功页保存
            $('#save2').on('click',function () {
                var val = $(this).siblings('input').val();
                if(val == ''){
                    $(this).siblings('input').val('请填写成功页地址');
                    $(this).siblings('input').css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else{

                }
            });
        }
    };


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