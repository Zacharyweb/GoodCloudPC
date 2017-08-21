/**
 * Created by 111 on 2017/4/19.
 */
var SingleApp = function() {
    var module = this;
    //模块数据全局缓存数据
    //region 模块数据全局缓存数据
    var globalData = {
        page:{
            callback: function (index,params) {
                var allParams = $.extend({},globalData.queryData,{ pagesize: index-1, pageindex: globalData.page.pagesize });
                loader.loadData(globalData.queryData);
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
            pagesize: '50',
            pageindex: '1',
            shopName:'',
            contacts:'',
            status:-1,
        }
    };
    //endregion
    //ui绘制
    var renders = {
        builderRows1:function(result){
            var obj={};
            obj.data = result;
            var html= template("container1",obj);
            $("#articleList").html(html);
        },
        builderRows2:function(result){
            var obj={};
            obj.data = result;
            var html= template("container2",obj);
            $("#articleList").html(html);
        },
        builderRows3:function(result){
            var obj={};
            obj.data = result;
            var html= template("container3",obj);
            $("#articleList").html(html);
        },
        builderRows4:function(result){
            var obj={};
            obj.data = result;
            var html= template("container4",obj);
            $(".imgContainer ul").html(html);
        },
        adImg:function(result){
            var obj={};
            obj.data = result;
            console.log('obj',obj);
            var html= template("imgContainer",obj);
            $("#articleList").html(html);
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
        //正常登陆登陆后菜单数据的请求
        loadData1:function(id,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/getSucUrls"),
                data:{
                    id:id
                },
                dataType: "json",
                success: function(result) {
                    var them = JSON.parse(result.data);
                    console.log(them)
                    $.each(them,function(i,item){
                        item.normalicon = urlFunc.imgFormat(item.normalicon);
                        item.selectedicon = urlFunc.imgFormat(item.selectedicon);
                    });
                    console.log(them)
                    callabck(them)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //正常登陆上移下移
        exchangeSucUrl:function(params,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/exchangeSucUrl"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callabck(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //正常登陆添加编辑
        createSucUrl:function(params,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/createSucUrl"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callabck(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //正常登陆页的删除
        delSucUrl:function(params,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/delSucUrl"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callabck(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //正常登录页返回单个app/singleSucUrl
        singleSucUrl:function(params,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/singleSucUrl"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callabck(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //免登陆登陆后菜单数据的请求
        loadData2:function(id,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/getLoginUrls"),
                data:{
                    id:id
                },
                dataType: "json",
                success: function(result) {
                    var them = JSON.parse(result.data);
                    console.log('小数据',them);
                    $.each(them,function(i,item){
                        item.normalicon = urlFunc.imgFormat(item.normalicon);
                        item.selectedicon = urlFunc.imgFormat(item.selectedicon);
                    });
                    callabck(them);
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //免登陆上移下移
        exchangeSucUrl2:function(params,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/exchangeLoginUrl"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callabck(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //免登陆添加编辑
        createSucUrl2:function(params,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/createLoginUrl"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callabck(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //免登陆页的删除
        delSucUrl2:function(params,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/delLoginUrl"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callabck(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //免登录页返回单个app/singleSucUrl
        singleSucUrl2:function(params,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/singleLoginUrl"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callabck(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //直播等待广告图
        getAppConfig:function(id,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/getAppConfig"),
                data:{
                    id:id
                },
                dataType: "json",
                success: function(result) {
                    var them = JSON.parse(result.data);
                    console.log('小数据',them);
                    $.each(them,function(i,item){
                        item.url = urlFunc.imgFormat(item.url,200,100);
                    });
                    callabck(them)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //直播等待广告图的上移下移
        exchangeSucUrl4:function(params,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/exchangeAppConfig"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callabck(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //直播等待广告图的删除
        delSucUrl4:function(params,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/delAppConfig"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callabck(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //直播等待广告图的添加
        createAppConfig:function(params,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/createAppConfig"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callabck(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
       /* //默认菜单菜单数据的请求
        loadData3:function(id,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/getLoginUrls"),
                data:{
                    id:id
                },
                dataType: "json",
                success: function(result) {
                    var them = JSON.parse(result.data);
                    $.each(them,function(i,item){
                        console.log(item.normalicon);
                        console.log(item.selectedicon)
                    });
                    callabck(them)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },*/
        //起始页保存
        EditLoginUrl:function(params,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/editLoginUrl"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callabck(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //成功页保存
        EditSuccessUrl:function(params,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/editSuccessUrl"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callabck(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //版本号保存
        EditVersion:function(params,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/editVersion"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callabck(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //編輯視頻地址保存
        EditUploadUrl:function(params,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/editUploadUrl"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callabck(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //获取单个app详情
        getAppContent:function(id,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/getAppContent"),
                data:{
                    id:id
                },
                dataType: "json",
                success: function(result) {
                    callabck(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        //获取所有图标
        getImgStr:function(id,callabck){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("app/getImgStr"),
                data:{
                    id:id
                },
                dataType: "json",
                success: function(result) {
                    callabck(result)
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
                if( color == 'rgb(85, 85, 85)' || color == 'red'){
                    return
                }else{
                    $(this).val('');
                    $(this).css({
                        color:'#555',
                        borderColor:'#c2cad8'
                    })
                }
            });
            //table切换样式切换
            $("#isTable li").on('click',function () {
                var id =$(this).attr('data-id');
                if(id == 4){
                    $("#addMenu").html('<a class="btn dark addMenu'+id+'">+添加广告图</a>');
                }else{
                    $("#addMenu").html('<a class="btn dark addMenu'+id+'" data-toggle="modal" href="#addMenu'+id+'">+添加菜单</a>');
                }
            });
            $("#isTable li:eq(0)").on('click',function () {
                var id = $.getUrlParam("id");
                loader.loadData1(id,function (result) {
                    renders.builderRows1(result);
                    action.disabledUpDown()
                });
            });
            $("#isTable li:eq(1)").on('click',function () {
                var id = $.getUrlParam("id");
                loader.loadData2(id,function (result) {
                    renders.builderRows2(result);
                    action.disabledUpDown()
                });
            });
           /* $("#isTable li:eq(2)").on('click',function () {
                var id = $.getUrlParam("id");
                loader.loadData3(id,function (result) {
                    renders.builderRows3(result);
                    action.disabledUpDown()
                });
            });*/
             $("#isTable li:eq(2)").on('click',function () {
                 var id = $.getUrlParam("id");
                 loader.getAppConfig(id,function (result) {
                     renders.adImg(result);
                     action.disabledUpDown()
                 });
             });
            //起始页保存
            $('#save1').on('click',function () {
                var id = $.getUrlParam("id");
                var val = $(this).siblings('input').val();
                var params = {
                    id:id,
                    loginUrl:val
                };
                if(val == ''){
                    $(this).siblings('input').val('请填写起始页地址');
                    $(this).siblings('input').css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else{
                    loader.EditLoginUrl(params,function (result) {
                        if(result.statusCode == 0){
                            toastr.success('保存起始页地址成功')
                        }else{
                            toastr.warning('保存起始页地址失败')
                        }
                    })
                }
            });
            //成功页保存
            $('#save2').on('click',function () {
                var id = $.getUrlParam("id");
                var val = $(this).siblings('input').val();
                var params = {
                    id:id,
                    version:val
                };
                if(val == ''){
                    $(this).siblings('input').val('请填写成功页地址');
                    $(this).siblings('input').css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else{
                    loader.EditSuccessUrl(params,function (result) {
                        if(result.statusCode == 0){
                            toastr.success('保存版本号成功')
                        }else{
                            toastr.warning('保存版本号失败')
                        }
                    })
                }
            });
            //版本号保存
            $('#save3').on('click',function () {
                var id = $.getUrlParam("id");
                var val = $(this).siblings('input').val();
                var params = {
                    id:id,
                    version:val
                };
                if(val == ''){
                    $(this).siblings('input').val('请填写版本号');
                    $(this).siblings('input').css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else{
                    loader.EditVersion(params,function (result) {
                        if(result.statusCode == 0){
                            toastr.success('保存成功页地址成功')
                        }else{
                            toastr.warning('保存成功页地址失败')
                        }
                    })
                }
            });
            //編輯視頻地址保存
            $('#save4').on('click',function () {
                var id = $.getUrlParam("id");
                var val = $(this).siblings('input').val();
                var params = {
                    id:id,
                    uploadUrl:val
                };
                if(val == '' || val == '请填写视频地址'){
                    $(this).siblings('input').val('请填写视频地址');
                    $(this).siblings('input').css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else{
                    loader.EditUploadUrl(params,function (result) {
                        if(result.statusCode == 0){
                            toastr.success('保存视频地址成功')
                        }else{
                            toastr.warning('保存视频地址失败')
                        }
                    })
                }
            });
            //正常登陆上移下移
            $('body').on('click','.isUp1',function () {
                var id = $.getUrlParam("id");
                var key1 = $(this).parent().parent().attr('data-id');
                var key2 = $(this).parent().parent().prev().attr('data-id');
                var key3 = $(this).parent().parent().next().attr('data-id');
                var params = {
                    id:id,
                    key1:key1,
                    key2:key2
                }
                loader.exchangeSucUrl(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('上移成功');
                        loader.loadData1(id,function (result) {
                            renders.builderRows1(result);
                            action.disabledUpDown()
                        });
                    }else{
                        toastr.warning('上移失败')
                    }
                })
            });
            $('body').on('click','.isDown1',function () {
                var id = $.getUrlParam("id");
                var key1 = $(this).parent().parent().attr('data-id');
                var key2 = $(this).parent().parent().next().attr('data-id');
                var params = {
                    id:id,
                    key1:key1,
                    key2:key2
                }
                loader.exchangeSucUrl(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('下移成功');
                        loader.loadData1(id,function (result) {
                            renders.builderRows1(result);
                            action.disabledUpDown()
                        });
                    }else{
                        toastr.warning('下移失败')
                    }
                })
            });
            //正常登陆返回单个
            $('body').on('click','.isEdit1',function () {
                var id = $.getUrlParam("id");
                var key = $(this).parent().parent().attr('data-id');
                var params = {
                    id:id,
                    key:key
                };
                loader.singleSucUrl(params,function (result) {
                    var data = JSON.parse(result.data);
                    $("#editMenu1 .smallImg").attr('data-src',data.normalicon);
                    $("#editMenu1 .bigImg").attr('data-src',data.selectedicon);
                    data.normalicon = urlFunc.imgFormat(data.normalicon);
                    data.selectedicon = urlFunc.imgFormat(data.selectedicon);
                    $("#editMenu1 input[name='brandName']").val(data.name);
                    $("#editMenu1 input[name='tel']").val(data.url);
                    $("#editMenu1 .smallImg").attr('src',data.normalicon);
                    $("#editMenu1 .bigImg").attr('src',data.selectedicon);
                    $("#editMenu1 .keepEdit2").attr('data-id',data.key);
                    $('.isIcon1').css('display','none');
                    $('.isIcon2').css('display','none');
                })
            });
            //正常登陆添加编辑
            $('body').on('click','#addMenu .addMenu1',function () {
                $("#addMenu1 input[name='brandName']").val('');
                $("#addMenu1 input[name='tel']").val('');
                $("#addMenu1 .smallImg").attr('src','');
                $("#addMenu1 .bigImg").attr('src','');
                $('.isIcon1').css('display','block');
                $('.isIcon2').css('display','block');
                $("#addMenu1 .red1").css('display','none');
                $("#addMenu1 .red2").css('display','none');
            });
            $('body').on('click','#addMenu1 .keepEdit1',function () {
                var id = $.getUrlParam("id");
                var name = $("#addMenu1 input[name='brandName']").val();
                var url = $("#addMenu1 input[name='tel']").val();
                var normalicon = $("#addMenu1 .smallImg").attr('data-src');
                var selectedicon = $("#addMenu1 .bigImg").attr('data-src');
                var params = {
                   id:id,
                   name:name,
                   url:url,
                   normalicon:normalicon,
                   selectedicon:selectedicon,
                   key:0
                };
                console.log(params);
                $("#addMenu1 .red1").css('display','none');
                $("#addMenu1 .red2").css('display','none');
                if(name == ''){
                    $("#addMenu1 input[name='brandName']").val('请填写菜单名称');
                    $("#addMenu1 input[name='brandName']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else if(url == ''){
                    $("#addMenu1 input[name='tel']").val('请填写菜单地址');
                    $("#addMenu1 input[name='tel']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else if(normalicon == undefined){
                    $("#addMenu1 .red1").css('display','inline');
                    return
                }else if(selectedicon == undefined){
                    $("#addMenu1 .red2").css('display','inline');
                    return
                }else{
                    loader.createSucUrl(params,function (result) {
                        if(result.statusCode == 0){
                            toastr.success('添加成功');
                            loader.loadData1(id,function (result) {
                                renders.builderRows1(result);
                                action.disabledUpDown();
                                $('#addMenu1').modal('hide');
                            });
                        }else{
                            toastr.warning('添加失败')
                        }
                    })
                }

            });
            $('body').on('click','#editMenu1 .keepEdit2',function () {
                var id = $.getUrlParam("id");
                var name = $("#editMenu1 input[name='brandName']").val();
                var url = $("#editMenu1 input[name='tel']").val();
                var normalicon = $("#editMenu1 .smallImg").attr('data-src');
                var selectedicon = $("#editMenu1 .bigImg").attr('data-src');
                var key = $(this).attr('data-id')
                var params = {
                    id:id,
                    name:name,
                    url:url,
                    normalicon:normalicon,
                    selectedicon:selectedicon,
                    key:key
                };
                console.log(params);
                $("#editMenu1 .red1").css('display','none');
                $("#editMenu1 .red2").css('display','none');
                if(name == ''){
                    $("#editMenu1 input[name='brandName']").val('请填写菜单名称');
                    $("#editMenu1 input[name='brandName']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else if(url == ''){
                    $("#editMenu1 input[name='tel']").val('请填写菜单地址');
                    $("#editMenu1 input[name='tel']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else{
                    loader.createSucUrl(params,function (result) {
                        if(result.statusCode == 0){
                            toastr.success('编辑成功');
                            loader.loadData1(id,function (result) {
                                renders.builderRows1(result);
                                action.disabledUpDown();
                                $('#editMenu1').modal('hide');
                            });
                        }else{
                            toastr.warning('编辑失败')
                        }
                    })
                }
            });
            //正常登陆删除
            $('body').on('click','.isDel1',function () {
                var key = $(this).parent().parent().attr('data-id');
                $('#confirmModal1 .confirmDelete').attr('data-id',key);
            });
            $('body').on('click','#confirmModal1 .confirmDelete',function () {
                var id = $.getUrlParam("id");
                var key = $('#confirmModal1 .confirmDelete').attr('data-id');
                var params = {
                    id:id,
                    key:key
                };
                loader.delSucUrl(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('删除成功');
                        loader.loadData1(id,function (result) {
                            renders.builderRows1(result);
                            action.disabledUpDown();
                            $('#addMenu1').modal('hide');
                        });
                    }else{
                        toastr.warning('删除失败')
                    }
                })
            });


            //免登陆上移下移
            $('body').on('click','.isUp2',function () {
                var id = $.getUrlParam("id");
                var key1 = $(this).parent().parent().attr('data-id');
                var key2 = $(this).parent().parent().prev().attr('data-id');
                var params = {
                    id:id,
                    key1:key1,
                    key2:key2
                };
                console.log("数据",params)
                loader.exchangeSucUrl2(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('上移成功');
                        loader.loadData2(id,function (result) {
                            renders.builderRows2(result);
                            action.disabledUpDown()
                        });
                    }else{
                        toastr.warning('上移失败')
                    }
                })
            });
            $('body').on('click','.isDown2',function () {
                var id = $.getUrlParam("id");
                var key1 = $(this).parent().parent().attr('data-id');
                var key2 = $(this).parent().parent().next().attr('data-id');
                var params = {
                    id:id,
                    key1:key1,
                    key2:key2
                }
                loader.exchangeSucUrl2(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('下移成功');
                        loader.loadData2(id,function (result) {
                            renders.builderRows2(result);
                            action.disabledUpDown()
                        });
                    }else{
                        toastr.warning('下移失败')
                    }
                })
            });
            //免登陆返回单个
            $('body').on('click','.isEdit2',function () {
                var id = $.getUrlParam("id");
                var key = $(this).parent().parent().attr('data-id');
                var params = {
                    id:id,
                    key:key
                };
                loader.singleSucUrl2(params,function (result) {
                    var data = JSON.parse(result.data);
                    $("#editMenu2 .smallImg").attr('data-src',data.normalicon);
                    $("#editMenu2 .bigImg").attr('data-src',data.selectedicon);
                    data.normalicon = urlFunc.imgFormat(data.normalicon);
                    data.selectedicon = urlFunc.imgFormat(data.selectedicon);
                    $("#editMenu2 input[name='brandName']").val(data.name);
                    $("#editMenu2 input[name='tel']").val(data.url);
                    $("#editMenu2 .smallImg").attr('src',data.normalicon);
                    $("#editMenu2 .bigImg").attr('src',data.selectedicon);
                    $("#editMenu2 .keepEdit2").attr('data-id',data.key);
                    $('.isIcon1').css('display','none');
                    $('.isIcon2').css('display','none');
                })
            });
            //免登陆添加编辑
            $('body').on('click','#addMenu .addMenu2',function () {
                $("#addMenu2 input[name='brandName']").val('');
                $("#addMenu2 input[name='tel']").val('');
                $("#addMenu2 .smallImg").attr('src','');
                $("#addMenu2 .bigImg").attr('src','');
                $('.isIcon1').css('display','block');
                $('.isIcon2').css('display','block');
                $("#addMenu2 .red1").css('display','none');
                $("#addMenu2 .red2").css('display','none');
            });
            $('body').on('click','#addMenu2 .keepEdit1',function () {
                var id = $.getUrlParam("id");
                var name = $("#addMenu2 input[name='brandName']").val();
                var url = $("#addMenu2 input[name='tel']").val();
                var normalicon = $("#addMenu2 .smallImg").attr('data-src');
                var selectedicon = $("#addMenu2 .bigImg").attr('data-src');
                var params = {
                    id:id,
                    name:name,
                    url:url,
                    normalicon:normalicon,
                    selectedicon:selectedicon,
                    key:0
                };
                console.log(params);
                $("#addMenu2 .red1").css('display','none');
                $("#addMenu2 .red2").css('display','none');
                if(name == ''){
                    $("#addMenu2 input[name='brandName']").val('请填写菜单名称');
                    $("#addMenu2 input[name='brandName']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else if(url == ''){
                    $("#addMenu2 input[name='tel']").val('请填写菜单地址');
                    $("#addMenu2 input[name='tel']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else if(normalicon == undefined){
                    $("#addMenu2 .red1").css('display','inline');
                    return
                }else if(selectedicon == undefined){
                    $("#addMenu2 .red2").css('display','inline');
                    return
                }else{
                    loader.createSucUrl2(params,function (result) {
                        if(result.statusCode == 0){
                            toastr.success('添加成功');
                            loader.loadData2(id,function (result) {
                                renders.builderRows2(result);
                                action.disabledUpDown();
                                $('#addMenu2').modal('hide');
                            });
                        }else{
                            toastr.warning('添加失败')
                        }
                    })
                }
            });
            $('body').on('click','#editMenu2 .keepEdit2',function () {
                var id = $.getUrlParam("id");
                var name = $("#editMenu2 input[name='brandName']").val();
                var url = $("#editMenu2 input[name='tel']").val();
                var normalicon = $("#editMenu2 .smallImg").attr('data-src');
                var selectedicon = $("#editMenu2 .bigImg").attr('data-src');
                var key = $(this).attr('data-id');
                var params = {
                    id:id,
                    name:name,
                    url:url,
                    normalicon:normalicon,
                    selectedicon:selectedicon,
                    key:key
                };
                console.log(params);
                $("#editMenu2 .red1").css('display','none');
                $("#editMenu2 .red2").css('display','none');
                if(name == ''){
                    $("#editMenu2 input[name='brandName']").val('请填写菜单名称');
                    $("#editMenu2 input[name='brandName']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else if(url == ''){
                    $("#editMenu2 input[name='tel']").val('请填写菜单地址');
                    $("#editMenu2 input[name='tel']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else{
                    loader.createSucUrl2(params,function (result) {
                        if(result.statusCode == 0){
                            toastr.success('编辑成功');
                            loader.loadData2(id,function (result) {
                                renders.builderRows2(result);
                                action.disabledUpDown();
                                $('#editMenu2').modal('hide');
                            });
                        }else{
                            toastr.warning('编辑失败')
                        }
                    })
                }
            });
            //免登陆删除
            $('body').on('click','.isDel2',function () {
                var key = $(this).parent().parent().attr('data-id');
                $('#confirmModal2 .confirmDelete').attr('data-id',key);
            });
            $('body').on('click','#confirmModal2 .confirmDelete',function () {
                var id = $.getUrlParam("id");
                var key = $('#confirmModal2 .confirmDelete').attr('data-id');
                var params = {
                    id:id,
                    key:key
                };
                loader.delSucUrl2(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('删除成功');
                        loader.loadData2(id,function (result) {
                            renders.builderRows2(result);
                            action.disabledUpDown();
                            $('#addMenu2').modal('hide');
                        });
                    }else{
                        toastr.warning('删除失败')
                    }
                })
            });


            //直播等待广告图上移下移
            $('body').on('click','.isUp4',function () {
                var id = $.getUrlParam("id");
                var key1 = $(this).parent().parent().attr('data-id');
                var key2 = $(this).parent().parent().prev().attr('data-id');
                var params = {
                    id:id,
                    key1:key1,
                    key2:key2
                };
                loader.exchangeSucUrl4(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('上移成功');
                        loader.getAppConfig(id,function (result) {
                            renders.adImg(result);
                            action.disabledUpDown()
                        });
                    }else{
                        toastr.warning('上移失败')
                    }
                })
            });
            $('body').on('click','.isDown4',function () {
                var id = $.getUrlParam("id");
                var key1 = $(this).parent().parent().attr('data-id');
                var key2 = $(this).parent().parent().next().attr('data-id');
                var params = {
                    id:id,
                    key1:key1,
                    key2:key2
                }
                loader.exchangeSucUrl4(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('下移成功');
                        loader.getAppConfig(id,function (result) {
                            renders.adImg(result);
                            action.disabledUpDown()
                        });
                    }else{
                        toastr.warning('下移失败')
                    }
                })
            });
            //直播等待广告图删除
            $('body').on('click','.isDel4',function () {
                var key = $(this).parent().parent().attr('data-id');
                $('#confirmModal4 .confirmDelete').attr('data-id',key);
            });
            $('body').on('click','#confirmModal4 .confirmDelete',function () {
                var id = $.getUrlParam("id");
                var key = $('#confirmModal4 .confirmDelete').attr('data-id');
                var params = {
                    id:id,
                    key:key
                };
                loader.delSucUrl4(params,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('删除成功');
                        loader.getAppConfig(id,function (result) {
                            renders.adImg(result);
                            action.disabledUpDown();
                            $('#confirmModal4').modal('hide');
                        });
                    }else{
                        toastr.warning('删除失败')
                    }
                })
            });
            //直播等待广告图的添加
            $('body').on('click',"#addMenu .addMenu4",function(){
                $.imgUpload({
                    callbackEle:"[name='brandImg'],#addMenu1 .brand-logo-img",
                    successCallback:function(path){
                        var id = $.getUrlParam("id");
                        var params = {
                            id:id,
                            url:path,
                            key:0
                        }
                       loader.createAppConfig(params,function (result) {
                           if(result.statusCode == 0){
                               toastr.success('添加直播等待广告图成功');
                               loader.getAppConfig(id,function (result) {
                                   renders.adImg(result);
                                   action.disabledUpDown();
                               });
                           }else{
                               toastr.warning('添加直播等待广告图失败')
                           }
                       })
                    },
                    cropper:true,
                    cropperOpts: {
                        aspectRatio: 2/1,//截图框的比例
                        zoomable:false, //禁用鼠标滚轮放大缩小
                        viewMode:1 //截图框只能在图片区域内移动
                    }
                },cos)
            });

            //弹窗选择图片的加载
            $('body').on('click','.logo-img-wrapper',function () {
                var id = $.getUrlParam("id");
                loader.getImgStr(id,function (result) {
                    var them = JSON.parse(result.data);
                    $.each(them,function(i,item){
                        item.src = item.url;
                        item.url = urlFunc.imgFormat(item.url);
                    });
                    renders.builderRows4(them);
                })
            });
            //选择图标
            $("body").on('click','.imgContainer ul li span',function () {
                $(this).css('background','#000');
                $(this).find('i').css({
                    display:'block',
                    color:'#fff'
                });
                $(this).parent().siblings().find('span').css('background','#fff');
                $(this).parent().siblings().find('i').css('display','none');
            });
            $("body").on('click','#isSave1',function () {
                $('.imgContainer ul li').each(function () {
                    if($(this).find('i').css('display') == 'block'){
                        var id =  $(this).find('img').attr('data-id');
                        var src =  $(this).find('img').attr('data-src');
                        var url =  $(this).find('img').attr('src');
                        $(".logo-img-wrapper .smallImg").attr('src',url);
                        $(".logo-img-wrapper .smallImg").attr('data-id',id);
                        $(".logo-img-wrapper .smallImg").attr('data-src',src);
                        $('.isIcon1').css('display','none');
                        $('#iconImg1').modal('hide');
                    }
                });
            });
            $("body").on('click','#isSave2',function () {
                $('.imgContainer ul li').each(function () {
                    if($(this).find('i').css('display') == 'block'){
                        var id =  $(this).find('img').attr('data-id');
                        var src =  $(this).find('img').attr('data-src');
                        var url =  $(this).find('img').attr('src');
                        $(".logo-img-wrapper .bigImg").attr('src',url);
                        $(".logo-img-wrapper .bigImg").attr('data-id',id);
                        $(".logo-img-wrapper .bigImg").attr('data-src',src);
                        $('.isIcon2').css('display','none');
                        $('#iconImg2').modal('hide');
                    }
                });
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

        var id = $.getUrlParam("id");
        $("#iconEdit").css('display','inline-block');
        $("#add").css('display','none');
        loader.getAppContent(id,function (result) {
            $('#save1').siblings('input').val(result.data.loginUrl);
            $('#save2').siblings('input').val(result.data.successUrl);
            $('#save3').siblings('input').val(result.data.version);
            $('#save4').siblings('input').val(JSON.parse(result.data.appConfig).uploadUrl);
        });
        loader.loadData1(id,function (result) {
            renders.builderRows1(result);
            action.disabledUpDown()
        });
    };
}