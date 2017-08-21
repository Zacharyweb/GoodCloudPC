//数组item变化方法
    var ListChange=function (){
	function listItemToPrev(list,targetId){
	    for (var i = 0; i < list.length; i++) {
	        if (list[i].id == targetId) {
	            if (i == 0) {
	                return;
	            };
	            var prevItem = list[i - 1];
	            var currentItem = list[i];
	            list.splice(i - 1, 2, currentItem, prevItem);
	        };
	    };
	};
    function listItemToNext(list,targetId){
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == targetId) {
                if (i == list.length - 1) {
                    return;
                };
                var currentItem = list[i];
                var nextItem = list[i + 1];
                list.splice(i, 2, nextItem, currentItem);
                break;
            };
        };
    };
    function listItemForDelete(list,targetId){
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == targetId) {
                    list.splice(i, 1);
                };
            };
    };
    return {
    	listItemToPrev:listItemToPrev,
    	listItemToNext:listItemToNext,
    	listItemForDelete:listItemForDelete
    };
}();
    //隐藏、显示海报上的更换图片图标
    $(document).on('mouseenter','.poster-wrapper',function(){
        $(this).children('span').slideDown();
    }).on('mouseleave','.poster-wrapper',function(){
        $(this).children('span').slideUp();
    });

    //获取新生成海报的序号
    function getNewPosterIndex() {
        var posterTabName = [0];
        $('.poster-name').each(function(index,ele){  
            posterTabName.push(parseInt($(ele).text().match(/([0-9])+/)[0]));     
        });
        var currentMaxIndex = Math.max.apply(null, posterTabName);
        return currentMaxIndex + 1;
    };

    //更换海报
    $(document).on('click','.change-poster',function(){
        var currentPoster = $(this).parent().children('img');
        uploadFileCheck('#uploadFile','image','请选择图片文件',function(file){
            cos.uploadFile(function(result){
                var imgSrc = getUploadImgUrl(result);
                currentPoster.attr('src',imgSrc);
            }, errorCallBack, progressCallBack, bucket, myFolder + file.name, file, 1);
            return false;
         });
    });


    //删除海报 且更换剩余海报的名称 如123 删除2 其余变成12
    $(document).on('click','.deletePoster',function(){
        //获取对应的Tab及Pane
        var targetTab = '#' + $(this).data('targetTab');
        var targetPane = '#' + $(this).data('targetPane');
        //移除对应的Tab及Pane
        $(targetTab).remove();
        $(targetPane).remove();
        //把选中状态移给第一个Tab
        $('#tab_15_1').addClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        //更换剩余poster的名称
        posterNameChange();
    });
   //更换剩余poster的名称
    function posterNameChange(){
           var currentIndexArr = [];
            $('.poster-name').each(function(index,ele){  
                currentIndexArr.push(parseInt($(ele).text().match(/([0-9])+/)[0]));     
            });
            var indexSortList = currentIndexArr.sort();
            for (var i = 0; i < currentIndexArr.length; i++) {
            $('.poster-tab').each(function(index,ele){ 
                if($(ele).children('a').text().indexOf(indexSortList[i])>=0){
                   var targetPane = '#' + ele.dataset.targetPane;
                   $(targetPane+' .poster-pane-name').text('活动海报'+(i+1));
                   $(targetPane+' .deletePoster').attr('data-target-tab','tab'+(i+7));
                   $(targetPane).attr('id','tab_15_'+(i+7));
                   $(ele).attr('data-target-pane','tab_15_'+(i+7));
                   $(ele).attr('id','tab'+(i+7));
                   $(ele).children('a').attr('href','#tab_15_'+(i+7));
                   var tagHtml = '<span class="move-icon"><i class="fa fa-arrows"></i></span>';
                   $(ele).children('a').html(tagHtml+'活动海报'+(i+1));
                }; 
            }); 
        };
    };

    //初始化截图窗口的内容
    function initCropperContent(cropperImg){
        var cropperStr = template('cropperImgTemp',{cropperImg:cropperImg});
        $('#cropperModal .custom-modal-body').html(cropperStr);
        ImgCropper.init();
    };

    //上传图片并放到截图模态框内
    // var targerVideo;
    // $(document).on('click','.video-add-item',function(){
    //     showChooseModal();
    //     targetVideo = '#'+ $(this).data('targetCover');
    // });
    //本地上传视频封面
    $('.from-local').on('click',function(){
         uploadFileCheck('#uploadFile','image','请选择图片文件',function(file){
            $('#chooseModal').hide(); 
            cos.uploadFile(function(result){
                var imgSrc = getUploadImgUrl(result);
                var cropperImg = [{src:imgSrc}]; 
                initCropperContent(cropperImg);
                showCropperModal(); 
            }, errorCallBack, progressCallBack, bucket, myFolder + file.name, file, 1);
            return false;
        }); 
    });
    //视频封面库选择
    var imgSrc;
    $(document).on('click','.from-warehouse',function(){         
        $('#chooseModal').hide();
        // showVideoCoverModal('',function(){
        //     $(targetVideo).find('img').attr('src',imgSrc);
        //     $(targetVideo).children('.video-add-item').hide();
        //     $(targetVideo).children('.video-cover').show();
        // });
  
    });
    //视频封面库选中图片
    $("#videoCoverModal .custom-modal-body li").on('click',function(){
        $(this).addClass('selected').siblings('li').removeClass('selected');
        imgSrc = $(this).children('img').attr('src');
    });
    //更换截图窗口的图片
    $(document).on('click','.chage-cropper-img',function(){
        uploadFileCheck('#uploadFile','image','请选择图片文件',function(file){
            cos.uploadFile(function(result){
                var imgSrc = getUploadImgUrl(result);
                var cropperImg = [{src:imgSrc}]; 
                initCropperContent(cropperImg);
            }, errorCallBack, progressCallBack, bucket, myFolder + file.name, file, 1);
            return false;
        });
    }); 

    
    //隐藏/显示本模块按钮
