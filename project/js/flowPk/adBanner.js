/**
 * Created by 111 on 2017/4/19.
 */

var AdBanner = function() {
    var module = this;
    var renders = {
        builderRows:function(result){
            var html= template("storeManagement",result);
            $("#Header tbody").html(html);
        },
    };
    // 操作处理
    var action = {
        disabledUpDown:function(){
            $("#sample tbody tr").each(function(i,item) {
                $(item).find('[data-func="up"],[data-func="down"]').removeClass("isDisabled");
            });
            $("#sample tbody").find('tr:nth-child(1)').find('.up').addClass("isDisabled");
            $("#sample tbody").find('tr:last-child').find('.down').addClass("isDisabled");
        },
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
        loadData:function(callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("organizeAd/getList"),
                data:{
                    orgName:'',
                    remark:'',
                    pageIndex:0,
                    pageSize:10
                },
                dataType: "json",
                success: function(result) {
                    callback(result);
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
                url: urlFunc.format("organizeAd/del"),
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
                url: urlFunc.format("organizeAd/switchSort"),
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
                                item.BannerImg = urlFunc.imgFormat(item.BannerImg,200,100);
                                item.CreateTime = action.timeAccept(item.CreateTime);
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
                var sortValue1 =  $(this).parent().parent().attr('data-SortValue');
                var id2 =  $(this).parent().parent().prev().attr('data-id');
                var sortValue2 =  $(this).parent().parent().prev().attr('data-SortValue');
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
                                item.BannerImg = urlFunc.imgFormat(item.BannerImg,200,100);
                                item.CreateTime = action.timeAccept(item.CreateTime);
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
                var sortValue1 =  $(this).parent().parent().attr('data-SortValue');
                var id2 =  $(this).parent().parent().next().attr('data-id');
                var sortValue2 =  $(this).parent().parent().next().attr('data-SortValue');
                var params = {
                    id1:id1,
                    sortValue1:sortValue1,
                    id2:id2,
                    sortValue2:sortValue2,
                };
                console.log(params);
                loader.upDown(params,function (result) {
                    if(result.statusCode == 0){
                        loader.loadData(function (result) {
                            $.each(result.data,function (i,item) {
                                item.BannerImg = urlFunc.imgFormat(item.BannerImg,200,100);
                                item.CreateTime = action.timeAccept(item.CreateTime);
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
                item.BannerImg = urlFunc.imgFormat(item.BannerImg,200,100);
                item.CreateTime = action.timeAccept(item.CreateTime);
            });
            renders.builderRows(result);
            action.disabledUpDown();
        });
    };
}