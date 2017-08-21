     var showModal = function(modalType,contentText,confirmCallback,cancelCallback,closeCallback){
		function show(){
		    $(document.body).css({
			    "overflow-x":"hidden",
			    "overflow-y":"hidden"
			});
			$(modalType).fadeIn();
			$('.custom-modal-mask').fadeIn();

		};
		function hide(){
			$(document.body).css({
			  "overflow-x":"auto",
			  "overflow-y":"auto"
			});
			$(modalType).fadeOut();
			$('.custom-modal-mask').fadeOut();
		};
		$(modalType+' .custom-modal-content').text(contentText);
		show();
		$(modalType +' .cancel').on('click',function(){
	        hide();
			if(cancelCallback){
				cancelCallback();
			};
		});
		$(modalType +' .confirm').on('click',function(){
			hide();
			if(confirmCallback){
				confirmCallback();
			};
		});
		$(modalType +' .close-modal').on('click',function(){
			hide();
			if(closeCallback){
				closeCallback();
			};
		});

	};
	var showSelectModal = function(contentText,confirmCallback,cancelCallback,closeCallback){
		showModal('#doubleOptionsModal',contentText,confirmCallback,cancelCallback,closeCallback);
	};
	var showErrMsgModal = function(contentText,confirmCallback,cancelCallback,closeCallback){
		showModal('#singleOptionModal',contentText,confirmCallback,closeCallback);
	};
	var showAddMsgModal = function(contentText,confirmCallback,cancelCallback,closeCallback){
		showModal('#singleOptionModal',contentText,confirmCallback,closeCallback);
	};
	var showTabelModal = function(){
		showModal('#tabelModal');
	};
	var showCropperModal = function(contentText,confirmCallback,cancelCallback,closeCallback){
		showModal('#cropperModal',contentText,confirmCallback,cancelCallback,closeCallback);
	};
	var showChooseModal = function(){
		showModal('#chooseModal');
	};
	var showVideoCoverModal = function(contentText,confirmCallback,cancelCallback,closeCallback){
		showModal('#videoCoverModal',contentText,confirmCallback,cancelCallback,closeCallback);
	};