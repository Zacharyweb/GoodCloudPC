/**
 * Created by Spring on 2017/5/16.
 */
var pano=(function(embedpano){
    var kr=null;
    var setting={};
    //region 初始化
    var init=function(params){
        var defaults={
            xmlpath:"",
            target: "pano",
            onAddHot:function(name,atv,ath){
                console.log("添加了--,name:"+name+",atv:"+atv+",ath:"+ath);
            },
            onHotClick:function(name){
                console.log("点击了"+name);
            },
            onHotDelete:function(name){
                console.log("删除了"+name);
            },
            onHotMoveEnd:function(name,atv,ath){
                console.log("移动了"+name);
            },
            normalIcon:"http://image.yetong.org/panos/config/normal.png",
            focusIcon:"http://image.yetong.org/panos/config/focus.png",
            closeIcon:"http://image.yetong.org/panos/config/close.png",
            editmod:true
        }
        setting=Object.assign({},defaults,params);;
        embedpano({
            xml: setting.xmlpath,
            target: setting.target,
            html5: "only",
            mobilescale: 1.0,
            passQueryParameters: true
        });
        kr=document.getElementById("krpanoSWFObject");
        kr.call("startup");
    }
    //endregion

    //region 操作方法
    var hotsnot={
        unfocus:function(){
            var arr=kr.get("hotspot").getArray();
            for(var i=0;i<arr.length;i++){
                var item =arr[i];
                if(item.name.indexOf("_close")!=-1){
                    this.del(item.name);
                    var realEleName=item.name.replace("_close","");
                    var realEle=kr.get("hotspot["+realEleName+"]");
                    hotsnot.add(realEleName,setting.normalIcon,20,20,realEle.atv,realEle.ath)
                }
            }
        },
        addClose:function(name,url,width,height,atv,ath){
            width=width?width:20;
            height=height?height:20;
            url=url?url:setting.closeIcon;
            kr.call("addHot("+name+"_close,"+ath+","+atv+","+url+","+width+","+height+")");
        },
        add:function(name,url,width,height,atv,ath){
            //hotsnot.del(name+"_close");
            width=width?width:20;
            height=height?height:20;
            url=url?url:setting.normalIcon;

            kr.call("addHot("+name+","+ath+","+atv+","+url+","+width+","+height+")");

        },
        del:function(name){
            if(!setting.editmod)return;
            kr.call("delHot("+name+")");
        },
        click:function(name){
            if(!setting.editmod){
                setting.onHotClick(name);
                return;
            }
            if(name.indexOf("_close")!=-1){
                hotsnot.del(name);
                hotsnot.del(name.replace("_close",""));
                setTimeout(function(){
                    setting.onHotDelete(name.replace("_close",""));
                },300)
            }else{
                if(kr.get("hotspot["+name+"_close]")==null){
                    hotsnot.unfocus();
                    var current=kr.get("hotspot["+name+"]");
                    var ath=current.ath;
                    var atv=current.atv;
                    hotsnot.add(name,setting.focusIcon,50,50,atv,ath);
                    hotsnot.addClose(name,setting.closeIcon,20,20,atv-7,ath-7);
                }
                if(setting.onHotClick){
                    setting.onHotClick(name);
                }
            }
        },
        pos:function (name, ath, atv) {
            if(!setting.editmod)return;
            if(name.indexOf("_close")!=-1){
                hotsnot.add(name.replace("_close",""),setting.focusIcon,50,50,parseFloat(atv)+5,parseFloat(ath)+3);
            }else{
                hotsnot.unfocus();
                var current=kr.get("hotspot["+name+"_close]");
                hotsnot.add(name,setting.focusIcon,50,50,atv,ath)
                hotsnot.addClose(name,setting.closeIcon,20,20,atv-7,ath-4)
            }
            setting.onHotMoveEnd(name.replace("_close",""),atv,ath);
        },
        getCurrent:function () {
            if(!setting.editmod)return;
            var arr=kr.get("hotspot").getArray();
            for(var i=0;i<arr.length;i++){
                var item =arr[i];
                if(item.name.indexOf("_close")!=-1){
                    var realEleName=item.name.replace("_close","");
                    var realEle=kr.get("hotspot["+realEleName+"]");
                    return {
                        name:realEleName,
                        atv:realEle.atv,
                        ath:realEle.ath
                    }
                }
            }
        }
    };
    var vr={
        enter:function(){
            kr.call("webvr.enterVR()");
        }
    }
    //endregion

    return {
        init:init,
        change : function(xmlpath) {
            kr.call("loadpano(" + xmlpath + ", null, MERGE, BLEND(1));");
            kr.call("startup");
        },
        getVR:function(){
            return kr;
        },
        enterVR:vr.enter,
        addHot:function(name,url,width,height,atv,ath){
            if(!setting.editmod)return;
            hotsnot.del(name);
            atv= atv?atv:kr.get("view.vlookat");
            ath= ath?ath:kr.get("view.hlookat");
            hotsnot.add(name,url,width,height,atv,ath);
            setting.onAddHot(name,atv,ath);
        },
        delHot:hotsnot.del,
        hotClick:hotsnot.click,
        pos:hotsnot.pos,
        getCurrent:hotsnot.getCurrent,
        OpenRedpack : function() {
        },
        ChangeCallback : function() {

        }
    }
})(window.embedpano)
window.pano=pano;