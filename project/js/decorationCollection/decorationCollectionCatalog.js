/**
 * Created by 111 on 2017/4/11.
 */

var DecorationCollectionCatalog = function() {
    var module = this;
  //模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index,params) {
                var allParams = $.extend({},globalData.queryData,{ page: index-1, rows: globalData.page.pagesize });
                loader.loadData(allParams);
            },
            getparams:function(){
                return {
                    text:$("#searchIpt").val()
                }
            },
            pagesize: 10,
            showpage: 6,
        },
        data:{},
        queryData:{
            page:'0',
            rows:'50',
            title:'',
            firstClassId:''
        }
    }
    //ui绘制
    var renders = {
        builderFirstClass:function(result){
            var html= template("directoryOne",result);
            $("#onedTable").html(html);
            action.FdisabledUpDown();
        }
    }
    //操作处理
    var action = {
        FdisabledUpDown:function(){
            $("#onedTable ul li.parentList").each(function(i,item) {
                $(item).find('[data-func="up"],[data-func="down"]').removeClass("isDisabled");
            });
            $("#onedTable ul li.parentList:eq(0)").find('.firstMoveUp').addClass("isDisabled");
            $("#onedTable ul li.parentList:last").find('.firstMoveDown').addClass("isDisabled");
        },
        getSecondList:function (fId) {
            $('#onedTable ul').each(function (i,item) {
               if($(item).children('.parentList').attr('data-id') == fId){
                   $(item).children('.parentList').siblings().remove();
                   var $this = $(item);
                   loader.getSecondList(fId,function (result) {
                       $(result.data).each(function (i,item) {
                           $this.append('' +
                               '<li class="list" data-id='+item.Id+' data-Sort='+item.Sort+' style="display: block;padding-left: 30px;">'+
                               '<div class="xianshi" style="width: 100%;">'+
                               '<div class="change tree zishu" style="width:30%;">'+
                               '<span class="info"><i>'+item.Title+'</i></span>'+
                               '</div>'+
                               '<div style="width:30%;text-align: right;padding-right:7px;">'+
                               '<a class="move_edit" data-toggle="modal" href="#editSubclass">编辑</a>&nbsp;&nbsp;'+
                               '<a class="move_up">上移</a>&nbsp;&nbsp;'+
                               '<a class="move_down">下移</a>&nbsp;&nbsp;'+
                               '<a class="noDisplay removeChild" data-func="delChild" data-toggle="modal" href="#confirmModal2">删除</a>'+
                               '</div>'+
                               '</div>'+
                               '</li>');
                           $this.find('li.list').find('.move_up,.move_down').removeClass("isDisabled");
                           $this.find('li.list:eq(0)').find('.move_up').addClass("isDisabled");
                           $this.find('li.list:last').find('.move_down').addClass("isDisabled");
                       })
                   })
                }
            })
        }
    };
    //数据加载器
    var loader = {
        loadDataFirst:function(params){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("artCategory/getAllList"),
                data: params,
                dataType: "json",
                success: function(result) {
                    renders.builderFirstClass(result);
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //添加/编辑一级目录
        addFirstClass:function(params,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("artCategory/editFirst"),
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
        //获取单个一级目录
        singleFirst:function(id,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("artCategory/singleFirst"),
                data: {
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
        //一级类目上移/下移
        firstClassUpDown:function(params,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("artCategory/switchFirst"),
                data: params,
                dataType: "json",
                success: function(result) {
                    callback(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //删除一级类目
        delFirst:function(id,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("artCategory/delFirst"),
                data: {
                    id:id
                },
                dataType: "json",
                success: function(result) {
                   callback(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(msg)
                }
            });
        },
        //添加/编辑子类
        editSecond:function(params,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("artCategory/editSecond"),
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
        //获取单个子类
        singleSecond:function(id,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("/artCategory/singleSecond"),
                data: {
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
        //删除单个子类
        delSecond:function(id,callback){
        $.ajaxAuthor({
            type: "post",
            url: urlFunc.format("artCategory/delSecond"),
            data: {
                id:id
            },
            dataType: "json",
            success: function(result) {
                callback(result)
            },
            error: function(xhr, msg, ex) {
                console.log(msg)
            }
        });
    },
        //子类目上移/下移
        switchSecond:function(params,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("artCategory/switchSecond"),
                data: params,
                dataType: "json",
                success: function(result) {
                    callback(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //获取一级类目的所有子类目
        getSecondList:function(fId,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("artCategory/getSecondList"),
                data: {
                    fId:fId
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
    };
    //事件注册
    var events = {
        uiEvent: function() {
            //子类目的第一个和最后一个移动禁用
            $('body').on('click',".clickSpan",function () {
                $(this).parent().parent().siblings('li').find('.move_up,.move_down').removeClass("isDisabled");
                $(this).parent().parent().siblings('li:eq(0)').find('.move_up').addClass("isDisabled");
                $(this).parent().parent().siblings('li:last').find('.move_down').addClass("isDisabled");
            });
            //添加一级目录
            $("#addFirstClass").on('click',function () {
                $(".isBlock").html('');
                $("h3").html('添加一级目录');
                $("#save1,.imgIcon").css('display','inline-block');
                $("#xiuGai").css('display','none');
                $('.bigImg').attr('src','');
                $(".inputImg").attr('path','');
                $('.subhead,.className').val('');
            });
            $("#save1").on("click",function(){
                $(".isBlock").html('');
                var title =$("#addBrandForm1 .className").val();
                var subhead =$("#addBrandForm1 .subhead").val();
                var img =$("#addBrandForm1 .inputImg").attr("path");
                var id = 0;
                var params = {
                    title:title,
                    subhead:subhead,
                    img:img,
                    id:0
                };
                if(!title){
                    $("#addBrandForm1 p:eq(0)").append('<span class="isBlock">请填写类目名</span>');
                    return;
                }else if(!subhead){
                    $("#addBrandForm1 p:eq(1)").append('<span class="isBlock">请填写副标题</span>');
                    return;
                }else if(!img){
                    $("#addBrandForm1 div:eq(0)").append('<span class="isBlock">请填上传图标</span>');
                    return;
                }else{
                    loader.addFirstClass(params,function(result){
                        console.log(params);
                        if(result.statusCode == 0){
                            toastr.success('添加一级类目成功');
                            $("#addDirectory1").modal("hide");
                            loader.loadDataFirst();
                        }else{
                            toastr.warning("添加一级类目失败!");
                        }
                    });
                }
            });
            //修改一级类目
            $("body").on("click",".massagRevise",function () {
                $(".isBlock").html('');
                $(".isBlock").html('');
                $("h3").html('添加一级目录');
                $("#save1,.imgIcon").css('display','none');
                $("#xiuGai").css('display','inline-block');
                var id = $(this).parent().parent().attr('data-id');
                $("#xiuGai").attr('data-id',id);
                loader.singleFirst(id,function (result) {
                    $("#addBrandForm1 .inputImg").attr("path",result.data.bigImg);
                    result.data.bigImg = urlFunc.imgFormat(result.data.bigImg);
                    $("#addBrandForm1 .className").val(result.data.title);
                    $("#addBrandForm1 .subhead").val(result.data.subhead);
                    $("#addBrandForm1 img").attr('src',result.data.bigImg);
                })
            });
            $("#xiuGai").on("click",function(){
                $(".isBlock").html('');
                var title =$("#addBrandForm1 .className").val();
                var subhead =$("#addBrandForm1 .subhead").val();
                var img =$("#addBrandForm1 .inputImg").attr("path");
                var id = $("#xiuGai").attr('data-id');
                var params = {
                    title:title,
                    subhead:subhead,
                    img:img,
                    id:id
                };
                if(!title){
                    $("#addBrandForm1 p:eq(0)").append('<span class="isBlock">请填写类目名</span>');
                    return;
                }else if(!subhead){
                    $("#addBrandForm1 p:eq(1)").append('<span class="isBlock">请填写副标题</span>');
                    return;
                }else if(!img){
                    $("#addBrandForm1 div:eq(0)").append('<span class="isBlock">请填上传图标</span>');
                    return;
                }else{
                    loader.addFirstClass(params,function(result){
                        console.log(params);
                        if(result.statusCode == 0){
                            toastr.success('修改一级类目成功');
                            $("#addDirectory1").modal("hide");
                            loader.loadDataFirst();
                        }else{
                            toastr.warning("修改一级类目失败!");
                        }
                    });
                }

            });
            $("body").on("click","#quxiao1",function () {
               $("#addDirectory1").modal('hide');
            });

            //一级类目上移
            $("body").on("click",".firstMoveUp",function () {
                var id1 = $(this).closest("li.parentList").attr('data-id');
                var sort1 = $(this).closest("li.parentList").attr('data-sort');
                var id2 = $(this).closest("ul").prev('ul').find("li.parentList").attr('data-id');
                var sort2 = $(this).closest("ul").prev('ul').find("li.parentList").attr('data-sort');
                var params = {
                    id1:id1,
                    sort1:sort1,
                    id2:id2,
                    sort2:sort2
                };
                loader.firstClassUpDown(params,function (result) {
                    if(result.statusCode== 0){
                        loader.loadDataFirst();
                        toastr.success("一级目录上移成功");
                    }else{
                        toastr.warning("一级目录上移失败")
                        return
                    }
                });

            });
            //一级类目下移
            $("body").on("click",".firstMoveDown",function () {
                var id1 = $(this).closest("li.parentList").attr('data-id');
                var sort1 = $(this).closest("li.parentList").attr('data-sort');
                var id2 = $(this).closest("ul").next('ul').find("li.parentList").attr('data-id');
                var sort2 = $(this).closest("ul").next('ul').find("li.parentList").attr('data-sort');
                var params = {
                    id1:id1,
                    sort1:sort1,
                    id2:id2,
                    sort2:sort2
                };
                loader.firstClassUpDown(params,function (result) {
                    if(result.statusCode== 0){
                        loader.loadDataFirst();
                        toastr.success("一级目录上移成功");
                    }else{
                    toastr.warning("一级目录上移失败")
                        return
                    }
                 });
            });
            //删除一级类目
            $("body").on("click",".massageDelete1",function () {
               var id = $(this).parent().parent().attr('data-id');
                $('#confirmModal1 .confirmDelete').attr("data-id",id)
            });
            $('body').on("click",'#confirmModal1 .confirmDelete',function(){
                var id = $('#confirmModal1 .confirmDelete').attr("data-id");
                loader.delFirst(id,function (result) {
                    if(result.statusCode == 0){
                        toastr.success("一级类目删除成功");
                        loader.loadDataFirst();
                        $("#confirmModal1").modal('hide');
                    }else {
                        toastr.warning("一级类目下有子类，不能删除");
                    }
                });
            });
            //添加子类
            $('body').on('click','.addSubclass',function () {
                var id = $(this).parent().parent().attr('data-id');
                $("#title").val('');
                $("#save").attr('data-id',id);
                loader.singleFirst(id,function (result) {
                    $("#fClass").val(result.data.title)
                })
            });
            $('body').on('click','#save',function () {
                $('.isBlock').css('display','none');
                var fId = $("#save").attr('data-id');
                var title = $("#title").val();
                var params = {
                    fId:fId,
                    title:title,
                    id:0
                };
                console.log(params)
                if(!title){
                    $("#Header div:eq(1)").append('<span class="isBlock">请填写子类名</span>');
                    return;
                }else {
                    loader.editSecond(params,function (result) {
                        if(result.statusCode == 0){
                            toastr.success("添加子类成功");
                            action.getSecondList(fId);
                            $("#addSubclass").modal('hide');
                        }else {
                            toastr.warning("添加子类失败");
                        }
                    })
                }
            });
            //编辑子类
            $('body').on('click','.move_edit',function () {
                var id = $(this).parent().parent().parent().attr('data-id');
                var fid = $(this).parent().parent().parent().siblings('li.parentList').attr('data-id');
                $('#keep').attr('data-fid',fid);
                $('#keep').attr('data-id',id);
                loader.singleSecond(id,function (result) {
                    $("#sTitle").val(result.data.title)
                });
                loader.singleFirst(fid,function (result) {
                    $("#sClass").val(result.data.title)
                })
            });
            $('body').on('click','#keep',function () {
                $('.isBlock').css('display','none');
                var fId = $('#keep').attr('data-fid');
                var id = $('#keep').attr('data-id');
                var title = $("#sTitle").val();
                var params = {
                    fId:fId,
                    title:title,
                    id:id
                };
                console.log(params);
                if(!title){
                    $("#append").append('<span class="isBlock">请填写子类名</span>');
                    return;
                }else {
                    loader.editSecond(params,function (result) {
                        if(result.statusCode == 0){
                            toastr.success("编辑子类成功");
                            action.getSecondList(fId);
                            $("#editSubclass").modal('hide');
                        }else {
                            toastr.warning("编辑子类失败");
                        }
                    })
                }
            });
            //删除子类
            $('body').on('click','.removeChild',function () {
                var id = $(this).parent().parent().parent().attr('data-id');
                var fId = $(this).closest("li.list").siblings('li.parentList').attr('data-id');
                $("#confirmModal2 .confirmDelete").attr('data-id',id);
                $("#confirmModal2 .confirmDelete").attr('data-fId',fId);
            });
            $("#confirmModal2 .confirmDelete").on('click',function () {
                var fId = $("#confirmModal2 .confirmDelete").attr('data-fId');
                var id = $("#confirmModal2 .confirmDelete").attr('data-id');
                loader.delSecond(id,function (result) {
                    if(result.statusCode == 0){
                        toastr.success("删除子类成功");
                        action.getSecondList(fId);
                        $("#editSubclass").modal('hide');
                    }else {
                        toastr.warning("删除子类失败");
                    }
                })
            });
            //子类目上移
            $("body").on("click",".move_up",function () {
                var fId = $(this).closest("li.list").siblings('li.parentList').attr('data-id');
                var id1 = $(this).closest("li.list").attr('data-id');
                var sort1 = $(this).closest("li.list").attr('data-Sort');
                var id2 = $(this).closest("li.list").prev("li.list").attr('data-id');
                var sort2 = $(this).closest("li.list").prev("li.list").attr('data-Sort');
                var params = {
                    id1:id1,
                    sort1:sort1,
                    id2:id2,
                    sort2:sort2
                };
                loader.switchSecond(params,function (result) {
                    if(result.statusCode== 0){
                        action.getSecondList(fId);
                        toastr.success("子类目上移成功");
                    }else{
                        toastr.warning("子类目上移失败");
                    }
                 });

            });
            //子类目下移
            $("body").on("click",".move_down",function () {
                var fId = $(this).closest("li.list").siblings('li.parentList').attr('data-id');
                var id1 = $(this).closest("li.list").attr('data-id');
                var sort1 = $(this).closest("li.list").attr('data-Sort');
                var id2 = $(this).closest("li.list").next("li.list").attr('data-id');
                var sort2 = $(this).closest("li.list").next("li.list").attr('data-Sort');
                var params = {
                    id1:id1,
                    sort1:sort1,
                    id2:id2,
                    sort2:sort2
                };
                loader.switchSecond(params,function (result) {
                    if(result.statusCode== 0){
                        action.getSecondList(fId);
                         toastr.success("子类目下移成功");
                    }else{
                        toastr.warning("子类目下移失败")
                         return
                    }
                 });
            });
        }
    };
    //公开方法
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
        loader.loadDataFirst();
    };
};
