/**
 * Created by Administrator on 2017/3/18.
 */

var ActivityMgmt = function () {
    var module = this;
    //模块数据全局缓存数据
    //region 模块数据全局缓存数据
    var globalData = {
        page: {
            callback: function (index, params) {
                var allParams = $.extend({ascending: false, sortKey: "CreateTime"}, params, {
                    pageIndex: index,
                    pageSize: globalData.page.pagesize
                });
                if (allParams.relBeginTime != -1) allParams.relBeginTime = new Date(allParams.relBeginTime).getTime();
                if (allParams.relEndTime != -1) allParams.relEndTime = new Date(allParams.relEndTime).getTime();
                loader.loadData(allParams);
            },
            getparams: function () {
                var defaultData = {relBeginTime: -1, relEndTime: -1,};
                var searchdata = $("#SearchForm").serializeObject(defaultData);
                if (searchdata.relBeginTime != -1) searchdata.relBeginTime = new Date(searchdata.relBeginTime).getTime();
                if (searchdata.relEndTime != -1) searchdata.relEndTime = new Date(searchdata.relEndTime).getTime();
                return searchdata;
            },
            pagesize: 10,
            showpage: 6,
        },
        data: {},
        creatobj: null,
    }
    //endregion
    //ui绘制
    var renders = {
        builderRows: function (result) {
            $.each(result.data,function(i,item){
                item["qrShowUrl"]=urlFunc.imgFormat(item["qrUrl"]) ;
                //item.statusDesc;
                if(item.isStop){
                    item.statusDesc="已终止";
                }else{
                    if(item.status==1){
                        item.statusDesc="已暂停";
                    }else if( new Date(item.relEndTime)<new Date()){
                        item.statusDesc="已结束"
                    }else{
                        item.statusDesc="进行中";
                    }
                }
            })
            var html = template("activityMgmtTmpl", result);
            $("#activityMgmtTable tbody").html(html);
        }
    }
    // 操作处理
    var action = {
        // 暂停 删除
        modifyState: function (params) {
            debugger;
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("api/activity/modifyState"),
                data: params,
                dataType: "json",
                success: function (result) {
                    toastr.success("操作成功");
                    $("#searchBtn").trigger("click");
                },
                error: function (xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        // 编辑
        edit: function (params) {
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/activity/getSimgle"),
                data: params,
                dataType: "json",
                success: function (result) {
                    $("#singleOptionModal").modal("show");
                    var createAct = new createActivity();
                    createAct.create({container: $('#singleOptionModal').find(".modal-body"), data: result.data, id: params.activityId});
                    globalData.creatobj = createAct;
                },
                error: function (xhr, msg, ex) {
                    console.log(ex);
                }
            });

        },
        modal: function () {
            if (globalData.pattern == "window") {
                $("#createActivity").hide();
                $(".table").find('[data-func="enterTask"]').click(function(){
                    var dataId= $(this).attr("data-id");
                    window.parent.modalCallback(dataId);
                }).attr("href","javascript:void(0)").html("进入");

                $(".table").find("tr").each(function (i, item) {
                    $(item).find("[data-func='stop'],[data-func='edit'],[data-func='delete']").hide();
                    $(item).find("th,td").each(function (j, jitem) {
                        switch (j) {
                            case 0:
                            case 1:
                            case 5:
                            case 7:
                            case 8:
                                $(jitem).hide();
                        }
                    })
                })
            }
        }
    }
    //  数据加载器
    var loader = {
        loadData: function (params) {
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/activity/getActivities"),
                data: params,
                dataType: "json",
                success: function (result) {
                    renders.builderRows(result);
                    action.modal();
                }
            });
        },
        count: function (callback) {
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("api/activity/getActivityCount"),
                data: globalData.page.getparams(),
                dataType: "json",
                success: function (result) {
                    callback(result);
                }
            });
        },
    };

    //事件注册
    var events = {
        uiEvent: function () {
            // enter键查询
            $("#SearchForm").on('keydown', 'input', function (e) {
                if (e.keyCode == 13) {
                    $("#searchBtn").trigger("click");
                }
            });

            // 查询
            $("#searchBtn").on("click", function () {
                loader.count(function (result) {
                    $("span.pager").Pager("init", result.data, globalData.page);
                });
            })
            //暂停
            $("#activityMgmtTable tbody").on("click", '[data-func="repause"]', function () {
                var params = {activityId: $(this).closest("tr").attr("activityId"), state: 0};
                $(this).hide();
                $(this).closest("tr").find('[data-func="pause"]').show();
                action.modifyState(params);
            });
            //暂停
            $("#activityMgmtTable tbody").on("click", '[data-func="pause"]', function () {
                var params = {activityId: $(this).closest("tr").attr("activityId"), state: 1};
                $(this).hide();
                $(this).closest("tr").find('[data-func="repause"]').show();
                action.modifyState(params);
            });
            //编辑
            $("#activityMgmtTable tbody").on("click", '[data-func="edit"]', function () {
                var params = {activityId: $(this).closest("tr").attr("activityId")};
                action.edit(params);
            });
            //删除
            $("#activityMgmtTable tbody").on("click", '[data-func="delete"]', function () {
                var params = {activityId: $(this).closest("tr").attr("activityId"), state: -1};
                action.modifyState(params);
            });

            // 创建活动
            $('#singleOptionModal').on('show.bs.modal', function () {
                var createAct = new createActivity();
                createAct.create({container: $('#singleOptionModal .modal-body')});
                globalData.creatobj = createAct;
            });
            $('#singleOptionModal').on('hidden.bs.modal', function () {
                createAct = null;
                globalData.creatobj = null;
            });

            // 添加品类保存
            $("#saveCategory").on("click", function () {
                globalData.creatobj.save();
            })
            // 时间控件
            $('[name=relBeginTime]').datetimepicker({
                lang: 'ch',
                format: 'Y-m-d H:i',
                step: 5,
                timepicker: true,
                readonly: true,
                clearButton: true,
                //失去焦点不赋值
                validateOnBlur: false,
                //禁用滚动
                scrollInput: false
            });
            $('[name=relEndTime]').datetimepicker({
                lang: 'ch',
                format: 'Y-m-d H:i',
                step: 5,
                timepicker: true,
                BeforeSelectData: function (a, b, c) {
                    if (new Date(c) < new Date($('[name=relBeginTime]').val())) {
                        toastr.warning("结束时间不能小于开始时间");
                        return false;
                    }
                    return true;
                },
                readonly: true,
                clearButton: true,
                //失去焦点不赋值
                validateOnBlur: false,
                //禁用滚动
                scrollInput: false
            });
        },
        scrollEvent: function () {

        }
    };

    /**begin 公开方法**/

    //初始化模块
    this.create = function (options) {
        //合并配置
        for (var item in options) {
            if (options.hasOwnProperty(item)) {
                globalData[item] = options[item];
            }
        }
        //初始化事件
        for (var item in events) {
            if (events.hasOwnProperty(item)) {
                events[item]();
            }
        }
        console.log(globalData.name);

        $("#searchBtn").trigger("click");
    };

    // 发生事件
    this.openEvent = {
        //触发查询数据库事件的接口
        onSelectEnd: function () {

        }
    }
    //处理事件
    this.handleEvent = {
        //其他模块通过这个方法来控制这个组件的行为
        doQuery: function (param) {
            console.log("查询数据库")
        }
    }
    /**end 公开方法**/
}