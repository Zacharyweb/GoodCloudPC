/**
 * Created by Spring on 2017/3/17.
 */
//业务js参考模板
var CategoryList = function() {
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
                    text:$("#text").val()
                }
            },
            pagesize: 10,
            showpage: 6,
        },
        data:{},
    }
    //endregion

    //region ui绘制
    var renders = {
            builderRows:function(result){
                var html= template("categoryTmpl",result);
                $("#categoryTable tbody").html(html);
                action.disabledUpDown();
            }
    }
    //endregion

    //region 操作处理
    var action = {
        switchSort:function($tr1,$tr2){
            var id1= $tr1.attr("data-id");
            var sort1= $tr1.attr("data-sort");
            var id2= $tr2.attr("data-id");
            var sort2= $tr2.attr("data-sort");
            loader.switchSortValue(id1,sort1,id2,sort2,function (result) {
                if(result.statusCode == 0){
                    toastr.success('移动成功');
                    action.disabledUpDown();
                    loader.count(function(result){
                        $("span.pager").Pager("init", result.data, globalData.page);
                    });
                }else{
                    toastr.warning('移动失败');
                }
            });
        },
        disabledUpDown:function(){
            var $tbody=$("#categoryTable tbody");
            $tbody.find("tr").each(function(i,item){
                $(item).find('[data-func="up"],[data-func="down"]').removeClass("disabled");
            });
            $tbody.find("tr:first-child [data-func='up']").addClass("disabled");
            $tbody.find("tr:last-child [data-func='down']").addClass("disabled");
        }
    };
    //endregion

    //region 数据加载器
    var loader = {
        loadData:function(params){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/operate/getCategories"),
                data: params,
                dataType: "json",
                success: function(result) {
                    globalData.data=result;
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
                url: urlFunc.format("api/operate/getCategoryCount"),
                data: globalData.page.getparams(),
                dataType: "json",
                success: function(result) {
                    callback(result);
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        switchSortValue:function(id1, sortValue1, id2, sortValue2,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/operate/switchSortValue"),
                data: {
                    id1:id1, sortValue1:sortValue1,
                    id2:id2, sortValue2:sortValue2
                },
                dataType: "json",
                success: function(result) {
                    callback(result);
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        save:function(id,name,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/operate/createOrUpdateCategory"),
                data: {id:id,text:name},
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
                url: urlFunc.format("api/operate/deleteCategory"),
                data: {id:id},
                dataType: "json",
                success: function(result) {
                    callback(result);
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        }
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
                loader.count(function(result){
                    $("span.pager").Pager("init", result.data, globalData.page);
                });
            });
            $("#saveCategory").on("click",function(){
                var id= $("#categoryId").val();
                var name= $("#categoryName").val();
                if(name == '' || name == '请填写品类名称'){
                    $("#categoryName").val('请填写品类名称');
                    $("#categoryName").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else{
                    loader.save(id,name,function(result){
                        if (result.statusCode == 0) {
                            toastr.success('添加、编辑品类成功');
                            $("#addCategoryWin").modal("hide");
                            $("#btnQuery").trigger("click");
                        } else {
                            toastr.error(result.errorMsg);
                        }
                    });
                }
            });
            $("#addCategory").on("click",function(){
                $("#categoryId").val(0);
                $("#categoryName").val("");
                $("#categoryName").css({
                    borderColor:'#c2cad8',
                    color:"color:rgb(85, 85, 85)"
                });
                $("#addCategoryWin").modal();
            });
            $("#categoryTable tbody").on("click",'[data-func="edit"]',function(){
                var $this=$(this);
                var $tr=$this.parents("tr");
                var id= $tr.attr("data-id");
                var val= $tr.attr("data-val");
                $("#addCategoryWin h4").html("编辑品类")
                $("#categoryId").val(id);
                $("#categoryName").val(val);
                $("#addCategoryWin").modal();
            });
            $("#categoryTable tbody").on("click",'[data-func="del"]',function(){
                var $this=$(this);
                var $tr=$this.parents("tr");
                var id= $tr.attr("data-id");
                $(".confirmDelete").attr("data-id",id)
            });
            $("body").on("click",'.confirmDelete',function(){
                var id= $(".confirmDelete").attr("data-id");
                loader.del(id,function(result){
                    console.log(result);
                    if (result.statusCode == 0) {
                        toastr.success('删除成功');
                        $("#confirmModal").modal("hide");
                        $("#btnQuery").trigger("click");
                    } else {
                        toastr.warning('删除失败');
                    }
                })
            });
            //下移
            $("#categoryTable tbody").on("click",'[data-func="down"]:not(.disabled)',function(){
                var $this=$(this);
                var $tr=$this.parents("tr");
                var $nextTr=$tr.next();
                if($nextTr.length>0){
                    $($nextTr[0]).insertBefore($tr);
                    action.disabledUpDown();
                    action.switchSort($tr,$nextTr);
                }
            });
            //上移
            $("#categoryTable tbody").on("click",'[data-func="up"]:not(.disabled)',function(){
                var $this=$(this);
                var $tr=$this.parents("tr");
                var $prevTr=$tr.prev();
                if($prevTr.length>0){
                    $($prevTr[0]).insertAfter($tr);
                    action.disabledUpDown();
                    action.switchSort($tr,$prevTr);
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

};

