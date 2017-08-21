/**
 * Created by Zachary on 2017/3/20.
 */
var BrandMgmtList = function() {
    var module = this;
    //region 模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index,params) {
                var allParams = $.extend({}, globalData.queryData, { pageIndex: index, pageSize: globalData.page.pagesize });
                loader.loadData(allParams);
            },
            getparams:function(){
                return {
                  
                }
            },
            pagesize: 10,
            showpage: 5,
        },
        activityId:0,
        data:{},
        queryData:{
            activityId:0,
            shopName:'',
            brandName:'',
            state:'-1'
        }
    };
    //endregion
    //region ui绘制
    var renders = {
        builderRows:function(result){
            console.log(result);
            $.each(result.data,function(i,obj){
                 if(obj.Logo){
                    var LogoImgPath =  urlFunc.imgFormat(obj.Logo);
                    obj.FullLogo = LogoImgPath;
                 }

            });
            var html = template("brandTemp",result);
            $("#brandTable tbody").html(html);
        }
    };
    //endregion

    //region 操作处理
    var action = {
        addBrand:function(param){
            var that = this;
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/activity/addBrand"),
                data: param,
                dataType: "json",
                success: function(result) {
                    that.addBrandSuccess(result,that);
                },
                error: function(xhr, msg, ex) {
                    console.log(msg);
                }
            });
        },
        addBrandSuccess:function(result,action){
            if(result.errorMsg){
                 toastr.error(result.errorMsg);
                 return;
            };
           $("#addBrandModal").modal("hide");
           //重置添加品牌表单
           action.resetAddBrandForm();
           //重置搜索框内的数据
           $('#queryBrandsForm')[0].reset();
           $("#queryBrandsBtn").trigger("click");  

        },
        // 编辑
        edit:function (param){
            var that = this;
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/activity/updateBrand"),
                data: param,
                dataType: "json",
                success: function(result) {
                    that.editBrandSuccess(result);
                },
                error: function(xhr, msg, ex) {
                  console.log(msg);
                }
            });
        },
        editBrandSuccess:function(result){
            if(result.errorMsg){
                 toastr.error(result.errorMsg);
                 return;
            };
           $("#editBrandModal").modal("hide");
           $("#queryBrandsBtn").trigger("click");  
        },
        fillEditForm:function(targetTr,shopId){
            $('#editBrandModal .brand-logo-img').attr('src','../../img/default_brand.png');
            var activityShopMsg = {
                logoUrl:targetTr.data("logoUrl"),
                fullLogoUrl:targetTr.data("fullLogoUrl"),
                brandName:targetTr.data("brandName"),
                tel:targetTr.data("tel"),
                remark:targetTr.find(".remark").text()
            };
            if(activityShopMsg.fullLogoUrl){
                $("#editBrandModal .logo-url").val(activityShopMsg.logoUrl);
                $("#editBrandModal .brand-logo-img").attr("src",activityShopMsg.fullLogoUrl);
            }
            $("#editBrandModal #brandName").val(activityShopMsg.brandName);
            $("#editBrandModal #tel").val(activityShopMsg.tel);
            $("#editBrandModal #remark").val(activityShopMsg.remark);
            //只用shopId为0时才可以编辑手机号
            if(shopId != '0'){
                $("#editBrandModal #tel").attr('disabled','true');
            }else{
                $("#editBrandModal #tel").removeAttr('disabled');
            }
        },
        formatFormData:function(targetForm,extObj){
            if(!$(targetForm).validate().form()){
                    return false;
                }
            var newBrandData = $(targetForm).serializeObject();
            $.extend(newBrandData,extObj);
            return  newBrandData ; 
        },
        // 删除
        delete:function (param,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/activity/delBrand"),
                data: param,
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
        //重置增加品牌表单
        resetAddBrandForm:function(){
           $('#addBrandForm')[0].reset();
           $('#addBrandModal .brand-logo-img').attr('src','../../img/default_brand.png');
        }
    };
    //region 数据加载器
    var loader = {
        loadData:function(params){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/activity/getBrands"),
                data: params,
                dataType: "json",
                success: function(result) {
                    globalData.data = result;
                    renders.builderRows(result);
                }
            });
        },
        count:function(callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/activity/getBrandsCount"),
                data: globalData.queryData,
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
        loadActivity: function (id,callback) {
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/activity/getSimgle"),
                data: {activityId: id},
                dataType: "json",
                success: function (result) {
                    var html = template("activityInfoTmpl", result.data);
                    $("#activityInfo").html(html);
                    callback(result.data);
                }
            });
        },
    };
    //endregion
    //region 事件注册
    var events = {
        uiEvent: function() {
            //查询
            $("#queryBrandsBtn").on("click",function(){
                var userQueryData = $('#queryBrandsForm').serializeObject();
                $.extend(globalData.queryData,userQueryData);
                loader.count(function(result){
                    $("#brandTablePager").Pager("init", result.data, globalData.page);
                });
            });
            //增加
            $("#addBrand").on("click",function(){
               action.resetAddBrandForm();
               $("#saveAddBrand").off("click").on("click",function(){
                    var extObj = {
                        activityId:globalData.queryData.activityId,
                    };
                    var params = action.formatFormData("#addBrandForm",extObj);
                    action.addBrand(params);         
                });
            });
           //编辑
            $("#brandTable tbody").on("click",'[data-func="edit"]',function(){
                var targetTr = $(this).parents('tr');
                var shopId = targetTr.data('shopId');
                action.fillEditForm(targetTr,shopId);
               $("#saveEditBrand").off("click").on("click",function(){
                    var extObj = {
                        activityId:globalData.queryData.activityId,
                        id:targetTr.data('activeShopId')
                    };
                    var params = action.formatFormData("#editBrandForm",extObj);
                    action.edit(params);         
                });
            });
            //删除
            $("#brandTable tbody").on("click",'[data-func="delete"]',function(){
                 var activeShopIdObj = {
                    activeShopId:$(this).parents('tr').data('activeShopId')
                 };
                 $('[data-func="confirmDelete"]').off("click").on("click",function(){
                        action.delete(activeShopIdObj,function(result){
                            $("#confirmModal").modal("hide");
                            $("#queryBrandsBtn").trigger("click");  
                        });
                 });
              
            });
        }
    };
    //endregion

    //region 公开方法

    //初始化模块
    this.create =   function(options) {
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
        globalData.queryData.activityId = globalData.activityId;
        loader.loadActivity(globalData.activityId,function(){});
        $("#queryBrandsBtn").trigger("click");
    };
};
