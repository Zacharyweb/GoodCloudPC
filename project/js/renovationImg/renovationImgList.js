/**
 * Created by Zachary on 2017/4/11.
 */
var RenovationImgList = function() {
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
            pagesize: 5,
            showpage: 5,
        },
        activityId:0,
        data:{},
        queryData:{
            remark:'',
            space:'',
            style:'',
            part:''
        }
    };
    //endregion
    //region ui绘制
    var renders = {
        builderRows:function(result){
            $.each(result.data,function(i,obj){
                 if(obj.src){
                    var imgSrc = urlFunc.imgFormat(obj.src,80,80);
                    obj.imgSrc = imgSrc;
                 }
            });
            var html = template("renovationImgTemp",result);
            $("#imgListTable tbody").html(html);
            $('.toggle-disab').prop('disabled',true);
        },
        //渲染关联类目
        builderTags:function(targetWrapper,result){
            var html = template("classifyTagTemp",result);
            $(targetWrapper).html(html);
        },
        //渲染查询下拉选择框
        builderSelects:function(targetSelect,result){
            $.each(result.data,function(i,obj){
                obj.value = obj.id + '|' + obj.name
            });
            var name;
            switch(targetSelect) {
                case '#tagsSelect0':
                    name = '请选择空间';
                    break;
                case '#tagsSelect1':
                    name = '请选择风格';
                    break;
                case '#tagsSelect2':
                    name = '请选择局部';
                    break;
            };
            result.data.unshift({name:name,value:''});
            var html = template("optionTemp",result);
            $(targetSelect).html(html);
        },
    };
    //endregion
    //region 操作处理
    var action = {
        //获取被选中的图片条目id
        getCheckedImgItem:function(){
            var checkedItemList = [];
            $("#imgListTable input:checked").each(function(){
                checkedItemList.push($(this).val());
            });
            var ids = checkedItemList.join(',');//转换为逗号隔开的字符串
            return ids;
        },
        checkTags:function(targetCheckBox,targetAllCheck){
            var chknum = targetCheckBox.size();//选项总个数
            var chk = 0;
            targetCheckBox.each(function () {  
                if($(this).prop("checked")==true){
                    chk++;
                }
            });
            if(chknum==chk){//全选
                targetAllCheck.prop("checked",true);
            }else{//不全选
                targetAllCheck.prop("checked",false);
            }
        },
        getCheckedTag:function(target){
            var checkedTagList = [];
            $(target).find("input:checked").each(function(){
                var str = $(this).val() + '|' + $(this).data('name');
                checkedTagList.push(str);
            });
            var concatVal = checkedTagList.join(',');//转换为逗号隔开的字符串
            console.log(concatVal);
            return concatVal;
        }
    };
    //region 数据加载器
    var loader = {
        loadData:function(params){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/tuku/getList"),
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
                url: urlFunc.format("api/tuku/getCount"),
                data: globalData.queryData,
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
        //获取分类数据
        loadClassify:function(type,tagsWrapper,tagsSelect){
              $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("/api/tuku/getCategories"),
                data: {categoryType:type,pageIndex:1,pageSize:1000},
                dataType: "json",
                success: function (result) {
                     renders.builderTags(tagsWrapper,result);
                     renders.builderSelects(tagsSelect,result);
                }
            });
        },
         // 单条置顶/取消置顶
        top:function(param){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/tuku/setTop"),
                data: param,
                dataType: "json",
                success: function(result) {
                    $("#queryImgListBtn").trigger("click");
                },
                error: function(xhr, msg, ex) {
                  console.log(msg);
                }
            });
        },
        // 删除图片
        deleteImg:function (param,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/tuku/del"),
                data: param,
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
        //关联类目
        linkClass:function(param){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/tuku/relation"),
                data: param,
                dataType: "json",
                success: function(result) {
                    $(".modal").modal("hide"); 
                    $("#queryImgListBtn").trigger("click");
                },
                error: function(xhr, msg, ex) {
                  console.log(msg);
                }
            });
        },
    };
    //endregion
    //region 事件注册
    var events = {
        uiEvent: function() {
            //查询
            $("#queryImgListBtn").on("click",function(){
                var userQueryData = $('#queryImgListForm').serializeObject();
                $.extend(globalData.queryData,userQueryData);
                loader.count(function(result){
                    $("#imgListPager").Pager("init",result.data, globalData.page);
                });
            });
           //单条置顶
            $("#imgListTable tbody").on("click",'[data-func="toTop"]',function(){
                var id = $(this).parents('tr').data('imgItemId');
                var nowTop = $(this).parents('tr').data('top');
                var top = nowTop == '0'? 1 : 0;
                loader.top({ id:id, top:top});
            });
      
            //删除单条
            $("#imgListTable tbody").on("click",'[data-func="delete"]',function(){
                 var imgItemId = {
                    ids:$(this).parents('tr').data('imgItemId')
                 };
                 $('[data-func="confirmDelete"]').off("click").on("click",function(){
                    loader.deleteImg(imgItemId,function(result){
                        if(result.statusCode == 0){
                            toastr.success('删除成功');
                            $("#confirmModal").modal("hide");
                            $("#queryImgListBtn").trigger("click");
                        }else{
                            toastr.warning('删除失败');
                        }
                    });
                 }); 
            });
            //删除多条
            $('#deleteImgItems').on("click",function(){
                var ids = action.getCheckedImgItem();
                var imgItemId = { ids:ids };
                $('[data-func="confirmDelete"]').off("click").on("click",function(){
                    loader.deleteImg(imgItemId,function(result){
                        if(result.statusCode == 0){
                            toastr.success('删除成功');
                            $("#confirmModal").modal("hide");
                            $("#queryImgListBtn").trigger("click");
                        }else{
                            toastr.warning('删除失败');
                        }
                    });
                 }); 
            });
            // 全选图片列表
            $('#checkAllItems').on("click",function(){
                $('#imgListTable input[type="checkbox"]').prop("checked", true); 
                action.getCheckedImgItem();
                $('.toggle-disab').prop('disabled',false);

            });
            // 取消选择
            $('#cancelCheckAllItems').on("click",function(){
                $('#imgListTable input[type="checkbox"]').prop("checked", false); 
                $('.toggle-disab').prop('disabled',true);
            });
            //单击单个checkBox
            $("#imgListTable tbody").on("click",'input[type="checkbox"]',function(){
                var ids = action.getCheckedImgItem();
                if(ids){
                    $('.toggle-disab').prop('disabled',false);  
                }
                else{
                    $('.toggle-disab').prop('disabled',true);
                };
            });
            //关联类目
            $('[data-func="saveRelation"]').on('click',function(){
                var target = $(this).data('for');
                var type = $(this).data('type');
                console.log(target);
                var concatVal = action.getCheckedTag(target);
                var ids =  action.getCheckedImgItem();
                var params = {ids:ids,categoryType:type,concatVal:concatVal};
                console.log(params);
                loader.linkClass(params);
            });
            //全选/取消全选tags
            $('[data-func="checkedAllTags"]').on('click',function(){
                var targetModal = $(this).parents('.modal-dialog');
                var targetCheckBox = targetModal.find('input[type="checkbox"]');
                if (this.checked) {
                    targetCheckBox.prop("checked", true);
                } else {
                    targetCheckBox.prop("checked", false);
                }
                action.getCheckedTag();
            });
            //单击单个Tag的checkbox
            $('.modal-footer').on('click','.tag-checkbox',function(){
                 var targetModal = $(this).parents('.modal-dialog');
                 var targetCheckBox = targetModal.find('input[type="checkbox"]');
                 var targetAllCheck = targetModal.find('[data-func="checkedAllTags"]');
                 action.checkTags(targetCheckBox,targetAllCheck);
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
        //初始化关联类目模态框 及 查询下拉框 
        for(var i = 0; i <= 2; i++){
            loader.loadClassify(i,'#tagsWrapper'+ i,'#tagsSelect'+i);
        }
        $("#queryImgListBtn").trigger("click");
        
    };
}
