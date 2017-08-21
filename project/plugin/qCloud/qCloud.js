var config = window.config || {};
var cos = new CosCloud({
    appid: config.appid,
    bucket: config.bucket,
    region: config.region,
    getAppSign: function (callback) {
        var self = this;
        var random = parseInt(Math.random() * Math.pow(2, 32));
        var now = parseInt(new Date().getTime() / 1000);
        var e = now + 60;
        var path = '';
        var str = 'a=' + self.appid + '&k=' + config.sid + '&e=' + e + '&t=' + now + '&r=' + random +
            '&f=' + path + '&b=' + self.bucket;
        var sha1Res = CryptoJS.HmacSHA1(str, config.skey);
        var strWordArray = CryptoJS.enc.Utf8.parse(str);
        var resWordArray = sha1Res.concat(strWordArray);
        var res = resWordArray.toString(CryptoJS.enc.Base64);
        res = encodeURIComponent(res);
        setTimeout(function () {
            callback(res);
        }, 1000);
    },
    getAppSignOnce: function (callback) {
        var self = this;
        var random = parseInt(Math.random() * Math.pow(2, 32));
        var now = parseInt(new Date().getTime() / 1000);
        var e = 0; //单次签名 expire==0
        var path = self.path;
        var str = 'a=' + self.appid + '&k=' + config.sid + '&e=' + e + '&t=' + now + '&r=' + random +
            '&f=' + path + '&b=' + self.bucket;
        var sha1Res = CryptoJS.HmacSHA1(str, config.skey);
        var strWordArray = CryptoJS.enc.Utf8.parse(str);
        var resWordArray = sha1Res.concat(strWordArray);
        var res = resWordArray.toString(CryptoJS.enc.Base64);
        res = encodeURIComponent(res);
        setTimeout(function () {
            callback(res);
        }, 1000);
    }
});
//上传文件错误回调
var errorCallBack = function (result) {
    result = result || {};
    showErrMsgModal('文件上传失败');
};
//上传文件进程回调
var progressCallBack = function (curr) {
    showLoading(curr);
    if (curr == '1') {
        hideLoading();
    };
};
//获取上传文件的相对路径
function getrelativePath(result) {
    var prefix = "/" + config.appid + "/" + config.bucket;
    var relativePath = result.data.resource_path.replace(prefix, "");
    return relativePath;
};
//获取图片文件的绝对路径
function getUploadImgUrl(result) {
    var relativePath = getrelativePath(result);
    var imgSrc = "http://image.yetong.org" + relativePath;
    return imgSrc;
};



