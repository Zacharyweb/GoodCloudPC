var AddExample = function() {
    var module = this;
    //模块数据全局缓存数据
    //region 模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index) {
                var allParams = $.extend({},globalData.queryData,{ pageIndex: index, pageSize: globalData.page.pagesize });
                loader.loadData(allParams);
            },
            getparams:function(){
                return {

                }
            },
            pagesize: 5 ,
            pageIndex: 1,
        },
        data:{},
        queryData:{
            cateOrTagName: '',
            brandName: '',
            title:'',
        }
    };
    //endregion
    //ui绘制
    var renders = {
        builderRows:function(result){
            var html= template("container",result);
            $("#sample tbody").html(html);
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
    };
    //  数据加载器
    var loader = {
        loadData:function(allParams){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("video/getDemoVideos"),
                data:allParams,
                dataType: "json",
                success: function(result) {
                    console.log(result);
                    $.each(result.data,function(i,data){
                        data.tagNames = data.tagNames.replace(/,/g,'/');
                        data.coverImg = urlFunc.imgFormat(data.coverImg,80,80);
                        data.authorImg = urlFunc.imgFormat(data.authorImg,80,80);
                    });
                    renders.builderRows(result);
                    action.disabledUpDown();
                }
            });
        },
        //页码请求的接口？？？
        count:function(callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("video/countDemoVideos"),
                data:globalData.queryData,
                dataType: "json",
                success: function(result) {
                    callback(result)
                }
            });
        },
        //删除
        videoDel:function(id,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("video/del"),
                data:{
                    videoId:id,
                },
                dataType: "json",
                success: function(result) {
                    callback(result)
                }
            });
        },
        //上移下移
        switchSortValue:function(params,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("video/switchSortValue"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callback(result)
                }
            });
        },
    };

    //事件注册
    var events = {
        uiEvent: function() {
            //查询
            $("#btnQuery").on("click",function(){
                //分页器
                var userQueryData = $('#queryImgListForm').serializeObject();
                $.extend(globalData.queryData,userQueryData);
                loader.count(function(result){
                    $("span.pager").Pager("init", result.data, globalData.page);
                });
            });
            //点击删除
            $("body").on('click','.del',function () {
                var id = $(this).attr('data-id');
                $(".confirmDelete").attr('data-id',id)
            });
            $("body").on('click','.confirmDelete',function () {
                var id = $(this).attr('data-id');
                loader.videoDel(id,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('删除短视频成功');
                        $("#btnQuery").trigger("click");
                        $("#deleteStore").modal('hide');
                    }else{
                        toastr.warning('删除短视频失败');
                    }
                })
            });
            //图标的双击事件
            clickImg('img');
            //上移
            $('body').on('click','#sample .up',function () {
                var id1 = $(this).parent().parent().attr('data-id');
                var sortValue1 = $(this).parent().parent().attr('data-sortValue');
                var id2 = $(this).parent().parent().prev().attr('data-id');
                var sortValue2 = $(this).parent().parent().prev().attr('data-sortValue');
                var params = {
                    id1:id1,
                    sortValue1:sortValue1,
                    id2:id2,
                    sortValue2:sortValue2,
                };
                loader.switchSortValue(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('上移短视频成功');
                        $("#btnQuery").trigger("click");
                    }else{
                        toastr.warning('上移短视频失败');
                    }
                })
            });
            //下移
            $('body').on('click','#sample .down',function () {
                var id1 = $(this).parent().parent().attr('data-id');
                var sortValue1 = $(this).parent().parent().attr('data-sortValue');
                var id2 = $(this).parent().parent().next().attr('data-id');
                var sortValue2 = $(this).parent().parent().next().attr('data-sortValue');
                var params = {
                    id1:id1,
                    sortValue1:sortValue1,
                    id2:id2,
                    sortValue2:sortValue2,
                };
                console.log(params);
                loader.switchSortValue(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('下移短视频成功');
                        $("#btnQuery").trigger("click");
                    }else{
                        toastr.warning('下移短视频失败');
                    }
                })
            })
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