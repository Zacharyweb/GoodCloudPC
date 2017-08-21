/**
 * Created by Administrator on 2017/3/18.
 */
var createActivity = function() {
    var module = this;
    //模块数据全局缓存数据
    //region 模块数据全局缓存数据
    var globalData = {
        map:null,
        id:0
    }
    //endregion
    //ui绘制
    var renders = {
        creatModel:function () {
            var html= template("createModelTmpl",{});
            globalData.container.html(html);
            this.creatMap();
        },
        creatMap:function () {
            var map = new BMap.Map("allmap");
            map.centerAndZoom("杭州",12);
            map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
            map.enableContinuousZoom();
            globalData.map = map;
        }
    }
    // 操作处理
    var action = {
        addAct :function () {
            //表单验证
            if(!$("#addForm").validate().form()){
                return false;
            }
            var defaultData = {
                relBeginTime :111,
                relEndTime:111,
                x:-1,
                y:-1
            }
            var data = $("#addForm").serializeObject(defaultData);
            data.id=globalData.id;
            data.relBeginTime = new Date(data.relBeginTime).getTime();
            data.relEndTime = new Date(data.relEndTime).getTime();
            debugger
            $.ajaxAuthor({
                url: urlFunc.format('api/activity/createActivity'),
                dataType:'json',
                type:'post',
                data:data,
                success:function(result){
                    toastr.success("保存成功！")
                    globalData.container.parent().modal('hide');
                    location.reload();
                }
            });
        },
        mapClick:function () {
            var map = globalData.map;
            if(!map){
                return false;
            }
            var geoc = new BMap.Geocoder();
            map.addEventListener("click", function(e){
                var pt = e.point;
                geoc.getLocation(pt, function(rs){
                    /*var allOverlay = map.getOverlays();
                    if(allOverlay[0]){
                        map.removeOverlay(allOverlay[0]);
                    }*/
                    map.centerAndZoom(pt, 16);
                    // map.addOverlay(new BMap.Marker(pt));
                    globalData.container.find("[name=address]").val(rs.address);
                    globalData.container.find("[name=x]").val(rs.point.lat);
                    globalData.container.find("[name=y]").val(rs.point.lng);
                });
            });
            globalData.container.on("change","[name=address]",function(){
                geoc.getPoint($(this).val(), function(point){
                    if (point) {
                        /*var allOverlay = map.getOverlays();
                        if(allOverlay[0]){
                            map.removeOverlay(allOverlay[0]);
                        }*/
                        map.centerAndZoom(point, 16);
                        map.addOverlay(new BMap.Marker(point));
                        geoc.getLocation(pt, function(rs){
                            globalData.container.find("[name=x]").val(rs.point.lat);
                            globalData.container.find("[name=y]").val(rs.point.lng);
                        });
                    }else{
                        toastr.error("您选择地址没有解析到结果!");
                    }
                },"杭州");
            })
        },
        getDatail:function (params) {
            globalData.container.setParams(params);
        }
    }
    //  数据加载器
    var loader = {
        loadData:function(){
        }
    };

    //事件注册
    var events = {
        uiEvent: function() {
            if(globalData.data){ action.getDatail(globalData.data); }
            globalData.container.find("[name=relBeginTime]").datetimepicker({
                lang: 'ch',
                format: 'Y-m-d H:i',
                step:5,
                timepicker: true,
                readonly: true,
                clearButton: true,
                //失去焦点不赋值
                validateOnBlur: false,
                //禁用滚动
                scrollInput: false
            });
            globalData.container.find("[name=relEndTime]").datetimepicker({
                lang: 'ch',
                format: 'Y-m-d H:i',
                step:5,
                timepicker: true,
                BeforeSelectData: function (a, b, c) {
                    if (new Date(c) < new Date($('[name=relBeginTime]').val())) {
                        toastr.error("结束时间不能小于开始时间", false);
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
            action.mapClick();
        },
        scrollEvent:function(){

        }
    };

    /**begin 公开方法**/

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
        console.log( globalData.name);

        renders.creatModel();
        events.uiEvent();
    };

    // 发生事件
    this.openEvent = {
        //触发查询数据库事件的接口
        onSelectEnd: function() {

        }
    }
    //处理事件
    this.handleEvent = {
        //其他模块通过这个方法来控制这个组件的行为
        doQuery:function(param){
            console.log("查询数据库")
        }
    }

    this.save = function () {
        action.addAct();
    }
    /**end 公开方法**/
}
