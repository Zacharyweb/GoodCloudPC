/**
 * Created by Spring on 2017/3/17.
 */
//业务js参考模板
var ParameterSetting = function() {
    var module = this;

    //region 模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index) {
                var allParams = $.extend({}, globalData.queryData, { pageIndex: index, pageSize: globalData.page.pagesize });
                loader.loadData(allParams);
                console.log(allParams);
            },
            getparams:function(){
                return {
                    text:$("#text").val()
                }
            },
            pagesize: 10,
            showpage: 6,
        },
        data:{},
        queryData:{
            group:'',
            remark:'',
            key:''
        }
    }
    //endregion

    //region ui绘制
    var renders = {
        builderRows:function(result){
            var html= template("container",result);
            $("#articleList tbody").html(html);
        }
    }
    //endregion

    //region 操作处理
    var action = {

    };
    //endregion

    //region 数据加载器
    var loader = {
        loadData:function(allParams){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/config/getConstConfig"),
                data: allParams,
                dataType: "json",
                success: function(result) {
                    console.log(result);
                    renders.builderRows(result);
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        count:function(callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/config/count"),
                data:{},
                dataType: "json",
                success: function(result) {
                    callback(result);
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        del:function(id,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/config/count"),
                data: {id:id},
                dataType: "json",
                success: function(result) {
                    callback(result);
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        single:function(id,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/config/single"),
                data: {id:id},
                dataType: "json",
                success: function(result) {
                    callback(result);
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //编辑保存
        save:function(params,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/config/create"),
                data: params,
                dataType: "json",
                success: function(result) {
                    callback(result);
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },

    };
    //endregion

    //region 事件注册
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
            $("#btnQuery").on("click",function(){
                var userQueryData = $('#queryImgListForm').serializeObject();
                $.extend(globalData.queryData,userQueryData);
                loader.count(function(result){
                    $("span.pager").Pager("init", result.data, globalData.page);
                });
            });
            //编辑
            $("body").on("click",'.edit',function(){
                var id = $(this).parent().parent().attr('data-id');
                $('#edit #keep2').attr('data-id',id);
                loader.single(id,function (result) {
                    console.log(result)
                    $("#edit input[name='value']").val(result.data.cValue);
                    $("#edit input[name='groupName']").val(result.data.groupName);
                    $("#edit textarea[name='remark']").val(result.data.remark);
                    $("#edit p.info span").text(result.data.cKey);
                })
            });
            $("body").on("click",'#keep2',function(){
                var id=  $('#edit #keep2').attr('data-id');
                var value= $("#edit input[name='value']").val();
                var remark= $("#edit input[name='remark']").val();
                var key = $("#edit p.info span").text();
                var group = $("#edit input[name='groupName']").val();
                var params = {
                    id:id,
                    value:value,
                    remark:remark,
                    key:key,
                    group:group,
                    displayName:''
                };
                if(value == '' || value == '请填写品类名称'){
                    $("#edit input[name='value']").val('请填写品类名称');
                    $("#edit input[name='value']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else if(group == '' || group == '请填写分组'){
                    $("#edit input[name='groupName']").val('请填写分组');
                    $("#edit input[name='groupName']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else{
                    loader.save(params,function(result){
                        if (result.statusCode == 0) {
                            toastr.success('编辑参数成功');
                            $("#edit").modal("hide");
                            $("#btnQuery").trigger("click");
                        } else {
                            toastr.warning('编辑参数失败');
                        }
                    });
                }
            });
            //删除
            $("body").on("click",'.del',function(){
                var id = $(this).parent().parent().attr('data-id');
                $('#deleteStore .confirmDelete').attr('data-id',id);
            });
            $("body").on("click",'#deleteStore .confirmDelete',function(){
                var id= $("#deleteStore .confirmDelete").attr("data-id");
                loader.del(id,function(result){
                    if (result.statusCode == 0) {
                        toastr.success('删除成功');
                        $("#confirmModal").modal("hide");
                        $("#btnQuery").trigger("click");
                    } else {
                        toastr.warning('删除失败');
                    }
                })
            });
        }
    };

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

};

