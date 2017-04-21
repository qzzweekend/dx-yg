$(document).ready(function () {
    //加载装机功率下拉框
    loadCodeSelect("powerUl");
    //加载电站类型下拉框
    loadCodeSelect("statypeUl");
    //加载国家下拉框
    loadCountrySelect("countryUl");

    autoGetPsName();

    /*$(".content-8").mCustomScrollbar({
     axis: "yx",
     scrollButtons: {enable: true},
     theme: "3d",
     scrollbarPosition: "outside"
     });*/



    //表单绑定onkeyup事件
    /*$(".map_select_1_text").bind("keyup", function (event) {
     if (event.keyCode == 13) {
     event.keyCode = 9;
     event.returnValue = false;
     $(".map_select_1_submit").trigger("click");
     }
     });*/

    //表单搜索  裴习柱
    /*$(".map_select_1_text").bind("change",function () {
     addPsList();
     });*/
    $(".map_select_1_text").bind('keydown', function (e) {
        var key = e.which;
        if (key == 13) {
            $(".map_select_1_submit").trigger("click");
        }
    });

    //按钮搜索   裴习柱
    $(".map_select_1_submit").click(function () {
        addPsList();
    });
    //点击电站名称搜索弹出输入框之前，清空输入框的值   裴习柱  2016-7-13
    $(".map_seicon_1").click(function (){
        $("#ps_name").val('');
    });


    //月历
    $(".date_tita").click(function () {
        var month = $(this).siblings("div").children(".date_tit_txt").text();
        if ($(this).attr('prv') == 1) {
            month--;
        } else {
            month++;
        }
        $(this).siblings("div").children(".date_tit_txt").text(month);
    });

    //月份添加到筛选条件
    $(".date_table td").click(function () {
        var map_id = $(".map_select_4").attr('map');
        var date_month = $(".date_tit .date_tit_txt").text();
        var date_day = $(this).text();
        var get_time = date_month + '-' + date_day;
        date_day = date_day.substring(0, date_day.length - 1);
        if (date_day < 10)date_day = "0" + date_day;
        var date = date_month + '-' + date_day;
        $(".date_table td").removeClass('current');
        $(this).addClass('current');
        $("#install_date_start").val(date);
        // 初始化当前页
        curPage = 1;

        //		add_sapn(map_id,get_time);

        add_sapn(map_id, get_time);
        // getPsDataResetPage();

        doFun();
    });




    //删除事件
    //2016 09 06 将"on(click)改为"live(click)" wangli
    $(".map_choose_on").on('click', function () {

        $(this).remove();
        var map_id = $(this).attr("map");
        /**if(map_id=="1")$("#ps_name").val("");
         if(map_id=="3")$("#ps_type").val("");
         if(map_id=="2")$("#ps_capacity").val("");
         if(map_id=="4")$("#install_date_start").val("");
         if(map_id=="5"){
					$("#country").val("");
					$("#country_all").val("");
				}    */
        clearInputValue(map_id);
        // 初始化当前页
        curPage = 1;
        doFun();

        if ($(".map_choose span").length == 1) {
            $(".map_choose_tit").hide();
        }
    });
    function clearInputValue(map_id) {
        if (map_id == "1") {
            $("#curPsId").val("");
            $("#ps_name").val("");
            $(".map_select_1").find(":text").val("");
        } else if (map_id == "3") {
            $("#ps_type").val("");
            $(".map_select_3").find("a[map='3']").html(LANG["common_please_select_type_of_power_station"]);
        } else if (map_id == "2") {
            $("#ps_capacity").val("");
            $(".map_select_2").find("a[map='2']").html(LANG["common_choose_installed_power"]);
        } else if (map_id == "4") {
            $("#install_date_start").val("");
            $(".date_table td").removeClass("current");
        } else if (map_id == "5") {
            $("#country").val("");
            $("#country_all").val("");
            $(".map_select_5 span:eq(0)").find("a[class='map_select_2_sea']").html(LANG["common_select_countries"]);
            $(".map_select_5").find("#provcnId").html(LANG["common_select_provinces"]);
        }

    }

});

//  根据电站名称搜索回车事件   裴习柱
/*function doPress(){
 if (event.keyCode == 13) {
 event.keyCode = 9;
 event.returnValue = false;
 $(".map_select_1_submit").trigger("click");
 }
 }*/

//  根据电站名称搜索公共方法   裴习柱
function addPsList(){
    var user_id = $("#tools_userId").val();
    var map_id = $(".map_select_1").attr('map');
    //获取当前input的值
    var now_input = $(".map_select_1_text").val().trim();

    /*  裴习柱 add start 把选择的电站保存到 cookie 中  2016-7-8  */
    var psName = getCookie('ps_name'+user_id).trim(); // 从cookie里获取值
    var psList = psName.split(",");
    var allPsName = '';
    if(psList == ''){
        psList.splice(0,1);
    }
    if(psList.length > 10){
        var name = psList.splice(1,9);  //  如果cookie 里的长度大于10，删除第一个，
        var name1 = name.concat(now_input);   //  把最新的值加到截取后的数组
        setCookie('ps_name'+user_id,name1,30);            //  再把最新的数组保存到cookie里，保存30天。
    } else if(psList != ''){
        for(var i=0;i<psList.length;i++){
            if(psList[i] == now_input || now_input == ''){
                break;
            }
            if(i == psList.length - 1){
                allPsName = psList.concat(now_input); // 如果psList != ''且psList.length<10，now_input值不重复。
                setCookie('ps_name'+user_id,allPsName,30);
            }
        }
    } else {
        allPsName = psList.concat(now_input); // 如果cookie的长度不大于10，则直接保存进cookie 用逗号隔开。
        setCookie('ps_name'+user_id,allPsName,30);
    }
    /*  裴习柱 add end 把选择的电站保存到 cookie 中  2016-7-8 */

    if (now_input) {
        $("#ps_name").val(now_input);
        // 初始化当前页
        curPage = 1;
        add_sapn(map_id, now_input);
        doFun();
    } else {
        easyDialog.open({
            container: {
                header:"",
                //header: LANG.common_prompt,
                content: LANG.common_inputcontent,
                noFn: true,
                noText: LANG["pro_management_determine"]
            },
            fixed: false
        });
        $(".map_select_1_text").focus();

    }
}


//  ajax 获取电站 自动完成   裴习柱
function autoGetPsName(){
    var lang = $("#tools_lang").val(); // 获取当前状态下的语言
    //$('#ps_name').autocomplete({
    //    serviceUrl: 'powerStationAction_getPowerStationListNew?lang='+lang, // 如果是英文版，传参lang 则根据ps_name_en_us联想    裴习柱   2016-08-27
    //    type : "post",
    //    dataType : "json",
    //    onSelect: function (suggestion) {//选中后值处理
    //        $('#ps_name').val(suggestion.data);
    //        $("#tool_ps_name").val(suggestion.data);
    //    },
    //    paramName: 'searchPsName',//参数名称
    //    width: 189,//自定义弹出框宽度
    //    enableCookie : true,
    //    deferRequestBy:200,//输入0.2秒后执行
    //    formatResult: function (suggestion, currentValue) {//格式化结果
    //        //return suggestion.data;
    //        var reEscape = new RegExp('(\\' + ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'].join('|\\') + ')', 'g'),
    //            pattern = '(' + currentValue.replace(reEscape, '\\$1') + ')';
    //
    //        return suggestion.data.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');
    //    },
    //    onSearchStart: function (query) {//查询前验证
    //        if(query.length<2){//输入小于2个字符不查询
    //            return false;
    //        }
    //    }
    //});
}


function getProvcnList(value, name) {
    var name = name;
    var value = value;
    $.ajax({
        url: "psMapAction_getProvcnList",
        type: "post",
        dataType: "html", //后台返回的响应数据形式json、xml、html、text、script、_default
        data: {countryId: value},
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",//指定浏览器传输form表单参数时采用的字符集
        success: function (data) {//响应成功后执行的方法体
            var jsondata = eval("(" + data + ")");
            var str = "";
            for (var i = 0; i < jsondata.length; i++) {
                str += "<li onclick=fuzhi('" + jsondata[i].code_value + "','" + name + "','" + value + "'); id='" + jsondata[i].code_value + "'><a href=''>" + jsondata[i].code_name + "</a></li>";
                //str+="<li  id='"+jsondata[i].code_value+"'><a href=''>"+jsondata[i].code_name+"</a></li>";
            }
            $("#procnList").html(str);
        },
        error: function () {//响应错误后执行的方法体
            alert(LANG.common_requestfailure, LANG.common_informationprompt);
        }
    });
}


//省级下拉框选择事件

function fuzhi(value, name, cvalue) {
    var map_id = $(".map_select_5").attr('map');
    var li_val = $("#" + value).text();
    $("#" + value).parent().parent().find(".map_select_2_sea").text(li_val);
    var checkText = name + "-" + li_val;
    $("#country_all").val(cvalue + value);
    // 初始化当前页
    curPage = 1;
    add_sapn(map_id, checkText);
    doFun();
}


//公用添加事件
function add_sapn(map_id, checkText) {
    var _html = '';
    _html += '<span class="map_choose_on" map=' + map_id + '>' + checkText + '<a href="javascript:void(0)" class="map_choose_onclose">×</a></span>';
    //判断是否已经追加过checkText
    $(".map_choose span").each(function () {
        if ($(this).attr('map') == map_id) {
            $("#curPsId").val("");
            $(this).remove();
        }
    });
    $(".map_choose_tit").show();
    $(".map_choose").append(_html);
    if ($("#curPage").length > 0) {
        $("#curPage").val("");
    }
}

// 执行检索后隐藏筛选条件
function hidenSelectCondition() {
    $(".map_select_1").hide();
    $(".map_select_2").hide();
    $(".map_select_3").hide();
    $(".map_select_4").hide();
    $(".map_select_5").hide();
    $(".map_select_wrap").css({"height": "30px"});
    $("#map_select_wraphd a").each(function (i) {
        var ii = i + 1;
        $(this).find("i").removeClass("a" + ii);
    });

    $(".map_select_2_se").find("ul").hide();

    //故障列表页面筛选下拉,点击空白隐藏
    $(".problem_con th ul").hide();

    //点击空白日历隐藏
    $(".dateWrap").hide();
    //隐藏自动完成下拉
    $(".autocomplete-suggestions").hide();
    //清空文本框值
    $("#tool_ps_name").val('');

}

//加载装机功率下拉，电站类型下拉
function loadCodeSelect(id){
    var param = {};
    param["code_type"] = $("#"+id).attr("code_type");
    //$.post("../data/map/queryCodeByType.json",param,function(data){
    //    var html = "";
    //    if(data!=null&&data.length>0){
    //        for(var i=0;i<data.length;i++){
    //            var obj = data[i];
    //            html = html + "<li id="+obj.code_value+"><a href=''>"+obj.code_name+"</a></li>";
    //        }
    //    }
    //    $("#"+id).html(html);
    //    if(id=="powerUl"){
    //        $(".map_select_2 .map_select_2_se ul li").click(function () {
    //            var li_val = $(this).text();
    //            var map_id = $(this).parent().parent().find(".map_select_2_sea").attr('map');
    //            $(this).parent().parent().find(".map_select_2_sea").text(li_val);
    //            var value = $(this)[0].id;
    //
    //
    //            if (map_id == "3")$("#ps_type").val(value);
    //            if (map_id == "2")$("#ps_capacity").val(value);
    //            //  $("#ps_capacity").val(value);
    //            // 初始化当前页
    //            curPage = 1;
    //
    //            add_sapn(map_id, li_val);
    //            //	 getPsDataResetPage();
    //
    //            doFun();
    //        });
    //    }
    //    if(id=="statypeUl"){
    //        $(".map_select_3 .map_select_2_se ul li").click(function () {
    //            var li_val = $(this).text();
    //            var map_id = $(this).parent().parent().find(".map_select_2_sea").attr('map');
    //            $(this).parent().parent().find(".map_select_2_sea").text(li_val);
    //            var value = $(this)[0].id;
    //
    //
    //            if (map_id == "3")$("#ps_type").val(value);
    //            if (map_id == "2")$("#ps_capacity").val(value);
    //            //  $("#ps_capacity").val(value);
    //            // 初始化当前页
    //            curPage = 1;
    //
    //            add_sapn(map_id, li_val);
    //            //	 getPsDataResetPage();
    //            doFun();
    //        });
    //    }
    //
    //    //select 下拉
    //    $(".select_down").toggle(function () {
    //        $(this).find("ul").slideDown(200);
    //    }, function () {
    //        $(this).find("ul").slideUp(200);
    //    });
    //    $(".select_down ul li").click(function () {
    //        var ul_li = $(this).text();
    //        $(this).parent().parent("span").find(".now_a").text(ul_li);
    //    });
    //    document.onclick = function (e) {
    //        var e = e ? e : window.event;
    //        var tar = e.srcElement || e.target;
    //        if (tar.id != "select_down") {
    //            $(".select_down").find("ul").slideUp(200);
    //        }
    //    }
    //},'json');
}

//加载国家列表下拉
function loadCountrySelect(id){
    //$.ajax({
    //    type:"post",
    //    url:'../data/map/queryPsCountryList.json',
    //    cache:true,
    //    dataType:"json",
    //    success:function(data){
    //        var html = "";
    //        if(data!=null&&data.length>0){
    //            for(var i=0;i<data.length;i++){
    //                var obj = data[i];
    //                html = html + "<li id="+obj.code_value+"><a href=''>"+obj.code_name+"</a></li>";
    //            }
    //        }
    //        $("#"+id).html(html);
    //        //国家下拉框选中事件
    //        $(".map_select_3se1 ul li").click(function () {
    //            $("#selectordelete").val("true");
    //            var map_id = $(".map_select_5").attr('map');
    //            var li_val = $(this).text();
    //            $(this).parent().parent().find(".map_select_2_sea").text(li_val);
    //            $("#provcnId").text("--" + LANG.common_pleasechoose + "--");
    //            var value = $(this)[0].id;
    //            $("#country").val(value);
    //            getProvcnList(value, li_val);//2016 10 5 工具栏 搜索罗马尼亚 --显示的省份仍旧是中国的省份bug修改 wangli
    //            //暂时写死，后期优化成前端JS库控制
    //        });
    //    }
    //});
}

function doFun(){
    if(window.getPsDataResetPage){
        getPsDataResetPage();
    }
    if(window.yourFunction){
        yourFunction($("#powerList ul li:eq(0)").attr("id"));
    }
    if(window.getPsListData){
        getPsListData();
    }
}