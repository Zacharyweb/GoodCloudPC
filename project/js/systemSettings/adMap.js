/**
 * Created by 111 on 2017/4/19.
 */
var AdMap = function() {
    var module = this;
    //模块数据全局缓存数据
    //region 模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index) {
                var allParams = $.extend({},globalData.queryData,{pageIndex: index, pageSize: globalData.page.pagesize});
                loader.loadData(allParams);
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
            text:'',
            tagType:3
        }
    };
    //endregion
    //ui绘制
    var renders = {
        builderRows:function(result){
            var html= template("storeManagement",result);
            $("#Header tbody").html(html);
        },
    };
    // 操作处理
    var action = {
        disabledUpDown:function(){
            $("#articleList tbody tr").each(function(i,item) {
                $(item).find('[data-func="up"],[data-func="down"]').removeClass("isDisabled");
            });
            $("#articleList tbody").find('tr:nth-child(1)').find('.up').addClass("isDisabled");
            $("#articleList tbody").find('tr:last-child').find('.down').addClass("isDisabled");
            $('a.isDisabled').removeAttr('onclick');
        },
    };
    //  数据加载器
    var loader = {
        loadData:function(allParams){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/pano/getTags"),
                data:allParams,
                dataType: "json",
                success: function(result) {
                    renders.builderRows(result);
                    action.disabledUpDown();
                }
            });
        },
        //页码
        count:function(callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/pano/getTagsCount"),
                data:{
                    text:'',
                    tagType:3
                },
                dataType: "json",
                success: function(result) {
                    callback(result)
                }
            });
        },
        //添加类别
        add:function(params,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/pano/createOrUpdateTags"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callback(result);
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //刪除
        del:function(id,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/pano/deleteTags"),
                data:{
                    id:id
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
        //上移下移
        upDown:function(params,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/pano/switchSortValue"),
                data:params,
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
            //添加
            $(".addBtn").on('click',function () {
                var i = $("#add").find('input').val('');
            });
            $("#save").on('click',function(){
                var text =  $("#add").find('input').val();
                var params ={
                    id:0,
                    text:text,
                    tagType:3
                };
                if(text == '' || text == '请填写添加的标签'){
                    $("#add").find('input').val("请填写添加的标签");
                    $("#add").find('input').css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else{
                    loader.add(params,function (result) {
                        if(result.statusCode == 0){
                            loader.count(function(result){
                                $("span.pager").Pager("init", result.data, globalData.page);
                            });
                            $("#add").modal('hide');
                            toastr.success('添加类别成功')
                        }else{
                            toastr.warning('添加类别失败')
                        }
                    });
                }
            });
            //编辑
            $("body").on('click','.edit',function(){
                var id =  $(this).parent().parent().attr('data-id');
                var text = $(this).parent().siblings('.name').text();
                $("#keep2").attr('data-id',id);
                $("#edit").find('input').val(text)
            });
            $("#keep2").on('click',function(){
                var id = $("#keep2").attr('data-id');
                var text =  $("#edit").find('input').val();
                console.log(id);
                var params ={
                    id:id,
                    text:text,
                    tagType:3
                };
                loader.add(params,function (result) {
                    if(result.statusCode == 0){
                        loader.count(function(result){
                            $("span.pager").Pager("init", result.data, globalData.page);
                        });
                        $("#edit").modal('hide');
                        toastr.success('编辑类别成功')
                    }else{
                        toastr.warning('编辑类别失败')
                    }
                });
            });
            //刪除
            $("body").on('click','.del',function(){
                var id =  $(this).parent().parent().attr('data-id');
                $("#confirmModal1 .confirmDelete").attr('data-id',id)
            });
            $("body").on('click','#confirmModal1 .confirmDelete',function(){
                var id =  $("#confirmModal1 .confirmDelete").attr('data-id');
                loader.del(id,function (result) {
                    if(result.errorMsg == ''){
                        loader.count(function(result){
                            $("span.pager").Pager("init", result.data, globalData.page);
                        });
                        $("#confirmModal1").modal('hide');
                        toastr.success('刪除类别成功')
                    }else{
                        toastr.warning('刪除类别失败')
                    }
                });
            });
            //上移
            $("body").on('click','.up',function(){
                var id1 =  $(this).parent().parent().attr('data-id');
                var sortValue1 =  $(this).parent().parent().attr('data-sortValue');
                var id2 =  $(this).parent().parent().prev().attr('data-id');
                var sortValue2 =  $(this).parent().parent().prev().attr('data-id');
                var params = {
                    id1:id1,
                    sortValue1:sortValue1,
                    id2:id2,
                    sortValue2:sortValue2,
                };
                loader.upDown(params,function (result) {
                    if(result.errorMsg == ''){
                        loader.count(function(result){
                            $("span.pager").Pager("init", result.data, globalData.page);
                        });
                        toastr.success('上移类别成功')
                    }else{
                        toastr.warning('上移类别失败')
                    }
                })
            });
            //下移
            $("body").on('click','.down',function(){
                var id1 =  $(this).parent().parent().attr('data-id');
                var sortValue1 =  $(this).parent().parent().attr('data-sortValue');
                var id2 =  $(this).parent().parent().next().attr('data-id');
                var sortValue2 =  $(this).parent().parent().next().attr('data-sortValue');
                var params = {
                    id1:id1,
                    sortValue1:sortValue1,
                    id2:id2,
                    sortValue2:sortValue2,
                };
                loader.upDown(params,function (result) {
                    if(result.errorMsg == ''){
                        loader.count(function(result){
                            $("span.pager").Pager("init", result.data, globalData.page);
                        });
                        toastr.success('下移类别成功')
                    }else{
                        toastr.warning('下移类别失败')
                    }
                })
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
        loader.count(function(result){
            $("span.pager").Pager("init", result.data, globalData.page);
        });
    };
}