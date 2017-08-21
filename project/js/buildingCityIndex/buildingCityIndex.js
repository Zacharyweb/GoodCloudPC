
var BuildingCityIndex = function() {
    var module = this;
    //region 模块数据全局缓存数据
    var renders = {
        buildingCity:function(result){
            var html= template("buildingCity",result);
            $("#buildingContent").html(html);
        },
        getNotice:function (result) {
            var html= template("notice",result);
            $("#isNotice").html(html);
        }
    };
    // 操作处理

    //region 数据加载器
    var loader = {
        building:function(callback){
            $.ajaxAuthor({
                type: "get",
                url: urlFunc.format("organize/getOrganizeDetail"),
                data:{},
                dataType: "json",
                success: function(result) {
                    callback(result)
                },
                error: function(xhr, msg, ex) {
                    console.log(ex);
                }
            });
        },
        addNotice:function(notice,callback){
            $.ajaxAuthor({
                type: "post",
                url: urlFunc.format("organize/setNotice"),
                data:{notice:notice},
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
    //endregion

    //region 事件注册
    var events = {
        uiEvent: function() {
            $('body').on('click','#keep2',function () {
                var text = $('.textarea textarea').val()
                loader.addNotice(text,function (result) {
                   /* console.log('公告',result[0].statusCode);*/
                    if(result.statusCode == 0){
                         toastr.success('发布公告成功');
                         $("#add").modal('hide');
                        loader.building(function (result) {
                            result.data.logo = urlFunc.imgFormat(result.data.logo,320,160);
                            console.log(result);
                            renders.buildingCity(result);
                            renders.getNotice(result)
                        });
                    }else{
                        toastr.warning('发布公告失败')
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
        loader.building(function (result) {
            result.data.logo = urlFunc.imgFormat(result.data.logo,320,160);
            console.log(result);
            renders.buildingCity(result);
            renders.getNotice(result)
        });
    };
};



