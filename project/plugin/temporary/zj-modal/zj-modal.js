	;(function($){
		var defaults = {
			show:false, //手动设置是否显示
			title:'请输入标题', //设置标题
			content:'<p class="custom-modal-content">请输入内容</p>', //设置主内容
			confirmCallback:null, //点击确定按钮回调
			cancelCallback:null, //点击取消按钮回调
			closeCallback:null, //点击关闭按钮回调
			modalWidth:300, //设置模态框宽度
	        hasHeader:true, //是否显示头部
			hasBody:true, //是否显示主内容
			hasFooter:true, //是否显示底部
			hasHeaderBottomBorder:false,//是否有头部底边框
			hasBodyBottomBorder:false, //是否有主内容底边框
			btnText:[] //设置btn中的文字
		};
		$.fn.customModal = function(params){
			var options = $.extend(defaults, params || {});
            // 初始化模态框
			function init(){
				$('.custom-modal').css({width:options.modalWidth});
				//是否显示头部
				if(!options.hasHeader){
					$('.custom-modal-header').hide();
				};
                //是否显示主内容区
				if(!options.hasBody){
					$('.custom-modal-body').hide();
				};
				//是否显示脚部栏
				if(!options.hasFooter){
					$('.custom-modal-footer').hide();
				};
				//是否显示头部底边边框
				if(!options.hasHeaderBottomBorder){
					$('.custom-modal-header').css({border:'none'});
				};
				//是否显示头部底边边框
				if(!options.hasBodyBottomBorder){
					$('.custom-modal-body').css({border:'none'});
				};
				//设置标题
				if(options.title){
					$('.custom-modal-header h3').text(options.title);
				};
				//设置主内容
				if(options.content){
					$('.custom-modal-body').html(options.content);
				};
				if(options.btnText.length>0){
					if(options.btnText.length>2){
						alert('抱歉，目前只能设置两个按钮');
					};
					for(var i = 0; i < options.btnText.length; i++){
						$('.custom-modal-footer button').eq(i).text(options.btnText[i]);
					};
				};
				//居中显示
				var halfWidth = $('.custom-modal').width() / 2 + 20;
				var halfHeight = $('.custom-modal').height() / 2 + 20;
				$('.custom-modal').css({'margin-left':-halfWidth,'margin-top':-halfHeight});

				//存在拖动插件则模态框可拖动
				if(jQuery().draggabilly){
					$('.custom-modal').draggabilly({});
				};
				//检测是否有手动显示/隐藏模态框的需求
				if(options.show){
					show();
				}
				else{
					hide();
				};
			};
			init();
			//绑定事件
			function bindEvent(){
				//点击关闭图标关闭模态框，存在回调则执行回调
				$('.close-custom-modal').on('click',function(){
					hide();
					if(options.closeCallback){
						options.closeCallback();
					};
				});	
				//点击遮罩图标关闭模态框，存在回调则执行回调
				$('.custom-modal-mask').on('click',function(){
					hide();
					if(options.closeCallback){
						options.closeCallback();
					};
				});
                //点击确定按钮关闭模态框，存在回调则执行回调
				$('.custom-modal .confirm').on('click',function(){
					hide();
					if(options.confirmCallback){
						options.confirmCallback();
					}
				});
				 //点击取消按钮关闭模态框，存在回调则执行回调
				$('.custom-modal .cancel').on('click',function(){
					hide();
					if(options.cancelCallback){
						options.cancelCallback();
					}
				});
			};
			bindEvent();
			function show(){
				$('.custom-modal').show();
				$('.custom-modal-mask').show();
				$(document.body).css({
				    "overflow-x":"hidden",
				    "overflow-y":"hidden"
				});
			};
			function hide(){
				$('.custom-modal').hide();
				$('.custom-modal-mask').hide();
				$(document.body).css({
				  "overflow-x":"auto",
				  "overflow-y":"auto"
				});
			}; 
		};
	})(jQuery);