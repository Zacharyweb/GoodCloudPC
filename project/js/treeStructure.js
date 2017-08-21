/**
 * Created by 111 on 2017/4/10.
 */
$("body").on("click",".clickSpan",function () {
    var isOpen=$(this).html()=="+"?false:true;
    if(isOpen){
        $(this).html("+");
        $(this).parent().parent().siblings().css("display","none")
    }else{
        $(this).html("-");
        $(this).parent().parent().siblings().css("display","block")
    }
    var text = '';
    $('.clickSpan').each(function () {
      text = text +$(this).html();
    });
     if(text.indexOf("+") < 0){
         $('button#fold').text('折叠');
     }else if(text.indexOf("-") < 0){
         $('button#fold').text('展开');
     }
});
/******树形图的删除*******/

$("body").on("click",".massage_delete",function () {
    $(this).parent().parent().parent().remove();
});


/******树形图的节点内容的修改*******/
$(".massage_revise").click(function () {

});
/******树形图的上移(二级目录)*******/
/*$("body").on("click",".move_up",function () {
    var _old =  $(this).closest("li.list");//当前元素的祖辈 li
    var _new =  $(this).closest("li.list").prev("li.list");//当前元素的祖辈 li的上一个li
    if (_new.length > 0) {
        $(_new).before(_old);
    }
})*/
/******树形图的上移(一级目录)*******/
$("body").on("click",".move_up",function () {
    var _old =  $(this).closest("li.parentList").parent();
    var _new =  $(this).closest("li.parentList").parent().prev("ul");
    if (_new.length > 0) {
        $(_new).before(_old);
    }
})
/*
/!******树形图的下移(二级目录)*******!/
$("body").on("click",".move_down",function () {
    var _old =  $(this).closest("li.list");//当前元素的祖辈 li
    var _new =  $(this).closest("li.list").next("li.list");//当前元素的祖辈 li的上一个li
    $(_new).after(_old);
})*/
$("body").on("click",".move_down",function () {
    var _old =  $(this).closest("li.parentList").parent();
    var _new =  $(this).closest("li.parentList").parent().next("ul");
    $(_new).after(_old);
});

/******树形图的添加子节点*******/
$(".addSubclass").click(function () {

});
/******全部折叠和展开*******/
$("body").on('click','button#fold',function () {
   if($(this).text() == '展开'){
        $('button#fold').text('折叠');
        $('.clickSpan').html('-');
        $("li.list").css('display','block');
    } else{
       $('.clickSpan').html('+');
       $('button#fold').text('展开');
       $("li.list").css('display','none');
    };
    $('#onedTable ul').each(function (i,item) {
        var $this = $(item);
        $this.find('li.list').find('.move_up,.move_down').removeClass("isDisabled");
         $this.find('li.list:eq(0)').find('.move_up').addClass("isDisabled");
         $this.find('li.list:last').find('.move_down').addClass("isDisabled");
    })
});