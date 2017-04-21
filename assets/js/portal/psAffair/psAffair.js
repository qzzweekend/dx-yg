var onDutySatus = "";
var employeeCt = 0;    //值班人员选择计数

$(document).ready(function() {
    /*$("i").removeClass("rightNav_icon1");
     $("#psx1").addClass("current");
     $("#test1").removeClass().addClass("rightNav_icon1");
     $("#contentDiv").removeClass().addClass("map_con clearfix");
     $.post("psFaultAction_getFaultOrderPage",
     function(data) {
     $("#contentDiv").html(data);
     })*/
    function addTrColor(){

        $("table tbody tr").live("click",function(){
            $(this).addClass("on");
            $(this).siblings().removeClass("on");
        })
    }
    if(getQueryString('ps_id') && !isNaN(getQueryString('ps_id'))){
        $("#curPsId").val(getQueryString('ps_id'));
    }
    $("#psx1").click();
});
var clickType = "0";

$(".secondnav li").click(function(){
    $(".secondnav li").removeClass("current");
    $(this).addClass("current");
});

//故障
$("#psx1").click(function() {
    $("#tools").show();
    $(".map_select_wrap").show();
    $("#contentIfr").hide();
    $("#contentDiv").show();
    $("#dss").show();
    clickType = "1";
    $("i").removeClass("rightNav_icon1");
    $("#test1").removeClass().addClass("rightNav_icon1");
    $("#contentDiv").removeClass().addClass("map_con clearfix");
    $.post("psFaultAction_getFaultOrderPage",{"guzhang": getQueryString('guzhang')},
        function(data) {
            $("#contentDiv").html(data);
        })
});

//故障
$("#psx22").click(function() {
    $("#tools").show();
    $(".map_select_wrap").show();
    $("#contentIfr").hide();
    $("#contentDiv").show();
    $("#dss").show();
    clickType = "22";
    $("i").removeClass("rightNav_icon1");
    $("#test22").removeClass().addClass("rightNav_icon1");
    $("#contentDiv").removeClass().addClass("map_con clearfix");
    $.post("psAffairAction_showWorkTicket",{"guzhang": getQueryString('guzhang')},
        function(data) {
            $("#contentDiv").html(data);
        })
});

//故障
$("#psx23").click(function() {
    $("#tools").show();
    $(".map_select_wrap").show();
    $("#contentIfr").hide();
    $("#contentDiv").show();
    $("#dss").show();
    clickType = "23";
    $("i").removeClass("rightNav_icon1");
    $("#test23").removeClass().addClass("rightNav_icon1");
    $("#contentDiv").removeClass().addClass("map_con clearfix");
    $.post("psAffairAction_showOptTicket",{"guzhang": getQueryString('guzhang')},
        function(data) {
            $("#contentDiv").html(data);
        })
});

/*$("#psx2").click(function() {
 $("#dss").hide();
 clickType = "2";
 $("i").removeClass("rightNav_icon1");
 $("#test2").removeClass().addClass("rightNav_icon1");
 $("#contentDiv").removeClass().addClass("map_con clearfix");
 $("#contentDiv").load(ctx+"/jsp/portal/psAffair/scgl.jsp");
 });

 $("#psx3").click(function() {
 $("#dss").hide();
 clickType = "3";
 $("i").removeClass("rightNav_icon1");
 $("#test3").removeClass().addClass("rightNav_icon1");
 $("#contentDiv").removeClass().addClass("map_con clearfix");
 $("#contentDiv").load(ctx+"/jsp/portal/psAffair/czp.jsp");
 });*/
//筛选条件事件绑定
$(function() {
    $("#map_select_wraphd a").click(function() {
        var now_a = $(this).index() + 1;
        //查看当前点击的是否是本身
        if ($(this).find('i').hasClass('a' + now_a)) //有表示已选中状态
        {
            $(this).find('i').removeClass('a' + now_a);
            $(".map_select_wrap").animate({
                    "height": "30px"
                },
                500);
            $(".map_select_" + now_a).hide();
        } else {
            $("#map_select_wraphd a").each(function(i) {
                var ab = i + 1;
                $(".map_select_" + ab).hide();
                $(this).find('i').removeClass('a' + ab);
            });
            if (now_a == 4) {
                $(".map_select_wrap").animate({
                        "height": "180px"
                    },
                    500);
            } else {
                $(".map_select_wrap").animate({
                        "height": "80px"
                    },
                    500);
            }
            $(this).find('i').addClass("a" + now_a);
            $(".map_select_" + now_a).show();
        }
    });
});

// 值班信息管理
function clearAllInfo(){
    $("#DUTY_NAME").val("");
    document.getElementById("ONDUTY_NOTE").value = "";
    document.getElementById("OVERDUTY_NOTE").value = "";
    $("#OVERDUTY_TIME").val("");
    $("#ONDUTY_TIME").val("");
    $("#MONITOR_NAME").val("");
    $("#EMPLYEE_NAMES").val("");
    $("#show_ONDUTY_TIME").val("");
    $("#show_OVERDUTY_TIME").val("");
}


//保存接班信息
function saveOnDutyInfo(){
    if($.trim($("#DUTY_NAME").val()).length <= 0) {
        top.asyncbox.alert(LANG["psaffair.pleaseWriteDutyName"], LANG["sta_overview_informationprompt"], function () {
            $("#DUTY_NAME").focus();
        });
        return;
    }else if($.trim($("#DUTY_NAME").val()).length >= 20) {
        top.asyncbox.alert(LANG["psaffair.DutyNameTooLang"], LANG["sta_overview_informationprompt"], function () {
            $("#DUTY_NAME").focus();
        });
        return;
    }
    if($.trim($("#MONITOR_NAME").val()).length <= 0) {
        top.asyncbox.alert(LANG["psaffair.pleaseSelectOneMonitor"], LANG["sta_overview_informationprompt"], function () {
            $("#MONITOR_NAME").focus();
        });
        return;
    }
    if($.trim($("#EMPLYEE_NAMES").val()).length <= 0) {
        top.asyncbox.alert(LANG["psaffair.selectAtLeastOneEmp"], LANG["sta_overview_informationprompt"], function () {
            $("#EMPLYEE_NAMES").focus();
        });
        return;
    }else if(employeeCt > 20){
        top.asyncbox.alert(LANG["psaffair.employeeOverMuch"], LANG["sta_overview_informationprompt"], function () {
            $("#EMPLYEE_NAMES").focus();
        });
        return;
    }
    if($.trim($("#show_ONDUTY_TIME").val()).length <= 0) {
        top.asyncbox.alert(LANG["psaffair.selectOndutyTime"], LANG["sta_overview_informationprompt"], function () {
        });
        return;
    }
    if(document.getElementById("ONDUTY_NOTE").value.length >= 199){
        top.asyncbox.alert(LANG["psaffair.ondutyNoteOverLong"], LANG["sta_overview_informationprompt"], function () {
            $("#ONDUTY_NOTE").focus();
        });
        return;
    }
    $.ajax({
        url: "psAffairAction_addDutyInfo",
        type:"POST", //提交方式：post、get
        dataType:"html", //后台返回的响应数据形式json、xml、html、text、script、_default
        data:$("#onDutyFieldForm").serialize(),//提交form表单的形式传送参数， #searchForm为表单的ID
        success: function(data){//响应成功后执行的方法体
            if($.trim(data)=="0"){
                top.asyncbox.success(LANG["psaffair.onDutySuccess"],LANG["sta_overview_informationprompt"]);
                closeDetailDialog();
                //onDutyInfoPage();
                window.frames['contentIfr'].refreshPage();
            }else if($.trim(data)=="1"){
                top.asyncbox.error(LANG["psaffair.onDutyFail"],LANG["psaffair.failPrompt"]);
            }else{
                top.asyncbox.error(LANG["psaffair.onDutyFail"],LANG["sta_overview_informationprompt"]);
            }
        },
        error : function() {//响应错误后执行的方法体
            top.asyncbox.error(LANG["psaffair.onDutyFail"],LANG["sta_overview_informationprompt"]);
        }
    });

}

// 交班
function modifyDutyInfo(){

    if($.trim($("#show_OVERDUTY_TIME").val()).length <= 0) {
        top.asyncbox.alert(LANG["psaffair.selectOnDutyTime"], LANG["sta_overview_informationprompt"], function () {
            //$("#OVERDUTY_TIME").focus();
        });
        return;
    }
    if(document.getElementById("OVERDUTY_NOTE").value.length >= 199){
        top.asyncbox.alert(LANG["psaffair.overdutyNoteOverLong"], LANG["sta_overview_informationprompt"], function () {
            $("#OVERDUTY_NOTE").focus();
        });
        return;
    }
    $.ajax({
        url: "psAffairAction_modifyDutyInfo",
        type:"POST", //提交方式：post、get
        dataType:"html", //后台返回的响应数据形式json、xml、html、text、script、_default
        data:$("#onDutyFieldForm").serialize() + "&ID=" + window.frames['contentIfr'].lastDutyId,//提交form表单的形式传送参数， #searchForm为表单的ID
        success: function(data){//响应成功后执行的方法体
            if($.trim(data)=="0"){
                top.asyncbox.success(LANG["psaffair.overDutySuccess"],LANG["sta_overview_informationprompt"]);
                closeDetailDialog();
                //onDutyInfoPage();
                window.frames['contentIfr'].refreshPage();
            }else if($.trim(data)=="1"){
                top.asyncbox.error(LANG["psaffair.overDutyFail"],LANG["psaffair.failPrompt"]);
            }
            else{
                top.asyncbox.error(LANG["psaffair.overDutyFail"],LANG["sta_overview_informationprompt"]);
            }
        } ,
        error : function() {//响应错误后执行的方法体
            top.asyncbox.error(LANG["psaffair.overDutyFail"],LANG["sta_overview_informationprompt"]);
        }
    });
}


//关闭弹出框
function closeDetailDialog(){
    $(".duty_hidebox_top_close").trigger("click");
    clearAllInfo();
}

function closehidebox(){
    $(".duty_add_hidebox_close").parents().parents(".duty_add_hidebox").hide();
}


//确认选择的值长
function affirmMoniterSelect(){
    var selectedUserIdArry = [];
    var selectedUserNameArry = [];
    $("input[name='monitor']").each(function(i, o){
        if(o.checked){
            selectedUserIdArry.push(o.value);
            selectedUserNameArry.push($.trim(o.nextSibling.nodeValue));
        }
    });
    var selectedUserIdArryStr = selectedUserIdArry.join(",");
    var selectedUserNameArryStr = selectedUserNameArry.join(",");

    $("#MONITOR_ID").val(selectedUserIdArryStr);
    $("#MONITOR_NAME").val(selectedUserNameArryStr);

    closehidebox();
}

//确认选择的值班人员
function affirmEmplyeeSelect(){
    var selectedUserIdArry = [];
    var selectedUserNameArry = [];
    employeeCt = 0;
    $("input[name='employees']").each(function(i, o){
        if(o.checked){
            employeeCt ++;
            selectedUserIdArry.push(o.value);
            selectedUserNameArry.push($.trim(o.nextSibling.nodeValue));
        }
    });
    var selectedUserIdArryStr = selectedUserIdArry.join(",");
    var selectedUserNameArryStr = selectedUserNameArry.join(",");

    $("#EMPLOYEE_ID").val(selectedUserIdArryStr);
    $("#EMPLYEE_NAMES").val(selectedUserNameArryStr);

    closehidebox();
}

function showOnDutyDiaryPage(id){
    //alert(id);
    clickType = "20";
    psId = "";
    $("#change_size").die();
    $("i").removeClass("rightNav_icon1");
    $("#test3").removeClass().addClass("rightNav_icon1");
    $("#contentDiv").removeClass().addClass("map_con clearfix");
    $("#psx20").removeClass("current");
    $("#psx3").addClass("current");
    $("#tools").hide();
    var ifHtml = ' <iframe frameborder="0" marginheight="0" marginwidth="0" scrolling="none" id="contentIfrDuty" ' +
        'name="contentIfrDuty" style="height: 100%; width: 100%;" src=""></iframe>';
    $("#contentDiv").html(ifHtml);
    resizePAPagePei();
    $("#contentIfrDuty").attr("src",encodeURI(ctx+"/jsp/portal/onduty/ondutyListBase.jsp?itemId=" + id));
}



/**************************************peixizhu add 值班日志************************************************/

// 确认选择————值班人员
function makeSureSelect(){
    var userId = [];
    var userName = [];
    $("input[name='check']").each(function(i, o){
        if(o.checked){
            userId.push(o.value);
            userName.push($.trim(o.nextSibling.nodeValue));
        }
    });
    if(userId.length == 1){
        var selectUserId = userId.join(",");
        var selectUserName = userName.join(",");
        $("#employee_id").val(selectUserId);
        $("#employee").val(selectUserName);
    }
    else {
        top.asyncbox.alert("请选择一个值班人员！","信息提示");
    }
    $(".duty_add_hidebox").hide();
}

// 确认选择————记录类型
function makeSelectNoteType(){
    var codeValue = [];
    var codeName = [];
    $("input[name='checkType']").each(function (i, o) {
        if (o.checked) {
            codeValue.push(o.value);
            codeName.push($.trim(o.nextSibling.nodeValue));
        }
    });
    if(codeValue.length == 1){
        var selectCodeValue = codeValue;
        var selectCodeName = codeName;
        $("#noteType_id").val(selectCodeValue);
        $("#noteType").val(selectCodeName);
    }else {
        top.asyncbox.alert("请选择一个记录类型！","信息提示");
    }
    $(".duty_add_hidebox").hide();
}

// 展示记录类型
function showDutyNoteType(){
    $("#noteTypeList").html(''); // 先清空历史记录再查询
    $.ajax({
        url: "ondutyAction_getDutyNoteType",
        type: "post",
        //提交方式：post、get
        dataType: "html",
        //后台返回的响应数据形式json、xml、html、text、script、_default
        data: $("#dataFieldForm").serialize(),
        //提交form表单的形式传送参数， #searchForm为表单的ID
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        //指定浏览器传输form表单参数时采用的字符集
        cache: false,
        timeout: 1000 * 15,
        success: function(data) { //响应成功后执行的方法体
            var jsonObj = eval("(" + data + ")");
            var len = jsonObj.length;
            for (var i = 0; i < len; i++) {
                var str ="<a href='javascript:;'>"+ "<label>"+"<input type='radio' value='"
                    + jsonObj[i].code_value+"' name='checkType' />" +jsonObj[i].code_name+"</label>"+"</a>"+"<br/>";
                $("#noteTypeList").append(str);
            }
        },
        error: function() { //响应错误后执行的方法体s
            //top.asyncbox.alert("查询失败","信息提示");
            top.easyDialog.open({
                container: {
                    header: LANG["pro_management_prompt"],
                    content: LANG["pro_management_requesttimeout"],
                    noFn: true,
                    noText:LANG["pro_management_determine"]
                },
                fixed: false
            });
        }
    });
}


// 展示值班人员
function showDutyMan(){
    var orgId = $(window.frames["contentIfrDuty"].document).find("#orgSelect").val();

    $("#dutyManList",parent.document).html('');  // 先清空历史记录再查询
    $.ajax({
        url: "ondutyAction_getDutyUserPage",
        type: "post",
        //提交方式：post、get
        dataType: "html",
        //后台返回的响应数据形式json、xml、html、text、script、_default
        data: {"ORG_ID": orgId},
        //提交form表单的形式传送参数， #searchForm为表单的ID
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        //指定浏览器传输form表单参数时采用的字符集
        cache: false,
        timeout: 1000 * 15,
        success: function(data) { //响应成功后执行的方法体
            var jsonObj = eval("(" + data + ")");
            var len = jsonObj.length;
            for (var i = 0; i < len; i++) {
                var html ="<a href='javascript:;'>"+ "<label>"+"<input type='radio' value='"
                    + jsonObj[i].userid+"' name='check' />" +jsonObj[i].username+" "+"("+jsonObj[i].user_account+")"+"</label>"+"</a>"+"<br/>";
                $("#dutyManList",parent.document).append(html);
            }
        },
        error: function() { //响应错误后执行的方法体s
            //top.asyncbox.alert("查询失败","信息提示");
            top.easyDialog.open({
                container: {
                    header: LANG["pro_management_prompt"],
                    content: LANG["pro_management_requesttimeout"],
                    noFn: true,
                    noText:LANG["pro_management_determine"]
                },
                fixed: false
            });
        }
    });
}


$(function () {
    $(".duty_add").click(function () {
        $(this).siblings(".duty_add_hidebox").show();
    });
    $(".duty_add_hidebox_close").click(function () {
        $(this).parents().parents(".duty_add_hidebox").hide();
    });
});

$(function(){
    $(".ygshow_con").css("height",$(window).height()-100);
    $(".ygshow_con").css("width",$(window).width()-240);
    $(".Popup-iframe").css("width",$(window).width()-240);
    $(".Popup-iframe").css("height",$(window).height()-160)
});

$(window).resize(function(){
    $(".ygshow_con").css("height",$(window).height()-100);
    $(".ygshow_con").css("width",$(window).width()-240);
    $(".Popup-iframe").css("width",$(window).width()-240);
    $(".Popup-iframe").css("height",$(window).height()-160)
});

function closeDetailInfo(){
    $("#showDetailInfo").attr("src","");
    $("#showDetailInfoframe").hide();
}

function chooseTemplateById(temId){
    $("iframe[id^=xubox_iframe]")[0].contentWindow.addStepsFromTemplate(temId);
}
