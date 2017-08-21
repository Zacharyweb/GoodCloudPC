/**
 * Created by Zachary on 2017/4/6.
 */
var ImgsClass = function() {
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
           categoryType:null,
        }
    };
    //endregion
    //region ui绘制
    var renders = {
        builderRows:function(result){
            var html = template("classListTmpl",result);
            $("#classListTable tbody").html(html);
            action.disabledUpDown();

            $('.loadingFather').css('display','none')
        }
    };
    //endregion
    //region 操作处理
    var action = {
        addOReditSuccess:function(result){
            if(result.statusCode == 0){
                toastr.success('添加、编辑成功');
                $(".modal").modal("hide");
                loader.count();
            }else{
                toastr.warning('添加、编辑失败');
            }
        },
        switchSort:function($tr1,$tr2,callback){
            clickUpDown();
            var id1= $tr1.data('id');
            var sort1= $tr1.data('sort');
            var id2= $tr2.data('id');
            var sort2= $tr2.data('sort');
            console.log(id1,sort1,id2,sort2);
            loader.switchSortValue(id1,sort1,id2,sort2,function (result) {
                if(result.statusCode == 0){
                    toastr.success('移动成功');
                    loader.count()
                }else{
                    toastr.warning('移动失败');
                }
            });
        },
        disabledUpDown:function(){
            var $tbody=$("#classListTable tbody");
            $tbody.find("tr").each(function(i,item){
                $(item).find('[data-func="up"],[data-func="down"]').removeClass("disabled");
            });
            $tbody.find("tr:first-child [data-func='up']").addClass("disabled");
            $tbody.find("tr:last-child [data-func='down']").addClass("disabled");
        }  
    };
    //region 数据加载器
    var loader = {
        loadData:function(params){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/tuku/getCategories"),
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
                url: urlFunc.format("api/tuku/getCategoryCount"),
                data: globalData.queryData,
                dataType: "json",
                success: function(result) {
                    $("#imgsClassPager").Pager("init", result.data, globalData.page);
                }
            });
        },
        switchSortValue:function(id1, sortValue1, id2, sortValue2,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/tuku/switchSortValue"),
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
        addORedit:function (param){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/tuku/createOrUpdateCategory"),
                data: param,
                dataType: "json",
                success: function(result) {
                    action.addOReditSuccess(result);
                },
                error: function(xhr, msg, ex) {
                  console.log(msg);
                }
            });
        },
        delete:function (param,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/tuku/deleteCategory"),
                data: param,
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
    };
    //endregion
    //region 事件注册
    var events = {
        uiEvent: function() {
            //增加
            $("#addClass").on("click",function(){
               $("#addModal [data-id='className']").val('');
               $("#saveAdd").off("click").on("click",function(){
                    var newName = $("#addModal [data-id='className']").val();
                    var params = {
                        id: 0,
                        text: newName,
                        categoryType:globalData.queryData.categoryType
                    };
                    loader.addORedit(params);       
                });
            });
           //编辑
            $("#classListTable tbody").on("click",'[data-func="edit"]',function(){
                var targetTr = $(this).parents('tr');
                var itemId = targetTr.data('id');
                var name = targetTr.data('val');
                $("#editModal [data-id='className']").val(name);
                $("#saveEdit").off("click").on("click",function(){
                    var newName = $("#editModal [data-id='className']").val();
                    var params = {
                        id: itemId,
                        text: newName,
                        categoryType:globalData.queryData.categoryType
                    };
                    loader.addORedit(params);      
                });
            });
            //删除
            $("#classListTable tbody").on("click",'[data-func="del"]',function(){
                 var classIdObj = {
                    id:$(this).parents('tr').data('id')
                 };
                 $('[data-func="confirmDelete"]').off("click").on("click",function(){
                        loader.delete(classIdObj,function(result){
                            if(result.statusCode == 0){
                                toastr.success('删除成功');
                                $("#confirmModal").modal("hide");
                                loader.count();
                            }else{
                                toastr.warning('删除失败');
                            }
                        });
                 });
              
            });
           // 下移
            $("#classListTable tbody").on("click",'[data-func="down"]:not(.disabled)',function(){
                var $this = $(this);
                var $tr = $this.parents("tr");
                var $nextTr= $tr.next();
                if($nextTr.length>0){
                    $($nextTr[0]).insertBefore($tr);
                    action.switchSort($tr,$nextTr,function(){

                    });
                }
            });
            // 上移
            $("#classListTable tbody").on("click",'[data-func="up"]:not(.disabled)',function(){
                var $this = $(this);
                var $tr = $this.parents("tr");
                var $prevTr = $tr.prev();
                if($prevTr.length > 0){
                    $($prevTr[0]).insertAfter($tr);
                    action.switchSort($tr,$prevTr,function(){

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
        };
        //初始化事件
        for(var item in events) {
            if(events.hasOwnProperty(item)) {
                events[item]();
            }
        };
        globalData.queryData.categoryType = globalData.categoryType;
        loader.count();
    };
}
