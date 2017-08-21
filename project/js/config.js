var config = {
    debugger:false,
    wechatAuthor:"http://app.yetong.org/showtime/wechat/first?appId=wx75d264c0d5ba7218&returnUrl="+encodeURIComponent(window.location.href),
    baseUrl:"http://1.1.1.10:8080/eagle/",
    wechatLocalUrl:"http://app.yetong.org/wechat/",
    imgShowUrl:"http://image.yetong.org",
    voiceShowUrl:"http://files.yetong.org",
    videoShowUrl:"http://files.yetong.org",
    bucket : 'keegz',
    appid : 1252902336,
    sid : "AKIDjLlz1rxvCIG2hBubWSGuMchfV8Zoo8Y4",
    skey : "UnuoZCfw3yTr35vZ0FIE78CD2f5MSp6C",
    region : 'gz',
    myFolder : '/web/',
    version:"2.36",
    getAppId:function(){
        return gkee.getAappId();
    },
    isApp:function(){
        return gkee.isApp();
    }
}