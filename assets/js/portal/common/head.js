'use strict'
$(document).ready(function () {

    $(".index_top_right a").hover(function () {
        $(this).find(".secondnav_bg2").fadeIn(200);
        $(this).find(".secondnav_bg3").fadeIn(200);
    }, function () {
        $(this).find(".secondnav_bg2").fadeOut(200);
        $(this).find(".secondnav_bg3").fadeOut(200);
    });
    $(".side_nav ul li").hover(function () {
        $(this).find(".secondnav_bg5").fadeIn(200);
    }, function () {
        $(this).find(".secondnav_bg5").fadeOut(200);
    });

    $(".clock").hover(function(){
        if($("#clock_num").html() != "" && $("#clock_num").html() != null) {
            $(this).children(".yg-tophide").show();
        }
    },function(){
        $(this).children(".yg-tophide").hide();
    });

    $(".clock").click(function(){
        if($("#clock_num").hasClass('clock-hide')) {
            var url = $(this).children(".yg-tophide").find("a").attr("href");
            window.location.href = url;
        }
    });
    //加载公告
    setTimeout(function () {
        $.SUN_post(
            "data/head/queryNotice.json",'',function (data) {
                var jsondata = data;
                var str = "";
                $("#notice_list").html('');
                //   peixizhu  修改   根据 is_shiw_version 判断公告是否显示   2016-11-05
                var jsondata_1 = jsondata[0].list;
                var isShowVersion = jsondata[0].list_user.is_show_version;
                if(isShowVersion == '1'){  //
                    $.each(jsondata_1,function(n,value) {
                        //2016 09 01 样式修改
                        str += '<li><span style="cursor:pointer" onclick="showNoticeList()" >' + value.msg_title + '</span></li>';
                        return false;// 只显示一条最新的
                    });
                    $("#notice_list").html(str);
                }else{
                    $(".active").css("display","none"); // 如果 isShowVersion 不等于 1，则不显示
                }

                //暂时修改只出现一条最新的公告，不滚动
                jQuery(".active").slide({mainCell:"ul", effect:"topLoop", vis:1,scroll:0, opp:true, autoPlay:false, delayTime:800});
            });
    }, 500);


    //延迟0.5秒请求，减少服务器的压力
    setTimeout(function () {
        refreshClockNum.initClockNum(true);
    }, 500);

    refreshClockNum.refreshInterval = window.setInterval(
        function(){
            refreshClockNum.time++;
            refreshClockNum.initClockNum();
        },1000*60);//每隔一分钟检测工单数量*/


    //WebpageZoomDetect.start({
    //    interval : 2000,// 每隔1s检测一次
    //});  qzz
});

var refreshClockNum = {
    refreshInterval : null,
    time:0,//页面停留时间
    initClockNum: function(isFrist){
        var myDate = new Date();
        var hour = myDate.getHours();
        var minutes = myDate.getMinutes();
        if (!isFrist&&refreshClockNum.time>60&&(hour==23&&hour==6)) {//回收内存
            if(refreshClockNum.refreshInterval){
                window.clearInterval(refreshClockNum.refreshInterval);
            }
            refreshClockNum = null;
            destroyIframe(document.getElementById("index_frame"));
            window.location.reload(true);
            return;
        }
        $.SUN_post(
            "data/head/getFaultOrderListSize.json",
            "",
            function (data) {//响应成功后执行的方法体
                if(isEmptyStr(data)){
                    return ;
                }
                var jsondata = data;
                //console.log(jsondata);
                if (jsondata == 0) {
                    $("#clock_num").removeClass("clock-hide");
                    $("#clock_num").html("");
                    $("#order_num").html("");
                } else {
                    $("#clock_num").addClass("clock-hide");
                    //当前用户工单的数量
                    $("#clock_num").html(jsondata);
                    $("#order_num").html(jsondata);

                }
            });
    }
}


/**
 * 销毁iframe，释放iframe所占用的内存。
 * @param iframe 需要销毁的iframe对象
 */
function destroyIframe(iframe){
//把iframe指向空白页面，这样可以释放大部分内存。
    iframe.src = 'about:blank';
    try{
        if(iframe.contentWindow.refreshData){
            window.clearInterval( iframe.contentWindow.refreshData.refreshInterval);
            iframe.contentWindow.refreshData = null;
        }
        iframe.contentWindow.document.write('');
        iframe.contentWindow.document.clear();
    }catch(e){}
//把iframe从页面移除
    iframe.parentNode.removeChild(iframe);
}

function gotoSys(o) {
    var param = {};
    param["user_account"] = $("#a").val();
    param["user_password"] = $("#b").val();
    param["service"] = "login";
    param["deadline"] = "30";//token 30秒后失效
    $.post(ctx+"/commonIAction_loaddata", param, function (data) {
        if (data != null) {
            var obj = JSON.parse(data);
            var token = obj.token;
            if (token != undefined && token != null) {
                var url = $(o).attr("url");
                //window.open(url + "?token=" + token);
                var param = {};
                param["token"] = token;
                param["timestamp"] = $.now();//当前时间戳
                post(url,param);
            } else {
                alert("认证失败");
            }
        }
    }, 'json');
}

function post(URL, PARAMS) {
    var temp_form = document.createElement("form");
    temp_form .action = URL;
    temp_form .target = "_blank";
    temp_form .method = "post";
    temp_form .style.display = "none"; for (var x in PARAMS) { var opt = document.createElement("textarea");
        opt.name = x;
        opt.value = PARAMS[x];
        temp_form .appendChild(opt);
    }
    document.body.appendChild(temp_form);
    temp_form .submit();
}

/*切换用户语言*/
function changlang(lang) {
    var url = ctx+"/locale.action?request_locale="+lang;//+"&backurl="+strPath;
    $.post(url,'',function(){
        window.location.reload(true);
    });
}


function showNoticeList() {
    var url  = ctx + "/noticeManageAction_showNoticeList";
    window.open(url);

}


function showScree(obj) {
    var sUserAgent = navigator.userAgent;
    var isIE11 = (sUserAgent.toLowerCase().indexOf("trident") > -1 && sUserAgent.indexOf("rv") > -1);
    var isIE = $.browser.msie;
    var version = $.browser.version;
    var a = base64_encode($("#a").val());
    var b = base64_encode($("#b").val());
    var url = $(obj).attr("url") + "?a=" + a + "&b=" + b;
    var cw = $(window).width();
    if (cw < 1900) {
        alert("大屏演示建议在1920*1080P分辨率下演示");
        return;
    }
    if (!(isIE11 || (isIE && version >= 9))) {
        alert("视频监控需要在IE9及以上IE浏览器下观看");
        return;
    }
    window.open(url);
}

function base64_encode(str) {
    var c1, c2, c3;
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var i = 0, len = str.length, string = '';

    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            string += base64EncodeChars.charAt(c1 >> 2);
            string += base64EncodeChars.charAt((c1 & 0x3) << 4);
            string += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            string += base64EncodeChars.charAt(c1 >> 2);
            string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            string += base64EncodeChars.charAt((c2 & 0xF) << 2);
            string += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        string += base64EncodeChars.charAt(c1 >> 2);
        string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        string += base64EncodeChars.charAt(c3 & 0x3F)
    }
    return string
}

//2016 09 08 中英文版 用户手册wangli
function openHandBook(){
    if('zh_CN'==lang_userHandBook ||''==lang_userHandBook){//如果是中文
        window.open(ctx+'/jsp/plugin/handbook/handbook.pdf');
    }else{//英文
        window.open(ctx+'/jsp/plugin/handbook/handbook_en_us.pdf');
    }

}
/**
 * 2016 12 13 wangli 跳转到后台管理系统
 */
function jumpToBackstage(){
    //
    var url=window.location.href;
    url=url.split(/\//)[2];
    var newurl="http://"+url+"/iscmp/userLoginAction_getHomeMenu";
    //alert(newurl);
    window.open(newurl);


}