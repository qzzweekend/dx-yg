$(function(){

    $(document).bind("click",function(e){
        var target = $(e.target);//获取当前对象
        if(target.closest(".map_select_wrap").length == 0 && target.closest(".autocomplete-suggestions").length == 0){
            $(".map_select_1").hide();
            $(".map_select_2").hide();
            $(".map_select_3").hide();
            $(".map_select_4").hide();
            $(".map_select_5").hide();
            $(".map_select_wrap").animate({"height":"30px"});


            $("#map_select_wraphd a").each(function(i){
                var ii = i+1;
                $(this).find("i").removeClass("a"+ii);
            });
            //("i").removeClass("a"+map_a);

        }
        if(target.closest(".map_select_2_se").length == 0){
            $(".map_select_2_se").find("ul").hide();

        }
        //故障列表页面筛选下拉,点击空白隐藏
        if(target.closest(".problem_con th a").length == 0){
            $(".problem_con th ul").hide();
        }

        //点击空白日历隐藏
        if(target.closest(".dateWrap").length == 0 && target.closest(".date_btn").length == 0 && target.closest("#laydate_clear").length == 0 && target.closest("#laydate_today").length == 0 && target.closest("#laydate_ok").length == 0){
            $(".dateWrap").hide();
        }
    });


    var hasSideBar = $(".secondnav").html();
    if(!hasSideBar){
        $(".map_wap").css({"padding":"30px 0 0 2.833%"});
    }else{

    }

    //故障列表页面筛选下拉

    $(".problem_con th").find("a").live("click",function(){
        var p_ul_h = $(".problem_con th").find("ul").is(":hidden");
        if(p_ul_h){
            $(this).siblings("ul").show();
        }else{
            $(this).siblings("ul").hide();
        }
    });

    //判断故障列表页面展开表格的高度来调整增加滚动条后的表格宽度
    if($(".problem_T2").children("table").height()>180){
        $(".problemaaa").parent().css({"width":"9.5%"});
    }else{
        $(".problemaaa").parent().css({"width":"11.11% !important"});
    }


    //故障列表页面点击图标，子div显示
    $(".problem_T2").parent().parent("tr").css({"display":"none"});
    $(".problem_con tr").find(".problem_pic1").live("click",function(){
        var problem_T2 = $(this).parent().parent().next("tr").find(".problem_T2").is(":hidden");
        if(problem_T2){
            $(this).children("img").attr({src:"images/problem_pic2.png"});
            $(this).parent().parent().addClass("problem_T2Hover");
            $(this).parent().parent().next("tr").show();
        }else{
            $(this).children("img").attr({src:"images/problem_pic1.png"});
            $(this).parent().parent().removeClass("problem_T2Hover");
            $(this).parent().parent().next("tr").hide();
        }

    });

    //故障列表页面点击X图标，删除行
    $(".problemaaa").live("click",function(){
        alert($(this).html());
        $(this).parent().parent().remove();
        if($(this).parent().parent().parent().parent().height() >= 180){
            $(this).parent("td").css({"width":"9.5%"});
        }else{
            $(this).parent("td").css({"width":"11.11%"});
        }
    });


    /* 注释掉 郭基宝 2015-03-23
     //故障列表页弹框
     $(".problem").live("click",function(){
     $("body").append("<div class='dialog_bg'></div>");
     $(".report_dialog").show();
     });
     */

    $(".report_close_btn").live("click",function(){
        $(".dialog_bg").remove();
        $(".report_dialog").hide();
    });

});


/*---------------图片拖拽效果--------------------------*/
/*绑定事件*/
function addEvent(obj, sType, fn) {
    if(!obj){
        return;
    }
    if (obj.addEventListener) {
        obj.addEventListener(sType, fn, false);
    } else {
        obj.attachEvent('on' + sType, fn);
    }
}
function removeEvent(obj, sType, fn) {
    if(!obj){
        return;
    }
    if (obj.removeEventListener) {
        obj.removeEventListener(sType, fn, false);
    } else {
        obj.detachEvent('on' + sType, fn);
    }
}
function prEvent(ev) {
    var oEvent = ev || window.event;
    if (oEvent.preventDefault) {
        oEvent.preventDefault();
    }
    return oEvent;
}
/*添加滑轮事件*/
function addWheelEvent(obj, callback) {
    if(!obj){
        return;
    }
    if (window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
        addEvent(obj, 'DOMMouseScroll', wheel);
    } else {
        addEvent(obj, 'mousewheel', wheel);
    }
    function wheel(ev) {
        var oEvent = prEvent(ev),
            delta = oEvent.detail ? oEvent.detail > 0 : oEvent.wheelDelta < 0;
        callback && callback.call(oEvent, delta);
        return false;
    }
}
/*页面载入后*/
window.onload = function() {
    var oImg = document.getElementById('oImg');
    /*拖拽功能*/
    (function() {
        addEvent(oImg, 'mousedown', function(ev) {
            var oEvent = prEvent(ev),
                oParent = oImg.parentNode,
                disX = oEvent.clientX - oImg.offsetLeft,
                disY = oEvent.clientY - oImg.offsetTop,
                startMove = function(ev) {
                    if (oParent.setCapture) {
                        oParent.setCapture();
                    }
                    var oEvent = ev || window.event,
                        l = oEvent.clientX - disX,
                        t = oEvent.clientY - disY;
                    oImg.style.left = l +'px';
                    oImg.style.top = t +'px';
                    oParent.onselectstart = function() {
                        return false;
                    }
                }, endMove = function(ev) {
                    if (oParent.releaseCapture) {
                        oParent.releaseCapture();
                    }
                    oParent.onselectstart = null;
                    removeEvent(oParent, 'mousemove', startMove);
                    removeEvent(oParent, 'mouseup', endMove);
                };
            addEvent(oParent, 'mousemove', startMove);
            addEvent(oParent, 'mouseup', endMove);
            return false;
        });
    })();
    /*以鼠标位置为中心的滑轮放大功能*/
    (function() {
        addWheelEvent(oImg, function(delta) {
            var ratioL = (this.clientX - oImg.offsetLeft) / oImg.offsetWidth,
                ratioT = (this.clientY - oImg.offsetTop) / oImg.offsetHeight,
                ratioDelta = !delta ? 1 + 0.1 : 1 - 0.1,
                w = parseInt(oImg.offsetWidth * ratioDelta),
                h = parseInt(oImg.offsetHeight * ratioDelta),
                l = Math.round(this.clientX - (w * ratioL)),
                t = Math.round(this.clientY - (h * ratioT));
            with(oImg.style) {
                width = w +'px';
                height = h +'px';
                left = l +'px';
                top = t +'px';
            }
        });
    })();

};