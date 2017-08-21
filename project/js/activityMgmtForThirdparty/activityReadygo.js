/**
 * Created by Spring on 2017/3/21.
 */
var activityReadygo=(function(){
    var redirect=function(id){
        var href=location.href;
        globalDataCache.set("selectActivityId",id);
        if(href.indexOf("?")!=-1){
            location.href=href.replace(/id=\d+/g,"")+"&id="+id;
        }else{
            location.href=href+"?id="+id;
        }
    }
    window.modalCallback=function(id){
        redirect(id);
    }
    var createModalWin =function(){
        var html =[];
        html.push('<div class="modal fade bs-example-modal-lg" id="chooseActivity" role="dialog" aria-labelledby="myLargeModalLabel" tabindex="-1" >');
        html.push(' <div class="modal-dialog modal-lg" style="width: 1020px"  role="document">');
        html.push('     <div class="modal-content">');
        html.push('         <div class="modal-header ui-draggable-handle">');
        html.push('             <button type="button" class="close" data-dismiss="modal" aria-hidden="false"></button>');
        html.push('             <h4 class="modal-title">选择活动</h4>');
        html.push('         </div>');
        html.push('         <div class="modal-body">');
        html.push('             <iframe frameborder="none" src="activityMgmt.html?pattern=window" width="1000" height="600"></iframe>');
        html.push('         </div>');
        html.push('         <div class="modal-footer">');
        html.push('         </div>');
        html.push('      </div>');
        html.push('  </div>');
        html.push(' </div>');
        $(html.join(" ")).appendTo("body");
    }
    $("#changeActivity").on('click',function(){
        $("#chooseActivity").modal();
    });
    return {
        ready:function(callback){
            createModalWin();
            var id=$.getUrlParam("id");
            if(!id){
                var cacheActivityId=globalDataCache.get("selectActivityId");
                if(cacheActivityId&&cacheActivityId!="undefined"){
                    redirect(cacheActivityId);
                    return;
                }
                $.ajaxAuthor({
                    type: "get",
                    url: urlFunc.format("api/activity/getTop2"),
                    data:{},
                    dataType: "json",
                    success: function (result) {
                        //result.data=[];
                        if(result.data.length==1){
                            //globalDataCache.set("selectActivityId",result.data[0].Id);
                            redirect(result.data[0].Id);
                        }else if(result.data.length==0){
                            toastr.warning("你还没有创建任何活动？即将跳转到活动管理页面");
                            setTimeout(function(){
                                location.href="../../views/thirdparty/activityMgmt.html";
                            },3000);
                            return;
                        }else{
                            $("#chooseActivity").modal();

                        }
                    }
                });
            }else{
                callback(id)
            }

        }
    }
})();