var BuildingCityPublicAccount = function() {
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
            pagesize: 10 ,
            pageIndex: 1,
        },
        data:{},
        queryData:{
            organizeName: '',
            mpName: '',
            utype:1
        }
    };
    //endregion
    //ui绘制
    var renders = {
        builderRows:function(result){
            var html= template("container",result);
            $("#listTable tbody").html(html);
        },
    };
    // 操作处理
    var action = {


    };
    //  数据加载器
    var loader = {
        loadData:function(allParams){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("organize/getOrganizeList"),
                data:allParams,
                dataType: "json",
                success: function(result) {
                    console.log(result)
                    renders.builderRows(result);
                }
            });
        },
        //页码
        count:function(callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("organize/getOrganizeCount"),
                data:{
                    utype:1
                },
                dataType: "json",
                success: function(result) {
                    callback(result)
                }
            });
        },
        //删除
        del:function(id,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("organize/delCompany"),
                data:{
                    id:id,
                },
                dataType: "json",
                success: function(result) {
                    callback(result)
                }
            });
        },
        //添加企业号
        addOrganize:function(params,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("organize/addCompany"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callback(result)
                }
            });
        },
        //修改企业号
        updateCompany:function(params,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("organize/updateCompany"),
                data:params,
                dataType: "json",
                success: function(result) {
                    callback(result)
                }
            });
        },
        //查询单个企业号信息
        getCompanyById:function(id,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("organize/getCompanyById"),
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
            //查询
            $("#queryImgListBtn").on("click",function(){
                //分页器
                var userQueryData = $('#queryImgListForm').serializeObject();
                $.extend(globalData.queryData,userQueryData);
                loader.count(function(result){
                    $("span.pager").Pager("init", result.data, globalData.page);
                });
            });
            //点击删除
            $("body").on('click','.del',function () {
                var id = $(this).parent().parent().attr('data-id');
                $(".confirmDelete").attr('data-id',id);
            });
            $("body").on('click','.confirmDelete',function () {
                var id = $(this).attr('data-id');
                console.log(id)
                loader.del(id,function (result) {
                    if(result.statusCode == 0){
                        toastr.success('删除企业号成功');
                        $("#confirmModal").modal('hide');
                        $("#queryImgListBtn").trigger("click");
                    }else{
                        toastr.warning('删除企业号失败');
                    }
                })
            });
            //添加企业号
            //点击添加初始化
            $('body').on('click','#addAccount',function () {
                $("#addModal input[name='name']").val('');
                $("#addModal input[name='userName']").val('');
                $("#addModal input[name='password']").val('');
                $("#addModal textarea[name='remark']").val('');
                $("#addModal").find("input").css({
                    borderColor:'#c2cad8'
                });
            });
            $("body").on('click','#saveAdd',function () {
                var name = $("#addModal input[name='name']").val();
                var userName = $("#addModal input[name='userName']").val();
                var password = $("#addModal input[name='password']").val();
                var remark = $("#addModal textarea[name='remark']").val();
                var params = {
                    name:name,
                    userName:userName,
                    password:password,
                    remark:remark,
                    logo:'',
                    otype:1,
                };
                if(/^[a-zA-Z0-9]{1,14}$/.test(userName)){

                }else{
                    $("#addModal").find("input[name='userName']").val("请填写正确格式的登录账号");
                    $("#addModal").find("input[name='userName']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }
                if(/^[a-zA-Z0-9]{4,14}$/.test(password)){

                }else{
                    $("#addModal").find("input[name='password']").val("请填写正确格式的登录密码");
                    $("#addModal").find("input[name='password']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }
                if(name == '' || name == '请填写企业号名称'){
                    $("#addModal").find("input[name='name']").val("请填写企业号名称");
                    $("#addModal").find("input[name='name']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else if(userName == '' || userName == '请填写登录账号' ){
                    $("#addModal").find("input[name='userName']").val("请填写登录账号");
                    $("#addModal").find("input[name='userName']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else if(password == '' || password == '请填写登录密码' ){
                    $("#addModal").find("input[name='password']").val("请填写登录密码");
                    $("#addModal").find("input[name='password']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else{
                    loader.addOrganize(params,function (result) {
                        if(result.statusCode == 0){
                            toastr.success('添加企业号成功');
                            $("#addModal").modal('hide');
                            $("#queryImgListBtn").trigger("click");
                        }else{
                            toastr.warning('添加企业号失败');
                        }
                    })
                }
            });
            //编辑企业号
            $("body").on('click','.edit',function () {
                var id = $(this).parent().parent().attr('data-id');
                loader.getCompanyById(id,function (result) {
                    console.log(result);
                    $("#editModal input[name='name']").val(result.data.Name);
                    $("#editModal input[name='userName']").val(result.data.UserName);
                    $("#editModal input[name='password']").val(result.data.PassWord);
                    $("#editModal textarea[name='remark']").val(result.data.Remark);
                })
                $("#editModal #saveEdit").attr('data-id',id);
            });
            $("body").on('click','#editModal #saveEdit',function () {
                var id = $(this).attr('data-id');
                var name = $("#editModal input[name='name']").val();
                var userName = $("#editModal input[name='userName']").val();
                var password = $("#editModal input[name='password']").val();
                var remark = $("#editModal textarea[name='remark']").val();
                var params = {
                    id:id,
                    name:name,
                    userName:userName,
                    password:password,
                    remark:remark,
                    tel:'',
                    addrees:'',
                    x:'',
                    y:'',
                    logo:'',
                    bannerImg:'',
                };
                if(/^[a-zA-Z0-9]{1,14}$/.test(userName)){

                }else{
                    $("#editModal").find("input[name='userName']").val("请填写正确格式的登录账号");
                    $("#editModal").find("input[name='userName']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }
                if(/^[a-zA-Z0-9]{4,14}$/.test(password)){

                }else{
                    $("#editModal").find("input[name='password']").val("请填写正确格式的登录密码");
                    $("#editModal").find("input[name='password']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }
                console.log(params)
                if(name == '' || name == '请填写企业号名称'){
                    $("#editModal").find("input[name='name']").val("请填写企业号名称");
                    $("#editModal").find("input[name='name']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else if(userName == '' || userName == '请填写登录账号' ){
                    $("#editModal").find("input[name='userName']").val("请填写登录账号");
                    $("#editModal").find("input[name='userName']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else if(password == '' || password == '请填写登录密码' ){
                    $("#editModal").find("input[name='password']").val("请填写登录密码");
                    $("#editModal").find("input[name='password']").css({
                        color:'red',
                        borderColor:'red'
                    });
                    return
                }else{
                    loader.updateCompany(params,function (result) {
                        if(result.statusCode == 0){
                            toastr.success('编辑企业号成功');
                            $("#editModal").modal('hide');
                            $("#queryImgListBtn").trigger("click");
                        }else{
                            toastr.warning('编辑企业号失败');
                        }
                    })
                }
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
        $("#queryImgListBtn").trigger("click");

    };
}