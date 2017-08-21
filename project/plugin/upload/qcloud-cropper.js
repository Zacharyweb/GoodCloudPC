/**
 * Created by Spring on 2017/3/20.
 */

$.extend({
    imgUpload: function (opts,cos) {
        var uniqueId = "";
        var setting={};
        var $inputFile=null;
        var defaults = {/*
            otherFile:'video',
            otherFile:false,*/
            otherFile:null,//video or zip ……
            cropper: true,
            fixedWidth:null,
            fixedHeight:null,
            successCallback: function (relativePath) {
                console.log("这是最终返回的:"+relativePath);
            },
            errorCallBack:function(result){
                result = result || {};
                console.log('upload error...')
                $("#result").val(result.responseText || 'error');
            },
            progressCallBack:function(curr){
                console.log(curr);
            },
            cropperOpts: {
                aspectRatio: 16 / 9,
                autoCropArea:1,
                zoomable:false, //禁用鼠标滚轮放大缩小
                viewMode:1,//截图框只能在图片区域内移动
                crop: function(e) {

                }
            }
        }
        var helper={
            qCloundUpload:function(file,filename){
                cos.uploadFile(function (result) {
                    var prefix = "/" + config.appid + "/" + config.bucket;
                    var relativePath = result.data.resource_path.replace(prefix, "")
                    helper.evalCallbackEle(relativePath)
                    setting.successCallback(relativePath);
                }, setting.errorCallBack, setting.progressCallBack, config.bucket, (setting.otherFile=="video"?config.videoFolder:config.myFolder) + filename||file.name, file, 0);
            },
            evalCallbackEle:function(relativePath){
                if(setting.callbackEle){
                    $(setting.callbackEle).each(function(i,item){
                        switch(item.tagName){
                            case "IMG":
                                $(item).attr("src",urlFunc.imgFormat(relativePath));
                                break;
                            case "INPUT":
                                $(item).val(relativePath);
                                break;
                        }
                    })
                }
            },
            dataURLtoFile:function (dataurl, filename) {
                var arr = dataurl.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
                while(n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new File([u8arr], filename, { type: mime });
            },
            createModal:function(id,imgSrc){
                var html=[];
                html.push('<div class="modal fade bs-example-modal-lg" id="win_'+id+'" role="dialog" aria-labelledby="myLargeModalLabel" tabindex="-1" >');
                html.push(' <div class="modal-dialog modal-lg" style="width: 640px"  role="document">');
                html.push('     <div class="modal-content">');
                html.push('         <div class="modal-header ui-draggable-handle">');
                html.push('             <button type="button" class="close" data-dismiss="modal" aria-hidden="false"></button>');
                html.push('             <h4 class="modal-title">图片裁剪</h4>');
                html.push('         </div>');
                html.push('         <div class="modal-body">');
                html.push('             <div style="width: 600px;height:600px;">');
                html.push('                 <img  data-target="images" src="'+imgSrc+'" />');
                html.push('             </div>');
                html.push('             <div data-target="canvasContainer">');
                html.push('             </div>');
                html.push('         </div>');
                html.push('         <div class="modal-footer">');
                html.push('             <button style="width: 120px" type="button" data-func="change" class="btn green">更换图片</button>');
                html.push('             <button style="width: 120px" type="button" data-func="save" data-method="getCroppedCanvas" class="btn green">保存</button>');
                html.push('         </div>');
                html.push('     </div>');
                html.push(' </div>');
                html.push('</div>');
                var htmlStr= html.join(" ");
                var $window= $(htmlStr).appendTo("body");
                return $window;
            },
            isValid:function(localUrl,callback){
                if(setting.fixedWidth){
                    // 创建对象
                    var img = new Image();
                    img.src = localUrl;
                    if(img.complete){
                        // 打印
                        if(img.width!=setting.fixedWidth||img.height!=setting.fixedHeight){
                            toastr.error("请上传，宽："+setting.fixedWidth+",高："+setting.fixedHeight+"的图片");
                            return;
                        }
                        callback()
                    }else{
                        // 加载完成执行
                        img.onload = function(){
                            if(img.width!=setting.fixedWidth||img.height!=setting.fixedHeight){
                                toastr.error("请上传，宽："+setting.fixedWidth+",高："+setting.fixedHeight+"的图片");
                                return;
                            }
                            callback()
                        };
                    }
                }else{
                    callback()
                }

            }
        }
        var init = function () {
            setting=$.extend({},defaults,opts);
            setting.cropperOpts=$.extend({},defaults.cropperOpts,opts.cropperOpts);
            uniqueId = new Date().getTime();
            //region 不需要裁剪直接上传
            if(!setting.cropper||setting.otherFile) {
                //不需要裁剪
                $inputFile = $('<input style="display: none"  id="' + uniqueId + '" type="file" value="上传图片">').appendTo("body");
                $inputFile.change(function (e) {
                    var file = e.target.files[0];
                    var localUrl=URL.createObjectURL(file);
                    helper.isValid(localUrl,function(){
                        $inputFile.remove();
                        if(!setting.otherFile){
                            helper.qCloundUpload(file,uniqueId+".jpg");
                        }else{
                           var subfixed= file.name.substring(file.name.lastIndexOf(".")+1,file.name.length);
                            helper.qCloundUpload(file,uniqueId+"."+subfixed);
                        }

                    });

                });
                $inputFile.trigger("click");

                return;
            }else{
                $inputFile = $('<input  style="display: none" id="' + uniqueId + '" type="file" value="上传图片">').appendTo("body");
                $inputFile.change(function (e) {
                    var file = e.target.files[0];
                    var localUrl=URL.createObjectURL(file);
                    helper.isValid(localUrl,function(){
                        $inputFile.remove();
                        var $window=helper.createModal(uniqueId,localUrl);
                        $window.modal();
                        var $image=$window.find('[data-target="images"]');
                        $image.on({}).cropper(setting.cropperOpts);
                        $window.find('[data-func="change"]').click(function(){
                            $window.remove();
                            init();
                        });
                        $window.find('[data-func="save"]').click(function(){
                            var $this = $(this);
                            var data = $this.data();
                            var $target;
                            var result;
                            if($this.prop('disabled') || $this.hasClass('disabled')) {
                                return;
                            }
                            if($image.data('cropper') && data.method) {
                                data = $.extend({}, data);

                                if(typeof data.target !== 'undefined') {
                                    $target = $(data.target);
                                    if(typeof data.option === 'undefined') {
                                        try {
                                            data.option = JSON.parse($target.val());
                                        } catch(e) {
                                            console.log(e.message);
                                        }
                                    }
                                }
                                if(data.method === 'rotate') {
                                    $image.cropper('clear');
                                }
                                result = $image.cropper(data.method, data.option, data.secondOption);
                                //预览截图后的效果
                                $window.find('[data-target="CanvasContainer"]').html(result);
                                var dataUrl=result.toDataURL("images/jpeg");
                                var file = helper.dataURLtoFile(dataUrl,uniqueId+".jpg");
                                //上传到腾讯云
                                helper.qCloundUpload(file,file.name);
                                $window.remove();
                                $(".modal-backdrop").remove();
                            }
                        });
                    });
                });
                $inputFile.trigger("click");
            }

        }
        init();
    }
});
