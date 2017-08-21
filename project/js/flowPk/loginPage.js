/**
 * Created by 111 on 2017/4/19.
 */
var LoginPage = function() {
    var module = this;
    //模块数据全局缓存数据
    //region 模块数据全局缓存数据
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
        loadData:function(callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("loginAd/getList"),
                data:{
                    pageIndex:0,
                    pageSize:10
                },
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
        //添加广告位
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
                url: urlFunc.format("loginAd/del"),
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
                url: urlFunc.format("loginAd/switchSort"),
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
            //刪除
            $("body").on('click','.del',function(){
                var id =  $(this).parent().parent().attr('data-id');
                $("#confirmModal1 .confirmDelete").attr('data-id',id)
            });
            $("body").on('click','#confirmModal1 .confirmDelete',function(){
                var id =  $("#confirmModal1 .confirmDelete").attr('data-id');
                loader.del(id,function (result) {
                    if(result.statusCode == 0){
                        loader.loadData(function (result) {
                            $.each(result.data,function (i,item) {
                                item.AdImg = urlFunc.imgFormat(item.AdImg,150,200);
                            });
                            renders.builderRows(result);
                            action.disabledUpDown();
                        });
                        $("#confirmModal1").modal('hide');
                        toastr.success('刪除广告位成功')
                    }else{
                        toastr.warning('刪除广告位失败')
                    }
                });
            });
            //上移
            $("body").on('click','.up',function(){
                var id1 =  $(this).parent().parent().attr('data-id');
                var sortValue1 =  $(this).parent().parent().attr('data-sort');
                var id2 =  $(this).parent().parent().prev().attr('data-id');
                var sortValue2 =  $(this).parent().parent().prev().attr('data-sort');
                var params = {
                    id1:id1,
                    sortValue1:sortValue1,
                    id2:id2,
                    sortValue2:sortValue2,
                };
                loader.upDown(params,function (result) {
                    if(result.statusCode == 0){
                        loader.loadData(function (result) {
                            $.each(result.data,function (i,item) {
                                item.AdImg = urlFunc.imgFormat(item.AdImg,150,200);
                            });
                            renders.builderRows(result);
                            action.disabledUpDown();
                        });
                        toastr.success('上移广告位成功')
                    }else{
                        toastr.warning('上移广告位失败')
                    }
                })
            });
            //下移
            $("body").on('click','.down',function(){
                var id1 =  $(this).parent().parent().attr('data-id');
                var sortValue1 =  $(this).parent().parent().attr('data-sort');
                var id2 =  $(this).parent().parent().next().attr('data-id');
                var sortValue2 =  $(this).parent().parent().next().attr('data-sort');
                var params = {
                    id1:id1,
                    sortValue1:sortValue1,
                    id2:id2,
                    sortValue2:sortValue2,
                };
                loader.upDown(params,function (result) {
                    if(result.statusCode == 0){
                        loader.loadData(function (result) {
                            $.each(result.data,function (i,item) {
                                item.AdImg = urlFunc.imgFormat(item.AdImg,150,200);
                            });
                            renders.builderRows(result);
                            action.disabledUpDown();
                        });
                        toastr.success('下移广告位成功')
                    }else{
                        toastr.warning('下移广告位失败')
                    }
                })
            });
            //图标的双击事件
            clickImg('img');
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

        loader.loadData(function (result) {
            $.each(result.data,function (i,item) {
                item.AdImg = urlFunc.imgFormat(item.AdImg,300,400);
            });
            renders.builderRows(result);
            action.disabledUpDown();
        });
    };
}