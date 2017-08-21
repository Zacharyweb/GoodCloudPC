/**
 * Created by Spring on 2017/3/17.
 */
//业务js参考模板
var AppAccMgmt = function() {
    var module = this;

    //region 模块数据全局缓存数据
    var globalData = {
        page: {
            callback: function (index, params) {
                var allParams = $.extend({}, params, {pageIndex: index, pageSize: globalData.page.pagesize});
                loader.loadData(allParams);
                console.log("回调");
            },
            getparams: function () {
                return {
                    companyName: $("#text").val()
                }
            },
            pagesize: 10,
            showpage: 6,
        },
        data: {},
    }
    //endregion

    //region ui绘制
    var renders = {
        builderRows: function (result) {
            var html = template("dataTmpl", {data: result});
            $("#dataTable tbody").html(html);
        }
    }
    //endregion

    //region 操作处理
    var action = {}
    //endregion

    //region 数据加载器
    var loader = {
        loadData: function () {
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("organize/getOrganizeUserList"),
                data: {},
                dataType: "json",
                success: function (result) {
                    debugger;
                    var newResult = [];
                    $.each(result.data, function (i, item) {
                        if (item.Utype != 0) {
                            newResult.push(item);
                        }
                    })
                    renders.builderRows(newResult);
                }
            });
        },
        save: function (obj, callback) {
            $.ajaxAuthor({
                type: "post",
                url: obj.id == 0 ? urlFunc.format("organize/createOrgainzeUser") : urlFunc.format("organize/updateOrganizeUser"),
                data: obj,
                dataType: "json",
                success: function (result) {
                    callback(result);
                }
            });
        },
        single: function (id, callback) {
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("organize/getCompanyById"),
                data: {id: id},
                dataType: "json",
                success: function (result) {
                    callback(result);
                }
            });
        },
        del: function (id, callback) {
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("organize/delOrganizeUser"),
                data: {id: id},
                dataType: "json",
                success: function (result) {
                    callback(result);
                }
            });
        }
    };
    //endregion

    //region 事件注册
    var events = {
        uiEvent: function () {

            $("#addForm").validate({
                rules: {
                    nickName: "required",
                    tel: "required"
                },
                ignore: "",
                messages: {
                    nickName: "昵称必须填写",
                    tel: "注册手机号必须填写"
                },
                submitHandler: function () {
                    if ($("#addForm").valid()) {
                        var obj = $("#addForm").serializeObject();
                        loader.save(obj, function (result) {
                            if (result.statusCode == 0) {
                                $("#addAccount").modal("hide");
                                loader.loadData();
                            } else {
                                toastr.error(result.errorMsg);
                            }
                        })
                    }
                    return false;
                }

            });
            $("#save").on("click", function () {
                $("#addForm").submit();
            });
            $("#add").on("click", function () {
                $("#addForm")[0].reset();
                $("#addAccount").modal();
            });
            $("#dataTable tbody").on("click", '[data-func="edit"]', function () {
                var $this = $(this);
                var $tr = $this.parents("tr");
                var id = $tr.attr("data-id");
                $("#addAccount").modal();
                var obj = {
                    id: id,
                    nickName: $tr.find(".table-td-name").html(),
                    tel: $tr.find(".table-td-phone").html(),
                    remark: $tr.find(".table-td-remark").html(),
                }
                var $from = $("#addForm");
                for (var item in obj) {
                    if (obj.hasOwnProperty(item)) {
                        var value = obj[item];
                        $from.find("[name='" + item + "']").val(value);
                    }
                }
            });
            $("#dataTable tbody").on("click", '[data-func="del"]', function () {
                var $this = $(this);
                var $tr = $this.parents("tr");
                var id = $tr.attr("data-id");
                if (confirm("确认删除此条信息？")) {
                    loader.del(id, function (data) {
                        loader.loadData();
                    });
                }

            });
        }
    };
    //endregion

    //region 公开方法

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
        loader.loadData();
    };
}
    //endregion

