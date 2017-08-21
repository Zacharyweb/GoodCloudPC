var pano = {};
(function() {
	pano.Kr = {};
	pano.Init = function(xmlname) {
		embedpano({
			xml: xmlname,
			target: "pano",
			html5: "only",
			mobilescale: 1.0,
			passQueryParameters: true
		});
		this.Kr = document.getElementById("krpanoSWFObject");
		this.Exec("startup");
	}
	pano.Exec = function(comm) {
		this.Kr.call(comm);
	}
	pano.Change = function(xmlname) {
		this.Exec("loadpano(" + xmlname + ", null, MERGE, BLEND(1));");
		this.Exec("startup");
	}
	pano.EnterVR = function() {
		this.Exec("webvr.enterVR()");
	}
	pano.exitVR = function () {
	    
	}
	pano.OpenRedpack = function() {

	}
	pano.ChangeCallback = function() {

	}
	pano.enterGyro = function () {
	    this.Exec("entergyro");
	}
	pano.exitGyro = function () {
	    this.Exec("exitgyro");
	}
	pano.pos = function() {

	}
	pano.addHot = function(name,ath,atv,url){
		this.Exec("addHot(" + name + ", " + ath + ", " + atv + ", " + url + ");");
	}
	pano.delHot = function(name){
		this.Exec("delHot(" + name + ");");
	}
	pano.hotClick = function() {
		
	}
})();