/**
 * Created by Spring on 2017/3/17.
 */
//业务js参考模板
var ThirdPartyMgmt = function() {
    var module = this;

    //region 模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index,params) {
                var allParams = $.extend({}, params, { pageIndex: index, pageSize: globalData.page.pagesize });
                loader.loadData(allParams);
                console.log("回调");
            },
            getparams:function(){
                return {
                    companyName:$("#text").val()
                }
            },
            pagesize: 10,
            showpage: 6,
        },
        data:{},
        defaultImg:"../../img/default_brand.png",
    }
    //endregion

    //region ui绘制
    var renders = {
            builderRows:function(result){
                $.each(result.data,function(i,item){
                    item.formatLogo=urlFunc.imgFormat(item.logo);
                })
                var html= template("dataTmpl",result);
                $("#dataTable tbody").html(html);
            }
    }
    //endregion

    //region 操作处理
    var action = {

    }
    //endregion

    //region 数据加载器
    var loader = {
        loadData:function(params){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("organize/getCompany"),
                data: params,
                dataType: "json",
                success: function(result) {
                    globalData.data=result;
                    renders.builderRows(result);

                }
            });
        },
        count:function(callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("organize/getCompanyCount"),
                data: globalData.page.getparams(),
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
        save:function(obj,callback){
            $.ajaxAuthor({
                type: "post",
                url:obj.id==0?urlFunc.format("organize/addCompany"):urlFunc.format("organize/updateCompany"),
                data:obj,
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
        single:function(id,callback){
            $.ajaxAuthor({
                type: "post",
                url:urlFunc.format("organize/getCompanyById"),
                data:{id:id},
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
        del:function(id,callback){
            $.ajaxAuthor({
                type: "post",
                url:urlFunc.format("organize/delCompany"),
                data:{id:id},
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        }
    };
    //endregion

    //region 事件注册
    var events = {
        uiEvent: function() {
            $("#btnQuery").on("click",function(){
                loader.count(function(result){
                    $("span.pager").Pager("init", result.data, globalData.page);
                });
            });
            $("#addForm").validate({
                rules: {
                    logo: "required",
                    name:"required",
                    userName: "required",
                    password:"required",
                    otype:"1"
                },
                ignore: "",
                messages: {
                    logo: "logo必须上传",
                    name:"第三方名称必须填写",
                    userName: "登录账号必须填写",
                    password:"登录密码必须填写"
                },
                submitHandler:function(){
                    if($("#addForm").valid()){
                        var obj= $("#addForm").serializeObject();
                        loader.save(obj,function(result){
                            if(result.statusCode==0){
                                $("#addAccount").modal("hide");
                                $("#btnQuery").trigger("click");
                            }else{
                                toastr.error(result.errorMsg);
                            }

                        })
                    }
                    return false;
                }

            });
            $("#save").on("click",function(){
                $("#addForm").submit();
            });
            $("#add").on("click",function(){
                $("#uploadImg").attr("src",globalData.defaultImg);
                $("#addForm")[0].reset();
                $("#addAccount").modal();
            });
            $("#uploadImg").on("click",function(){
                $.imgUpload({
                    callbackEle:"[name='logo'],#uploadImg",
                    successCallback:function(path){
                       // alert("最终回调");
                    },cropper:true
                    ,cropperOpts: {
                        aspectRatio: 9 / 9//截图框的比例
                    }

                },cos)
            })
            $("#dataTable tbody").on("click",'[data-func="edit"]',function(){
                var $this=$(this);
                var $tr=$this.parents("tr");
                var id= $tr.attr("data-id");
                $("#addAccount").modal();
                loader.single(id,function(result){
                    var data= result.data;
                    $("#uploadImg").attr("src",urlFunc.imgFormat(data.Logo));
                    for(var item in data){
                        if(data.hasOwnProperty(item)){
                            var value =data[item];
                            $("#addForm").find("[name='"+item+"']").val(value);
                        }
                    }

                });
            });
            $("#dataTable tbody").on("click",'[data-func="del"]',function(){
                var $this=$(this);
                var $tr=$this.parents("tr");
                var id= $tr.attr("data-id");
                if(confirm("确认删除此条信息？")){
                    loader.del(id,function(data){
                        $("#btnQuery").trigger("click");
                    });
                }

            });
        }
    };
    //endregion

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

    //endregion
}

