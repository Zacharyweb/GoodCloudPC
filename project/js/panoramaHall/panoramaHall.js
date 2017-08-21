/**
 * Created by 111 on 2017/4/19.
 */
var PanoramaHall = function() {
    var module = this;
    //模块数据全局缓存数据
    //region 模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index) {
                var allParams = $.extend({}, globalData.queryData, { pageIndex: index, pageSize: globalData.page.pagesize });
                loader.loadData(allParams);
                console.log(allParams);
                console.log("回调");
            },
            getparams:function(){
                return {
                    text:$("#text").val()
                }
            },
            pagesize: 5,
            showpage: 6
        },
        data:{},
        queryData:{

        }
    };

    //endregion
    //ui绘制
    var renders = {
        builderRows:function(result){
            var html= template("storeManagement",result);
            $("#sample tbody").html(html);
        },
    };
    // 操作处理
    var action = {
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
    //
    var loader = {
        //获取建材城数据
        loadData:function(allParams){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("pano/getList"),
                data:allParams,
                dataType: "json",
                success: function(result) {
                    $.each(result.data,function(i,data){
                        data.CoverImg = urlFunc.imgFormat(data.CoverImg,200,100);
                        data.UpdateTime = action.timeAccept(data.UpdateTime);
                    });
                    renders.builderRows(result);
                }
            });
        },
        //页码
        count:function(callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("pano/countList"),
                data:globalData.queryData,
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
        //删除
        del:function(id,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("pano/del"),
                data:{
                    id:id
                },
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
                var userQueryData = $('#queryImgListForm').serializeObject();
                $.extend(globalData.queryData,userQueryData);
                 loader.count(function(result){
                    $("span.pager").Pager("init", result.data, globalData.page);
                 });
            });
            //单个删除
            $("body").on('click',".del",function () {
                var id = $(this).parent().parent('tr').attr("data-id");
                $("#deleteStore .confirmDelete").attr('data-id',id);
                console.log(id)
            });
            //单个删除
            $("body").on('click',"[data-action]",function () {
                var id = $(this).attr("data-id");
                var panoKey = $(this).attr("data-key");
                var action = $(this).attr("data-action");
                $("#qrPreview").modal();
                var url="http://1.1.1.10:8083/#/forward?token="+localStorage.getItem("token")+"&action="+action+"&id="+id+"&panoKey="+panoKey;
                url=url.replace("{action}",action);
                $("#previewQrCode").attr("src",urlFunc.format("/qr/previewQr?url="+encodeURIComponent(url)));
            });
            $("#deleteStore .confirmDelete").on('click',function () {
                var id = $("#deleteStore .confirmDelete").attr('data-id');
                loader.del(id,function (result) {
                    if(result.statusCode == 0){
                        $("#btnQuery").trigger("click");
                        $("#deleteStore").modal('hide');
                        toastr.success('删除成功')
                    }else{
                        toastr.warning('删除失败')
                    }
                })
            });
            //全选
            $("#select").on('click',function () {
                $('#sample input[type="checkbox"]').prop("checked", true);
                $('.toggle-disabled').prop('disabled',false);
            });
            //取消全选
            $("#noSelect").on('click',function () {
                $('#sample input[type="checkbox"]').prop("checked", false);
                $('.toggle-disabled').prop('disabled',true);
            });
            //单击单个checkBox
            $("body").on("click",'input[type="checkbox"]',function(){
                if($(this)[0].checked == true){
                    $(this).prop("checked", true);
                    $('.toggle-disabled').prop('disabled',false);
                }else{
                    $(this).prop("checked", false);
                    $('.toggle-disabled').prop('disabled',true);
                }
                $('#sample input[type="checkbox"]').each(function () {
                    if($(this)[0].checked == true){
                        $('.toggle-disabled').prop('disabled',false);
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
        $("#btnQuery").trigger("click");
    };
}