/** *业务方法开始** */

var svgAppend = "";
var clearSetInterval = null;
var isIE = false;
var svgPath = "";
var psId = "";
var channelId = "";
var devCode = "";
var deviceType = "";
var devCodeName = "暂无";
var powerList = null;
// 翻页参数
var curPage = 1;
var h = $(window).height() - 75;
var size = getPageNum();
var rowCount = 0;
var fileExistFlag = true;

$(function () {
    $(window).resize();
    svgAppend = "_" + $("#lang").val();
    if (svgAppend.indexOf("zh_CN") >= 0) {
        svgAppend = "";
    }
    svgPath = "../../../svg/InsightV3_PowerStaticnDetail" + svgAppend + ".svg";
    getPsDataResetPage();
    //检测是否为IE
    function checkBrowser() {
        return (navigator.appName.indexOf("Microsoft") > -1);
    }

    isIE = checkBrowser();
    psId = powerList[0].id.toString();
    //clearSet("");
    refreshTime();

    var cw = $(window).width();
    if (cw <= 1570 && cw > 1340) {
        $(".myStat").attr('data-dimension', '320');
    } else if (cw <= 1340) {
        $(".myStat").attr('data-dimension', '280');
    }
    $(".secondnav li").hover(function () {
        $(this).find(".secondnav_bg").fadeIn(200);
    }, function () {
        $(this).find(".secondnav_bg").fadeOut(200);
    });

    $(".map_con_fl li").toggle(function(){
        $(this).children(".item1").show();
    },function(){
        $(this).children(".item1").hide();
    });
    $(".item1 li").toggle(function(){
        $(this).children(".item2").show();
    },function(){
        $(this).children(".item2").hide();
    });
    $(".item2 li").toggle(function(){
        $(this).children(".item3").show();
    },function(){
        $(this).children(".item3").hide();
    });

    //加减切换
    $(".siteMore_tit_btn").click(function () {

        $(".siteMore_tit_btn").text('+');
        $(".siteMore_div").hide();
        $(this).text('-');
        $(this).parent().parent().find(".siteMore_div").show();

    });

    initColor();
    changeColor($("#hidden-input").val());

    //刷新时间未点击时灰色
    $(".abcd").css({"opacity": "0.7"});
    $(".abcd em").css({"opacity": "0.7"});
    $(".allsite_dateriCheckbox").live('click', function () {
        if ($(".allsite_dateriCheckbox").attr("checked") == 'checked') {
            $(".abcd").css({"opacity": "1"});
            $(".abcd em").css({"opacity": "1"})
        } else {
            $(".abcd").css({"opacity": "0.7"});
            $(".abcd em").css({"opacity": "0.7"})
        }

    });


    $(".allsite_datej a").click(function () {
        var ch = $(this).parent().attr("ch");
        var date_em1 = $(this).parent().find("i").text();
        if (ch) {
            if ($(this).attr("class") == "allsite_dateUpBtn1")//+
            {
                date_em1++;
                $(this).parent().find("i").text(date_em1);
            } else {
                date_em1--;
                if (date_em1 <= 1) {
                    date_em1 = 1;
                }
                $(this).parent().find("i").text(date_em1);
            }
        } else {
            if ($(".allsite_dateriCheckbox").attr("checked") == 'checked') {

                if ($(this).attr("class") == "allsite_dateUpBtn1")//+
                {
                    date_em1++;
                    $(this).parent().find("i").text(date_em1);
                } else {
                    date_em1--;
                    if (date_em1 <= 1) {
                        date_em1 = 1;
                    }
                    $(this).parent().find("i").text(date_em1);
                }
                changeTime();
            } else {

            }
        }
    });

    // 全屏状态，初始为false
    var fullScreenflag = false;

    function expand() {
        // 全屏显示 更改样式
        $(".secondnav").css("display", "none");
        $(".side_nav").css("display", "none");
        $(".index_top").css("display", "none");
        $(".map_select").css("display", "none");
        $(".map_con_fl").css("display", "none");
        $(".map_con_fl_page").css("display", "none");
        $("#tendencyDiv").addClass("map_bg").css({
            "background-color": "#fff"
        });
        $("#tendencyDiv").removeClass("tendency_ri");
        $("#tendencyDiv").removeClass("fr");
        $("#tendencyDiv").css("width", "100%");

        $(".tendencyChart").css("height", "100%");
        $("#map_wap_div").removeClass("map_wap");
        $(".index_right").removeClass("fr");
        $(".index_right").css("width", "100%");
        $("#svg_change_color").css("height", "100%");
        $("#svg_change_color").css("overflow", "auto");
        $("#svg_change_color").removeClass("tendencyChart_con");
        $("#svg_change_color").addClass("svgheight");
        $(window).trigger("resize");
        // 更改图标
        $(".change_size img").attr("src", staticUrl+"/resources/portal/images/change_size4.png");
        // 更改全屏状态
        fullScreenflag = true;
        //许盛修改 svg自适应问题 201508151030 -----开始---
        loadFuncDetail();
        //许盛修改 svg自适应问题 201508151030 -----结束---

    }

    function closeExpand() {
        // 退出全屏状态，样式恢复
        $(".problem_con_table").removeClass("problem_height");
        $(".side_nav").css("display", "inline-block");
        $(".map_con_fl").css("display", "block");
        $(".secondnav").css("display", "block");
        $(".side_nav").css("display", "block");
        $(".index_top").css("display", "block");
        $(".map_select").css("display", "block");
        $(".map_con_fl").css("display", "block");
        $(".map_con_fl_page").css("display", "block");
        $("#map_wap_div").addClass("map_wap");

        $("#tendencyDiv").removeClass("map_bg");
        $("#tendencyDiv").addClass("tendency_ri");
        $("#tendencyDiv").addClass("fr");
        $(".index_right").addClass("fr");
        $("#svg_change_color").addClass("tendencyChart_con");
        $("#svg_change_color").removeClass("svgheight");
        $(".just_single_show").css("display", "none");
        // 更改图标
        $(".change_size img").attr("src", staticUrl+"/resources/portal/images/change_size2.png");
        $(window).trigger("resize");
        // 更改全屏状态
        fullScreenflag = false;
        //许盛修改 svg自适应问题 201508151030 -----开始---
        loadFuncDetail();
        //许盛修改 svg自适应问题 201508151030 -----结束---
    }

    //点击全屏
    //$("#change_size").toggle(expand, closeExpand);

    //点击全屏
    $("#change_size").unbind().bind('click',
        function () {
            // console.log(fullScreenflag);
            if (fullScreenflag) {
                closeExpand();
            } else {
                expand();
            }

        });

    //键盘“Esc”出发消失
    $(document).keyup(function (event) {
        if (fullScreenflag == true) {
            switch (event.keyCode) {
                case 27:
                    closeExpand();
                    break;
                case 96:
                    break;
            }
        }
    });


    $(".select_down ul li").click(function () {
        var ul_li = $(this).text();
        $(this).parent().parent("span").find(".now_a").text(ul_li);
    });


    //地图左下角悬浮

    $("#condition_btn").toggle(function () {
        $(".condition").animate({"top": "-175px;"}, 1500);
        $(".condition_other").fadeIn(100);
    }, function () {
        $(".condition_other").fadeOut(100);
        $(".condition").animate({"top": "0px;"}, 1500);

    });


    //年月日事件切换
    $(".dateWrap_tit ul li").click(function () {
        var i = $(this).index();
        $(".dateWrap_tit ul li").removeClass("on");
        $(this).addClass("on");
        var span_1 = $(".quick_date").find('span:first');
        var span_2 = $(".quick_date").find('span:last');
        if (i == 0) //天
        {
            var yest_day = GetDay(1);
        } else if (i == 1)//周
        {
            var yest_day = GetDay(7);
        } else if (i == 2)//月
        {
            var yest_day = GetDay(0, 0, 1);
        } else if (i == 3)//季度
        {
            var yest_day = GetDay(0, 0, 3);
        } else if (i == 4) //年
        {
            var yest_day = GetDay(0, 1);
        }
        var now_day = GetDay();
        span_1.text(yest_day);
        span_2.text(now_day);
    });

    //时间的自由选择
    $(".allsite_hour a").click(function () {
        var _class = $(this).attr("class");
        var em_obj = $(this).parent().find("em");
        var em_val = em_obj.text();
        em_val = parseInt(em_val);
        if (_class == "allsite_dateUpBtn1") //+
        {
            em_val++;
        } else {
            em_val--;
        }
        if (em_val < 10 && em_val >= 0) {
            em_val = "0" + em_val;
        } else if (em_val > 23) {
            em_val = "00";
        } else if (em_val < 0) {
            em_val = "23";
        }
        em_obj.text(em_val);
    });

    //时间确定事件
    $(".date_sureBtn").click(function () {
        var span_year1 = $(".date_startInput").first().find("span").text();
        var span_day1 = $(".allsite_hour").first().find("em").text();
        var span_min1 = $(".allsite_min").first().find("em").text();
        $(".quick_date").find('span:first').text(span_year1 + " " + span_day1 + ":" + span_min1);
        var span_year2 = $(".date_startInput").last().find("span").text();
        var span_day2 = $(".allsite_hour").last().find("em").text();
        var span_min2 = $(".allsite_min").last().find("em").text();
        $(".quick_date").find('span:last').text(span_year2 + " " + span_day2 + ":" + span_min2);
    });
    $(".allsite_min a").click(function () {
        var _class = $(this).attr("class");
        var em_obj = $(this).parent().find("em");
        var em_val = em_obj.text();
        em_val = parseInt(em_val);
        if (_class == "allsite_dateUpBtn1") //+
        {
            em_val++;
        } else {
            em_val--;
        }
        if (em_val < 10 && em_val >= 0) {
            em_val = "0" + em_val;
        } else if (em_val > 59) {
            em_val = "00";
        } else if (em_val < 0) {
            em_val = "59";
        }
        em_obj.text(em_val);
    });

    //获取日期时间
    function GetDay(now_day, now_year, now_mon) {
        var today = new Date();
        if (now_day) {
            var _time = 1000 * 60 * 60 * 24 * now_day;
            var yesterday_milliseconds = today.getTime() - _time;
        } else {
            var yesterday_milliseconds = today.getTime();
        }
        var yesterday = new Date();
        yesterday.setTime(yesterday_milliseconds);
        var strYear = yesterday.getFullYear();
        if (now_year) {
            strYear = strYear - now_year;
        }
        var strDay = yesterday.getDate();
        var strMonth = yesterday.getMonth() + 1;
        if (now_mon) {
            if (strMonth - now_mon < 0) {
                strYear = strYear - 1;
                strMonth = strMonth + 12 - now_mon;
            } else {
                strMonth = strMonth - now_mon;
            }
        }
        //var strHours=yesterday.getHours();       //获取当前小时数(0-23)
        //var strMin=yesterday.getMinutes();     //获取当前分钟数(0-59)
        if (strMonth < 10) {
            strMonth = "0" + strMonth;
        }
        return strYesterday = strYear + "-" + strMonth + "-" + strDay;

    }
});

function initColor() {
    $('.demo').each(function () {
        $("#hidden-input").minicolors({
            control: $(this).attr('data-control') || 'hue',
            defaultValue: $(this).attr('data-defaultValue') || '',
            inline: $(this).attr('data-inline') === 'true',
            letterCase: $(this).attr('data-letterCase') || 'lowercase',
            opacity: $(this).attr('data-opacity'),
            position: $(this).attr('data-position') || 'bottom left',
            hide: function (opacity) {
                changeColor($("#hidden-input").val());
            },
            change: function (hex, opacity) {
                if (!hex) return;
                if (opacity) hex += ', ' + opacity;
                try {

                } catch (e) {
                }
            },
            theme: 'bootstrap'
        });
    });
}


function clickCallback(id) {
    svgPath = "../../../svg/InsightV3_PowerStaticnDetail" + svgAppend + ".svg";
    psId = id.toString();
    clearSet("");
}


//显示数据到InsightV3_PowerStaticnDetail.svg
function showData() {
    loadFuncDetail();
    if (isIE) { //IE
        //svgweb.addOnLoad(loadFuncDetail());
        window.attachEvent("onload", loadFuncDetail);
    } else {//非IE
        window.addEventListener("load", loadFuncDetail, false);
    }
}

//循环查询InsightV3_PowerStaticnDetail.svg
function loopSelectDetail() {
    var obj = document.getElementById("mySVG");
    var svg = obj.getSVGDocument();
    //var cc = bb.documentElement ;

    //设定与svg宽度一样
    //obj.setAttribute("style","width:2000");
    $(svg).unbind().bind('click', function () {
        $(".minicolors-panel").hide();
        changeColor($("#hidden-input").val());
        $('.minicolors-input').each(function () {

            var input = $(this),
                settings = input.data('minicolors-settings'),
                minicolors = input.parent();

            // Don't hide inline controls
            if (settings.inline) return;
            minicolors.find('.minicolors-panel').fadeOut(settings.hideSpeed, function () {
                if (minicolors.hasClass('minicolors-focus')) {
                    if (settings.hide) settings.hide.call(input.get(0));
                }
                minicolors.removeClass('minicolors-focus');
            });

        });
    });

    //pageFlag = 1;
    if (document.getElementById("setTime").checked) {
        var text = $('#timeValue').text().trim();
        showDataToInsightV3_PowerStaticnDetail();
        clearSetInterval = setInterval(showDataToInsightV3_PowerStaticnDetail, text * 60 * 1000);
    } else {
        showDataToInsightV3_PowerStaticnDetail();
    }
}

/**
 *加载Svg图像的回调函数InsightV3_PowerStaticnDetail.svg
 */
function loadFuncDetail() {
//alert(svgPath)
    var obj = document.createElement("embed");
    obj.id = "mySVG";
    obj.setAttribute("type", "image/svg+xml");
    obj.setAttribute("src", svgPath);
    //许盛修改 svg自适应问题 201508151030 -----开始---
//	obj.setAttribute("style", "width:1800px");
    var wid = $("#svg_change_color").width() + 100;
    var hig = $("#svg_change_color").height() - 60;

    obj.setAttribute("style", "width:" + wid + "px;height:" + hig + "px");
    //许盛修改 svg自适应问题 201508151030 -----结束---
    //obj.setAttribute("style", "width:1513px");
    //obj.setAttribute("width", document.documentElement.clientWidth + 40);
    //obj.setAttribute("height", document.documentElement.clientHeight + 300);
    var container = document.getElementById("svgDiv");
    container.innerHTML = "";
    if (fileExistFlag) {
        container.appendChild(obj);
        if (isIE) {
            var isValid = false;
            /**************兼容ie8及以下的特殊处理*****************************/
            clearSetInterval = setInterval(function () {
                var svgdoc, root;
                try {
                    svgdoc = document.getElementById("mySVG");
                    root = svgdoc.getSVGDocument();
                }
                catch (e) {
                    svgdoc = null;
                    root = null;
                }
                if (svgdoc != null && root != null) {
                    clearInterval(clearSetInterval); //清除检测加载完成的定时器
                    isValid = true;
                    loopSelectDetail(); //循环查询
                }
            }, 4000);
            /*******************************************/
        } else {
            clearSetInterval = setInterval(function () {
                var svgdoc, root;
                try {
                    svgdoc = document.getElementById("mySVG");
                    root = svgdoc.getSVGDocument();
                }
                catch (e) {
                    svgdoc = null;
                    root = null;
                }
                if (svgdoc != null && root != null) {
                    clearInterval(clearSetInterval);
                    obj.addEventListener("load", loopSelectDetail(), false);
                }
            }, 1000);
        }
    }
    toggleNoSvgMessage();

}

//跳到到InsightV3_PowerStaticnDetail.svg时清除定时
function clearSet(param) {
    svgPath = svgPath.substring(0, 13) + psId + "/" + svgPath.substring(13);
    var obj = {};
    obj["path"] = svgPath;
    fileExistFlag = Dic.Ajax.request({
        url: ctx + "/psWiringAction_checkFileExist",
        data: obj
    });
    if (param.indexOf("-") > 0) {
        channelId = param.split("-")[1].split(":")[1];
        devCode = param.split("-")[2].split(":")[1];
        deviceType = param.split("-")[3].split(":")[1];
    } else if (!(param.indexOf(":") > 0) && (param != "")) {
        alert("传过来的参数不符合规范");
        clearInterval(clearSetInterval);
        return false;
    }
    //清除定时
    clearInterval(clearSetInterval);
    showData();
}

//显示InsightV3_PowerStaticnDetail.svg中的数据
function showDataToInsightV3_PowerStaticnDetail() {
    var id_ = "";
    var flag = "";
    var jsonStr = new StringBuffer();
    jsonStr.append("[");
    var str = "";
    var reg = /,$/gi;
    var svgdoc = document.getElementById("mySVG");
    var root = svgdoc.getSVGDocument();

    /*****************对于jquery获得属性方法attr()在这里大小写敏感的特殊处理*******************************/
    var textArr = root.getElementsByTagName("text");
    var textArrLen = textArr.length;

    for (var i = 0; i < textArrLen; i++) {
        var textCur = textArr.item(i);
        var cd_id = "", dev_type = "", channel_id = "", device_code = "";
        //======================ID的值注意顺序:DevType-ChannelId-DeviceCode-cdId=========================
        id_ = $.trim($(textCur).attr("id"));
        if (id_.indexOf("text") < 0 && id_.indexOf("cdID") > 0) {
            var arrValue = null;
            if (id_.indexOf("PsGuid") >= 0) {
                arrValue = id_.split("-");
                dev_type = arrValue[1].split(":")[1];
                channel_id = arrValue[2].split(":")[1];
                device_code = arrValue[3].split(":")[1];
                cd_id = arrValue[4].split(":")[1];
            } else if (id_.indexOf("DevType") > 0) {
                arrValue = id_.split("-");
                dev_type = arrValue[0].split(":")[1];
                channel_id = arrValue[1].split(":")[1];
                device_code = arrValue[2].split(":")[1];
                cd_id = arrValue[3].split(":")[1];
            } else if (id_.indexOf("cdID") > 0) {
                dev_type = deviceType;
                channel_id = channelId;
                device_code = devCode;
                cd_id = id_.split(":")[1];
            } else {
                alert("值传的不符合规范");
                clearInterval(clearSetInterval);
                return false;
            }

            jsonStr.append("{'psId':'" + psId + "','devType':'" + dev_type + "','channelId':'" + channel_id + "','deviceCode':'" + device_code + "','cdId':'" + cd_id + "'},");
        }
    }

    var pathArr = root.getElementsByTagName("path");
    var pathArrLen = pathArr.length;
    for (var i = 0; i < pathArrLen; i++) {
        var textCur = pathArr.item(i);
        var cd_id = "", dev_type = "", channel_id = "", device_code = "";
        //======================ID的值注意顺序:DevType-ChannelId-DeviceCode-cdId=========================
        id_ = $.trim($(textCur).attr("id"));
        if (id_.indexOf("path") < 0 && id_.indexOf("cdID") > 0) {
            var arrValue = null;
            if (id_.indexOf("PsGuid") >= 0) {
                arrValue = id_.split("-");
                dev_type = arrValue[1].split(":")[1];
                channel_id = arrValue[2].split(":")[1];
                device_code = arrValue[3].split(":")[1];
                cd_id = arrValue[4].split(":")[1];
            } else if (id_.indexOf("DevType") > 0) {
                arrValue = id_.split("-");
                dev_type = arrValue[0].split(":")[1];
                channel_id = arrValue[1].split(":")[1];
                device_code = arrValue[2].split(":")[1];
                cd_id = arrValue[3].split(":")[1];
            } else if (id_.indexOf("cdID") > 0) {
                dev_type = deviceType;
                channel_id = channelId;
                device_code = devCode;
                cd_id = id_.split(":")[1];
            } else {
                alert("值传的不符合规范");
                clearInterval(clearSetInterval);
                return false;
            }

            jsonStr.append("{'psId':'" + psId + "','devType':'" + dev_type + "','channelId':'" + channel_id + "','deviceCode':'" + device_code + "','cdId':'" + cd_id + "'},");
        }
    }

    var gArr = root.getElementsByTagName("g");//熔断器 ，在id中增加了State标志，1开，0合，svg默认开
    var gArrLen = gArr.length;//PsGuid:100-DevType:12-ChannelId:1-DevCode:1-cdID:12241-State:0-Ratio:1000
    for (var i = 0; i < gArrLen; i++) {
        var textCur = gArr.item(i);
        var cd_id = "", dev_type = "", channel_id = "", device_code = "";
        //======================ID的值注意顺序:DevType-ChannelId-DeviceCode-cdId=========================
        id_ = $.trim($(textCur).attr("id"));
        if (id_.indexOf("path") < 0 && id_.indexOf("cdID") > 0) {
            var arrValue = null;
            if (id_.indexOf("PsGuid") >= 0) {
                arrValue = id_.split("-");
                dev_type = arrValue[1].split(":")[1];
                channel_id = arrValue[2].split(":")[1];
                device_code = arrValue[3].split(":")[1];
                cd_id = arrValue[4].split(":")[1];
            } else if (id_.indexOf("DevType") > 0) {
                arrValue = id_.split("-");
                dev_type = arrValue[0].split(":")[1];
                channel_id = arrValue[1].split(":")[1];
                device_code = arrValue[2].split(":")[1];
                cd_id = arrValue[3].split(":")[1];
            } else if (id_.indexOf("cdID") > 0) {
                dev_type = deviceType;
                channel_id = channelId;
                device_code = devCode;
                cd_id = id_.split(":")[1];
            } else {
                alert("值传的不符合规范");
                clearInterval(clearSetInterval);
                return false;
            }

            jsonStr.append("{'psId':'" + psId + "','devType':'" + dev_type + "','channelId':'" + channel_id + "','deviceCode':'" + device_code + "','cdId':'" + cd_id + "'},");
        }
    }

    str = jsonStr.toString().replace(reg, "") + "]";
    var result = unCompileJsonVal(getDataPost("psWiringAction_getMeterVal", str));
    var stu = eval("(" + result + ")");
    result = eval("(" + stu + ")");
    var j = 0;
    for (var i = 0; i < textArrLen; i++) {
        flag = true;
        var textCur = textArr.item(i);
        id_ = $.trim($(textCur).attr("id"));
        if (id_.indexOf("text") < 0 && id_.indexOf("cdID") > 0) {
            insertData(result[j], textCur, flag);
            j++;
        }
    }

    for (var i = 0; i < pathArrLen; i++) {
        flag = false;
        var textCur = pathArr.item(i);
        id_ = $.trim($(textCur).attr("id"));
        var arrValue = null;
        if (id_.indexOf("path") < 0 && id_.indexOf("cdID") > 0) {//熔断器 ，在id中增加了State标志，1开，0合，svg默认开
            /*if(id_.indexOf("State") >= 0 ){//PsGuid:100-DevType:12-ChannelId:1-DevCode:1-cdID:12241-State:0-Ratio:1000
             arrValue = id_.split("-");//PsGuid:100-DevType:12-ChannelId:1-DevCode:1-cdID:12241-State:1-Ratio:1000
             for(var k=0;k<arrValue.length;k++){
             if(arrValue[k].indexOf("State")>=0){
             //result[j].name="1";
             if(parseInt(result[j].name) == arrValue[k].split(":")[1]){
             $(textCur).show();
             }else{
             $(textCur).hide();
             }
             }
             }
             }else{*/
            insertData(result[j], textCur, flag);
            //}
            j++;
        }
    }

    for (var i = 0; i < gArrLen; i++) {
        var gCur = gArr.item(i);
        id_ = $.trim($(gCur).attr("id"));
        var arrValue = null;
        /*	if(id_.indexOf("cdID") > 0 && id_.indexOf("State") >= 0 ){
         arrValue = id_.split('-');
         if( id_.indexof("-DevCode:"+result[j].code+"-")>0){
         if(parseInt(result[j].name) == arrValue[k].split(":")[1]){

         }
         $(gCur).show();
         }else{
         $(gCur).hide();
         }*/
        arrValue = id_.split('-');
        for (var k = 0; k < arrValue.length; k++) {
            if (arrValue[k].indexOf("State") >= 0) {
                //result[j].name="0";
                if (id_.indexOf("-DevCode:" + result[j].code + "-") > 0) {
                    if (parseInt(result[j].name) == arrValue[k].split(":")[1]) {
                        $(gCur).show();
                    } else {
                        $(gCur).hide();
                    }
                    j++;
                }

            }
        }

    }
}


function insertData(result, textCur, flag) {
    if (!$.isEmptyObject(result) && (result.name != "")) {
        var label = $(textCur).text();
        try {
            if (!flag) {
                if (result.name == "1") {
                    $(textCur).css("fill", "red");
                } else {
                    $(textCur).css("fill", "#00FF00");
                }
            } else {
                // 修改svg图形显示数据变比转换  在id后加入 “-Ratio:1000” 代表将获取的原始值除数字后获取的值 --201508151511 开始----
                var value = result.name;
                var id = $.trim($(textCur).attr("id"));
                if (id.indexOf("Ratio") > 0) {
                    arrValue = id.split("-");
                    var Ratio = arrValue[5].split(":")[1];
                    value = parseInt(value) / parseInt(Ratio);
                }

                $(textCur).text(value);
                // 修改svg图形显示数据变比转换  在id后加入 “-Ratio:1000” 代表将获取的原始值除数字后获取的值 --201508151511 结束----

            }
        } catch (e) {
            $(textCur).text(label);
        }
    }
}

function changeColor(type) {
    document.getElementById('svgDiv').style.backgroundColor = type;
    document.getElementById('svg_change_color').style.backgroundColor = type;
}

function changePowerList() {
    if (document.getElementById('psList').style.display == 'none') {
        $("#psList").show();
        $("html,body").animate({scrollLeft: 0, scrollTop: 0}, 200);
        var svgWidth = $("#svgDiv").width() - $("#psList").width() - 3;
        $("#svgDiv").width(svgWidth);
    } else {
        $("#psList").hide();
        $("html,body").animate({scrollLeft: 0, scrollTop: 0}, 200);
        var svgWidth = $("#svgDiv").width() + $("#psList").width() + 3;
        $("#svgDiv").width(svgWidth);
    }
}

function refreshTime() {
    var text = $("#timeValue").html();
    if (document.getElementById("setTime").checked) {
        clearSetInterval = setInterval(showDataToInsightV3_PowerStaticnDetail, text * 60 * 1000);
    } else {
        clearInterval(clearSetInterval);
    }
}

function changeTime() {
    var text = $("#timeValue").html();
    if (document.getElementById("setTime").checked) {
        clearInterval(clearSetInterval);
        clearSetInterval = setInterval(showDataToInsightV3_PowerStaticnDetail, text * 60 * 1000);
    }
}

// 组件注册方法名称（名称必须统一）
function getPsDataResetPage() {
    // 分页查询电站列表并分页
    //queryPsDataList();
    firstLoadPowerSearch();
    pslistPage();
}

function firstLoadPowerSearch() {
    var psData = queryPowerList();
    powerList = psData.pageList;
    rowCount = psData.rowCount;
}

function powerSearch() {
    //displaySearchDiv(6);
    firstLoadPowerSearch();
    var accordian = new DicAccordian();
    accordian.init('powerList', powerList);
    //alert(powerList[0].id);
    var pid = $("#selectPsId").val();
    if (pid == "" || $("#" + pid).length == 0) {
        pid = powerList[0].id;
    }
    checkCss(pid);
}

function checkCss(id) {
    $(".on").removeClass();
    $("#" + id).removeClass().addClass("on");
    if (id != "" && id != undefined) {
        if ($("#selectPsId").length > 0) {
            $("#selectPsId").val(id);
        }
    }
    svgPath = "../../../svg/InsightV3_PowerStaticnDetail" + svgAppend + ".svg";
    //svgPath = "../../../svg/InsightV3_PowerStaticnDetail.svg";
    //alert(svgPath)
    psId = id.toString();
    var ps_name = $("#powerList li.on").find("a").html();
    $("#wiring_ps_name").html(ps_name + "-");
    clearSet("");
}
var currentPage = 0;
function pslistPage() {
    this.size = getPageNum();
    if ($("#curPage").val() != "" && $("#curPage").val() > 0) {
        currentPage = $("#curPage").val() - 1;
    } else {
        currentPage = 0;
    }
    // 此demo通过Ajax加载分页元素
    var initPagination = function () {
        var num_entries = rowCount;
        // 创建分页
        $("#Pagination").pagination(num_entries, {
            num_edge_entries: 1, // 边缘页数
            num_display_entries: 4, // 主体页数
            current_page: currentPage,
            callback: pageselectCallback,
            ellipse_text: "...",
            Flag: 1,
            items_per_page: size, // 每页显示1项
            prev_text: '<',
            next_text: ">"
        });
    };

    function pageselectCallback(page_index, jq) {
        var new_content = $("#hiddenresult div.result:eq(" + page_index + ")").clone();
        $("#Searchresult").empty().append(new_content);
        // 装载对应分页的内容
        curPage = page_index + 1;
        if ($("#curPage").length > 0) {
            $("#curPage").val(curPage);
        }
        powerSearch();
        return false;
    }

    // ajax加载
    initPagination();
}

//没有一次接线图的情况给出提示
function toggleNoSvgMessage() {
    $(".nodata_message").remove(".nodata_message");
    $("#svg_change_color").css("background-color", $(".minicolors-swatch-color").css("background-color"));
    if ($("#svgDiv").html() == "" || $("#svgDiv").html() == null) {
        $("#svg_change_color").css("background-color", "white");
        $("#svg_change_color").append("<div class='nodata_message' style='text-align: center;padding:20px;'><span style='font-size:14px'>" + LANG.all_station_nowiringmessage + "</span></div>");
    }
}