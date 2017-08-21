
$(".brand-logo-img").click(function(){
    $.imgUpload({
        callbackEle:"[name='brandImg'],.brand-logo-img",
        successCallback:function(path){
            console.log(path);
        },
        cropper:false,
        cropperOpts: {
            aspectRatio: 220/ 220,//截图框的比例
            zoomable:false, //禁用鼠标滚轮放大缩小
            viewMode:1 //截图框只能在图片区域内移动
        }
    },cos)
})

var OnOffShelf = function() {
    var module = this;

    //region 模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index) {
                if($("h1").attr('data-id') == 1){
                    var allParams = $.extend({}, globalData.queryData, { pageIndex: index,pageSize: globalData.page.pagesize });
                    console.log('上架',allParams)
                    loader.loadData(allParams);
                }else {
                    var allParams = $.extend({}, globalData.queryData1, { pageIndex: index,pageSize: globalData.page.pagesize });
                    console.log('下架',allParams)
                    loader.loadData(allParams);
                }
            },
            getparams:function(){
                return {
                    /*text:$("#text").val()*/
                }
            },
            pagesize: 10,
            showpage: 6
        },
        data:{
        },
        queryData:{
            name:'',
            remark:'',
            fId:'',
            sId:'',
            sign:0,
        },
        queryData1:{
            name:'',
            remark:'',
            fId:'',
            sId:'',
            sign:1,
        }

    };
    //region ui绘制
    var renders = {
        builderRows:function(result){
            var html= template("loadArticle",result);
            $("#articleList tbody").html(html);
        },
        //选择一级类目
        selectOne:function(result){
            console.log(result)
            $.each(result.data,function (i,obj) {
                obj.Name = obj.Name;
            });
            result.data.unshift({Name:'一级类目',val:''});
            var html= template("optionOne",result);
            $("#selectOne").html(html);

        },
        //选择二级类目
        selectTwo:function(result){
            console.log(result);
            $.each(result.data,function (i,obj) {
                obj.Name = obj.Name;
            });
            result.data.unshift({Name:'二级类目',val:''});
            var html= template("optionTwo",result);
            $("#selectTwo").html(html);
        },
    }
    //endregion

    //region 操作处理
    var action = {
        //日期格式化
        timeAccept:function (time) {
            var date = new Date(time);
            var seperator1 = "-";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (hour >= 0 && hour <= 9) {
                hour = "0" + hour;
            }
            if (minute >= 0 && minute <= 9) {
                minute = "0" + minute;
            }
            if (second >= 0 && second <= 9) {
                second = "0" + second;
            }
            hour = hour + ':';
            minute = minute + ':';
            var currentDate = date.getFullYear() + seperator1 + month + seperator1 + strDate+ " " +hour +minute +second;
            return currentDate;
        }
    };
    //endregion

    //region 数据加载器
    var loader = {
        //获取商品列表数据
        loadData:function(allParams){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("good/getList"),
                data: allParams,
                dataType: "json",
                success: function(result) {
                    console.log(result);
                    $.each(result.data,function(i,data){
                        data.UpdateTime = action.timeAccept(data.UpdateTime);
                        data.Img = urlFunc.imgFormat(data.Img);
                        var secondName = [];
                        $.each(data.list,function(i,item){
                            secondName.push(item.sTitle)
                        });
                        secondName = secondName.join(',');
                        secondName = secondName.replace(/,/g,'/');
                        data.secondName =secondName;
                    });
                    renders.builderRows(result);
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //选择一级类目
        select1:function(){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("goodCate/getFirstList"),
                data: {},
                dataType: "json",
                success: function(result) {
                    renders.selectOne(result);
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //选择二级类目
        select2:function(fId){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("goodCate/getSecondList"),
                data: {
                    fId:fId
                },
                dataType: "json",
                success: function(result) {
                    renders.selectTwo(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //上架下架
        upDown:function(params,callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("good/upDownInBatches"),
                data:params,
                dataType: "json",
                success: function(result) {
                  callback(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        count:function(callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("good/countList"),
                data:globalData.queryData,
                dataType: "json",
                success: function(result) {
                    callback(result);
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //删除商品
        deleteArticle:function(id,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("good/del"),
                data:{
                    id:id
                },
                dataType: "json",
                success: function(result) {
                    callback(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //批量删除
        batchDelete:function(ids,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("good/delInBatches"),
                data:{
                    ids:ids
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
    };
    //endregion

    //region 事件注册
    var events = {
        uiEvent: function() {
            $("#btnQuery").on("click",function(){
                var userQueryData = $('#queryListForm').serializeObject();
                $.extend(globalData.queryData,userQueryData);
                loader.count(function(result){
                    $("span#pager").Pager("init", result.data, globalData.page);
                });
            });
            //选择一级类目查询二级类目
            $("#selectOne").on('change',function () {
                var fid = $(this).val();
                loader.select2(fid);
            });
            //按排序号排序
            $('body').on('click','.theSort',function () {
                globalData.queryData.sortRule = 1;
                loader.count(function(result){
                    $("span#pager").Pager("init", result.data, globalData.page);
                });
            });
            $('body').on('click','.theDate',function () {
                globalData.queryData.sortRule = 0;
                console.log(globalData.queryData)
                loader.count(function(result){
                    $("span#pager").Pager("init", result.data, globalData.page);
                });
            });
            //全选1
            $('body').on("click",'.allSelect',function(){
                $('#Header input[type="checkbox"]').prop("checked", true);
                $('.toggle-disabled').prop('disabled',false);
            });
            // 取消全选1
            $('body').on("click",'.cancelSelect',function(){
                $('#Header input[type="checkbox"]').prop("checked", false);
                $('.toggle-disabled').prop('disabled',true);
            });
            //单击单个checkBox1
            $("body").on("click",'#Header input[type="checkbox"]',function(){
                if($(this)[0].checked == true){
                    $(this).prop("checked", true);
                    $('.toggle-disabled').prop('disabled',false);
                }else{
                    $(this).prop("checked", false);
                    $('.toggle-disabled').prop('disabled',true);
                }
                $('#Header input[type="checkbox"]').each(function () {
                    if($(this)[0].checked == true){
                        $('.toggle-disabled').prop('disabled',false);
                    }
                });
            });
            //删除商品
            $("body").on("click",'.massageDelete',function () {
                var id = $(this).closest('tr').attr('data-id');
                $("#deleteArt .confirmDelete").attr('data-id',id);
            });
            $("body").on("click",'#deleteArt .confirmDelete',function () {
                var id = $("#deleteArt .confirmDelete").attr('data-id');
                loader.deleteArticle(id,function (result) {
                    if(result.statusCode == 0){
                        toastr.success("删除商品成功");
                        $("#btnQuery").trigger("click");
                        $("#deleteArt").modal("hide");
                    }else{
                        toastr.warning("删除商品失败!");
                    }
                })
            });
            //批量删除商品
            $('body').on("click","#delete .confirmDelete",function () {
                var idStrArray = [];
                $("#articleList input:checked").parents('tr').each(function(){
                    idStrArray.push($(this).attr("data-id"));
                });
                var ids = idStrArray.join(',');
                loader.batchDelete(ids,function(result){
                    if(result.statusCode == 0){
                        toastr.success("批量删除成功!");
                        $("#delete").modal("hide");
                        $("#btnQuery").trigger("click");
                    }else{
                        toastr.warning("批量删除失败!");
                    }
                });
            });
            //上架下架商品
            $('body').on("click","#udDown .confirmDelete",function () {
                var idStrArray = [];
                $("#articleList input:checked").parents('tr').each(function(){
                    idStrArray.push($(this).attr("data-id"));
                });
                var sign = 0;
                if($("h1").attr('data-id') == 1){
                    sign = 1;
                }
                var ids = idStrArray.join(',');
                var params = {
                    ids:ids,
                    sign:sign
                };
                loader.upDown(params,function(result){
                    if(result.statusCode == 0){
                        toastr.success("下架成功!");
                        $("#udDown").modal("hide");
                        $("#btnQuery").trigger("click");
                    }else{
                        toastr.warning("下架失败!");
                    }
                });
            });
            //图标的双击事件
            clickImg('img');
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
        loader.select1();
    };
}


