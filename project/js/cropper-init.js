;var ImgCropper = function () {
  var imgCropper = function(){

      var options = {
          aspectRatio: 1 / 1,
          preview:$('.cropper-preview'),
          zoomable:false,
          viewMode:1,
          crop: function(data) {}
      };
      var $image=$('#cropperImg');
      $image.on({}).cropper(options);
  };

    return {
        init: function () {  
            imgCropper();
        }
    };
}();
