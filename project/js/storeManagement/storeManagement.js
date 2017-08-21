/**
 * Created by 111 on 2017/4/19.
 */
var StoreManagement = function() {
    var module = this;
    //模块数据全局缓存数据
    //region 模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index) {
                var allParams = $.extend({},globalData.queryData,{ pageindex: index, pagesize: globalData.page.pagesize });
                console.log('參數',allParams)
                loader.loadData(allParams);
            },
            getparams:function(){
                return {
                    text:$("#searchIpt").val()
                }
            },
            pagesize: 5,
            pageindex: 6,
        },
        data:{},
        queryData:{
            shopName:'',
            contacts:'',
            status:-1,
        }
    };
    //endregion
    //ui绘制
    var renders = {
        builderRows:function(result){
            var html= template("storeManagement",result);
            $("#tableExcel tbody").html(html);
        },
        //修改店鋪
        addStore:function(result){
            var html= template("modifyInfo",result);
            $("#addStoreInfo").html(html);
        },
        //添加
        Store:function(result){
            var html= template("modifyInfo",result);
            $("#StoreInfo").html(html);
        },
        //退还保证金
        returnAward:function (result) {
            console.log('baozhengjin',result)
            var html= template("returnContent",result);
            $("#returnAnd").html(html);
        },
        //确定退还保证金
        confirmReturn:function (result) {
            var html= template("confirmReturn",result);
            $("#returnAnd1").html(html);
        },
    };
    // 操作处理
    var action = {
        // 店铺管理数据加载

    };
    //  数据加载器
    var loader = {
        loadData:function(allParams){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("organize/getOrganizeShopList"),
                data:allParams,
                dataType: "json",
                success: function(result) {
                    $.each(result.data,function (i, item) {
                        if(item.Logo == '' || item.Logo == null){
                            item.Logo = 'http://image.yetong.org//web/1496997540324.jpg?';
                        }else if(item.Logo == null){
                            item.Logo = 'http://image.yetong.org//web/1496997540324.jpg?';
                        }
                        item.Logo = urlFunc.imgFormat(item.Logo,100,100);
                    });
                    renders.builderRows(result);
                }
            });
        },
        //页码请求的接口
        count:function(callback){
            console.log('zhixing')
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("organize/getOrganizeShopListCount"),
                data:globalData.queryData,
                dataType: "json",
                success: function(result) {
                    callback(result)
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
        //点击编辑，获取店铺详情，以及吧保证金情况
        editShop:function(ShopId){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("organize/getOrganizeShopDetail"),
                data:{
                    ogeanizeShopId:ShopId
                },
                dataType: "json",
                success: function(result) {
                   renders.addStore(result);
                   renders.returnAward(result);
                   renders.confirmReturn(result);
                }
            });
        },
        //点击删除
        delShop:function(ShopId){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("organize/deleteOrgainzeShop"),//删除的请求地址
                data:{
                    organizeShopId:ShopId
                },
                dataType: "json",
                success: function(result) {
                    if(result.data == 200){
                        toastr.success("删除成功");
                        loader.loadData();
                    }else{
                        toastr.warning('删除失败')
                    }
                }
            });
        },
        //退还保证金
        returnShop:function(ShopId){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("organize/backBondCash"),//退还的的请求地址
                data:{
                    shopId:ShopId
                },
                dataType: "json",
                success: function(result) {

                    loader.loadData();
                }
            });
        },
        //点击保存店铺详情
        saveShop:function(pramas,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("organize/addOrganizeShop"),
                data:pramas,
                dataType: "json",
                success: function(result) {
                    callback(result)
                    $("#keep").prop('disabled',false);
                    loader.loadData();
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
            //查询
            $("#btnQuery").on("click",function(){
                var userQueryData = $('#queryImgListForm').serializeObject();
                $.extend(globalData.queryData,userQueryData);
                loader.count(function(result){
                    $("span.pager").Pager("init", result.data, globalData.page);
                });
            });
            $("#StoreInfo").validate({
                rules: {
                    brandName: "required",
                    tel: "required",
                    name:"required"
                },
                ignore: "",
                messages: {
                    brandName: "店铺名必须填写",
                    tel: "手机号必须填写",
                    name:"联系人必须填写"
                },
                submitHandler:function () {
                    debugger
                    if(/^(((1[35789][0-9]{1})|(15[0-9]{1}))+\d{8})$/.test($("#phoneNumber").val())){
                        $('#colorRed').css('display','none');
                    }else{
                        $('#colorRed').css('display','inline');
                        return
                    }
                    if ($("#StoreInfo").valid()) {
                        var shopName = $(".className").val();
                        var contacts = $(".contacts").val();
                        var remark = $(".remark").val();
                        var tel = $("#phoneNumber").val();
                        var pramas = {
                            shopName:shopName,
                            contacts:contacts,
                            remark:remark,
                            tel:tel,
                            shopId:0
                        };
                        loader.saveShop(pramas,function (result) {
                            if (result.statusCode == 0) {
                                toastr.success('添加店铺成功');
                                $("#Store").modal("hide");
                                $("#btnQuery").trigger("click");
                            } else {
                                toastr.error(result.errorMsg);
                            }
                        });
                    }
                    return false;
                }
            });

            $("body").on("click","#addShop",function () {
                $('#Store input').removeClass('error');
                $('#Store label').remove();
                $(".className").val('');
                $(".tel").val('');
                $(".name").val('');
                $(".remark").val('');
            });
            $("body").on("click","#keep",function () {
                $("#StoreInfo").submit();
            });
            //点击编辑商铺
            $("body").on("click",".addStore",function () {
                $('#modifyInfo input').removeClass('error');
                $('#modifyInfo label').remove();
                var ShopId = $(this).parent().parent("tr.thisId").attr("data-id");
                $("#save2").attr("data-id",ShopId)
                loader.editShop(ShopId);
            });
            //点击保存修改
            $("#addStoreInfo").validate({
                rules: {
                    brandName: "required",
                    tel: "required",
                    name:"required"
                },
                ignore: "",
                messages: {
                    brandName: "店铺名必须填写",
                    tel: "手机号必须填写",
                    name:"联系人必须填写"
                },
                submitHandler: function () {
                    if(/^(((1[35789][0-9]{1})|(15[0-9]{1}))+\d{8})$/.test($("#number").val())){
                        $('#colorRed1').css('display','none');
                    }else{
                        $('#colorRed1').css('display','inline');
                        return
                    }
                    if ($("#addStoreInfo").valid()) {
                        var shopName = $("#className").val();
                        var contacts = $("#contacts").val();
                        var remark = $("#remark").val();
                        var tel = $("#number").val();
                        var ShopId = $("#save2").attr("data-id");
                        var pramas = {
                            shopName:shopName,
                            contacts:contacts,
                            remark:remark,
                            tel:tel,
                            shopId:ShopId
                        };
                        loader.saveShop(pramas,function (result) {
                            if (result.statusCode == 0) {
                                toastr.success('修改店铺成功');
                                $("#addStore").modal("hide");
                                $("#btnQuery").trigger("click");
                            } else {
                                toastr.error(result.errorMsg);
                            }
                        });
                    }
                    return false;
                }
            });
            $("body").on("click","#save2",function () {
                $("#addStoreInfo").submit();
            });
            //退还保证金
            $("body").on("click",".returnAward",function () {
                var ShopId = $(this).parent().parent("tr.thisId").attr("data-id");
                loader.editShop(ShopId);
                //点击保存修改
                $("body").on("click","#save1",function () {
                     loader.returnShop(ShopId);
                    $("#return").modal("hide");
                    loader.editShop(ShopId);
                });
            });
            //关闭
            $("body").on("click","#close",function () {
                $("#return1").modal("hide");
            });
            //删除
            $("body").on("click",".del",function () {
                var ShopId = $(this).parent().parent("tr.thisId").attr("data-id");
                $("body").on("click",".confirmDelete",function () {
                    loader.delShop(ShopId);
                    $("#confirmModal").modal("hide");
                });
                $("body").on("click",".deleteCancel",function () {
                    $("#confirmModal").modal("hide");
                });
            });
            //点击导出excel
            $("body").on("click","#excel .excel",function () {
                method('tableExcel');
                $("#excel").modal("hide");
            });
            //图标的双击事件
            clickImg('img');
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