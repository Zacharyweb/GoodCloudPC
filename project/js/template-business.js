//业务js参考模板
var Business = function() {
	var module = this;
	//模块数据全局缓存数据
	var globalData = {
		
	}
	//ui绘制
	var renders = {

		}
	// 操作处理
	var action = {
			
	}
	//  数据加载器
	var loader = {
		loadData:function(){
			setTimeout(function(){
				console.log("数据加载完成!")
			},2000);
		}
	};
	
	//事件注册
	var events = {
		uiEvent: function() {
			document.getElementById("btnQuery").addEventListener("click",function(){
				module.openEvent.onSelectEnd();
			})			
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
	/**end 公开方法**/
}

