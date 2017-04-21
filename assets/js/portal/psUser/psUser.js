var faultDialogModifiedFlay = false;
var userDetailModifiedFlay = false;
var pwModifiedFlay = false;
function showFaultDialog() {
    if (userDetailModifiedFlay || pwModifiedFlay) {
        easyDialog.open({
            container: {
                header: LANG["uc_prompt"],
                content: LANG["uc_savecancelmodifiedpro"],
                noFn: true,  noText:LANG["pro_management_determine"]
            },
            fixed: false
        });

        return;
    }
    faultDialogModifiedFlay = true;
    layer.load(0, 2);
    $.ajax({
        url: "userCenterAction_modifyUser",
        type: "post",
        //提交方式：post、get              
        dataType: "html",
        //后台返回的响应数据形式json、xml、html、text、script、_default
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        //指定浏览器传输form表单参数时采用的字符集
        cache: false,
        success: function(data) { //响应成功后执行的方法体
            layer.closeAll();
            $("#userInformation").html(data);
        },
        error: function() { //响应错误后执行的方法体
            //top.asyncbox.alert("查询失败","信息提示");
            layer.closeAll();
        }
    });
}

function modifyUserDetail() {
    if (faultDialogModifiedFlay || pwModifiedFlay) {
        easyDialog.open({
            container: {
                header: LANG["uc_prompt"],
                content: LANG["uc_savecancelmodifiedpro"],
                noFn: true,  noText:LANG["pro_management_determine"]
            },
            fixed: false
        });
        return;
    }
    userDetailModifiedFlay = true;
    layer.load(0, 2);
    $.ajax({
        url: "userCenterAction_modifyUserDetail",
        type: "post",
        //提交方式：post、get              
        dataType: "html",
        //后台返回的响应数据形式json、xml、html、text、script、_default
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        //指定浏览器传输form表单参数时采用的字符集
        cache: false,
        timeout: 1000 * 20,
        success: function(data) { //响应成功后执行的方法体
            $("#userDetail").html(data);
            layer.closeAll();
        },
        error: function() { //响应错误后执行的方法体
            //top.asyncbox.alert("查询失败","信息提示");
            layer.closeAll();
            easyDialog.open({
                container: {
                    header: LANG["uc_prompt"],
                    content: LANG["uc_requesttimeout"],
                    noFn: true,  noText:LANG["pro_management_determine"]
                },
                fixed: false
            });
        }
    });
}
function displayPw() {
    if (userDetailModifiedFlay || faultDialogModifiedFlay) {
        easyDialog.open({
            container: {
                header: LANG["uc_prompt"],
                content: LANG["uc_savecancelmodifiedpro"],
                noFn: true,  noText:LANG["pro_management_determine"]
            },
            fixed: false
        });
        return;
    }

    if(pwModifiedFlay){
        pwModifiedFlay = false;
    } else {
        pwModifiedFlay = true;
    }
    var siteMore = $("#siteMore").parent().siblings().is(":hidden");
    if (siteMore) {
        //2016 11 01 wangli 蓝色版本修改
        //$("#siteMore").children("img").attr("src", ctx+"/jsp/portal/resource/images/minus_img.png");
        $("#siteMore").children("div").removeClass("psuser_image1");
        $("#siteMore").children("div").addClass("psuser_image");
        $("#siteMore").parent().parent().find(".siteMore_div").show();
    } else {
        //2016 11 01 wangli 蓝色版本修改
        $("#siteMore").children("div").removeClass("psuser_image");
        $("#siteMore").children("div").addClass("psuser_image1");
        //$("#siteMore").children("img").attr("src", ctx+"/jsp/portal/resource/images/plus_img.png");
        $("#siteMore").parent().parent().find(".siteMore_div").hide();
    }

}

function closePwDialog() {
    pwModifiedFlay = false;
    $("#oldPassWord").val('');
    $("#newPassWord").val('');
    $("#confirmPassWord").val('');
    var siteMore = $("#siteMore").parent().siblings().is(":hidden");
    if (siteMore) {
        //2016 11 01 wangli 蓝色版本修改
        //$("#siteMore").children("img").attr("src", ctx+"/jsp/portal/resource/images/minus_img.png");
        $("#siteMore").children("div").removeClass("psuser_image1");
        $("#siteMore").children("div").addClass("psuser_image");
        $("#siteMore").parent().parent().find(".siteMore_div").show();
    } else {
        //2016 11 01 wangli 蓝色版本修改
        //$("#siteMore").children("img").attr("src", ctx+"/jsp/portal/resource/images/plus_img.png");
        $("#siteMore").children("div").removeClass("psuser_image");
        $("#siteMore").children("div").addClass("psuser_image1");
        $("#siteMore").parent().parent().find(".siteMore_div").hide();
    }
}

function validatePass(pass) {
    var reg1 = "^[0-9a-zA-Z]{6,12}$";
    var reg2 = "^[0-9]{6,12}$";
    var reg3 = "^[a-zA-Z]{6,12}$";
    var rs1=RegExp(reg1).test(pass);
    var rs2=!RegExp(reg2).test(pass);
    var rs3=!RegExp(reg3).test(pass);
    return rs1 && rs2 && rs3;
}

function savePwDialog(callback) {
    if (($("#oldPassWord").val() == '') || ($("#newPassWord").val() == '') || ($("#confirmPassWord").val() == '')) {
        easyDialog.open({
            container: {
                header: LANG["uc_prompt"],
                content: LANG["uc_passwordblank"],
                noFn: true,  noText:LANG["pro_management_determine"]
            },
            fixed: false
        });

    } else if ($("#newPassWord").val() != $("#confirmPassWord").val()) {
        easyDialog.open({
            container: {
                header: LANG["uc_prompt"],
                content: LANG["uc_passwordnotsame"],
                noFn: true,  noText:LANG["pro_management_determine"]
            },
            fixed: false
        });

    } else if (!validatePass($("#newPassWord").val())) {
        easyDialog.open({
            container: {
                header: LANG["uc_prompt"],
                content: LANG["uc_passwordagainstrule"],
                noFn: true,  noText:LANG["pro_management_determine"]
            },
            fixed: false
        });

    } else {
        var param = {};
        param["oldPassWord"] = $("#oldPassWord").val();
        param["newPassWord"] = $("#newPassWord").val();
        $.ajax({
            url: "userCenterAction_getOldPassWord",
            type: "post",
            //提交方式：post、get              
            dataType: "html",
            //后台返回的响应数据形式json、xml、html、text、script、_default
            data: param,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            //指定浏览器传输form表单参数时采用的字符集
            cache: false,
            timeout: 1000 * 20,
            success: function(data) { //响应成功后执行的方法体     
                if ($.trim(data) == 1) {
                    $.ajax({
                        url: "userCenterAction_modifyPassWord",
                        type: "post",
                        //提交方式：post、get              
                        dataType: "html",
                        //后台返回的响应数据形式json、xml、html、text、script、_default
                        data: param,
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        //指定浏览器传输form表单参数时采用的字符集
                        cache: false,
                        success: function(data) { //响应成功后执行的方法体
                            if ($.trim(data) == 1) {

                                easyDialog.open({
                                    container: {
                                        header: LANG["uc_prompt"],
                                        content: LANG["uc_savesuccess"],
                                        noFn: true,  noText:LANG["pro_management_determine"]
                                    },
                                    fixed: false
                                });
                                //回调函数
                                callback();
                            } else {
                                easyDialog
                                    .open({
                                        container : {
                                            header : LANG["uc_prompt"],
                                            content : LANG["uc_passwordagainstrule"],
                                            noFn : true,
                                            noText : LANG["pro_management_determine"]
                                        },
                                        fixed : false
                                    });
                            }
                        },
                        error: function() { //响应错误后执行的方法体
                            //top.asyncbox.alert("查询失败","信息提示");
                            easyDialog.open({
                                container: {
                                    header: LANG["uc_prompt"],
                                    content: LANG["uc_requesttimeout"],
                                    noFn: true,  noText:LANG["pro_management_determine"]
                                },
                                fixed: false
                            });
                        }
                    });
                    pwModifiedFlay = false;
                } else if ($.trim(data) == 0) {
                    easyDialog.open({
                        container: {
                            header: LANG["uc_prompt"],
                            content: LANG["uc_originpassworderror"],
                            noFn: true,  noText:LANG["pro_management_determine"]
                        },
                        fixed: false
                    });
                } else {
                    easyDialog.open({
                        container: {
                            header: LANG["uc_prompt"],
                            content: LANG["uc_savefailure"],
                            noFn: true,  noText:LANG["pro_management_determine"]
                        },
                        fixed: false
                    });
                }
            },
            error: function() { //响应错误后执行的方法体
                //top.asyncbox.alert("查询失败","信息提示");
            }
        });

    }
}

$(document).ready(function() {
    $(".isDSTElement").hide();
    if(typeof timeZoneId != 'undefined'){
        isTimeZoneDst(timeZoneId);
    }

    //加减切换
    $(".siteMore_tit_btn").click(function() {
        var siteMore = $(this).parent().siblings().is(":hidden");
        if (siteMore) {
            //2016 1101 wangli 蓝色版本修改 start
            $(this).children("div").removeClass("psuser_image1");
            $(this).children("div").addClass("psuser_image");
            //end
            //$(this).children("img").attr("src", ctx+"/jsp/portal/resource/images/minus_img.png");
            $(this).parent().parent().find(".siteMore_div").show();
        } else {
            //2016 11 01 wangli 蓝色版本修改 start
            //$(this).children("img").attr("src", ctx+"/jsp/portal/resource/images/plus_img.png");
            $(this).children("div").removeClass("psuser_image");
            $(this).children("div").addClass("psuser_image1");
            //end
            $(this).parent().parent().find(".siteMore_div").hide();
        }
    });

    $("#sidenav_btn").hover(function(event) {
        event.stopPropagation();
    }).toggle(function(event) {
            $(this).removeClass("sidenav_btn").addClass("sidenav_btnon");
            $(this).parent(".side_nav").removeClass('side_navss');
        },
        function(event) {
            $(this).removeClass("sidenav_btnon").addClass("sidenav_btn");
            $(this).parent(".side_nav").addClass('side_navss');
        });

    //select 下拉
    $(".select_down").bind("click",
        function(e) {
            var sel_block = $(this).find("ul").css("display");
            if (sel_block == 'none') {
                $(this).find("ul").slideDown();
            } else {
                $(this).find("ul").slideUp();
            }
        });

    $(document).bind("click",
        function(e) {
            var target = $(e.target); //获取当前对象
            if (target.closest(".select_down").length == 0) {
                $(".select_down").find("ul").hide();
            } else {
                var chooseIndex = target.closest(".select_down").attr("chooseIndex");
                $.each($(".select_down"),
                    function(n, v) {
                        if (chooseIndex != $(v).attr("chooseIndex")) {
                            $(v).find("ul").hide();
                        }

                    });
            }
        });

    $(".select_down ul li").click(function() {
        var ul_li = $(this).text();
        $(this).parent().parent("span").find(".now_a").text(ul_li);
    });
});

function getCenterPage() {
    $.ajax({
        url: "userCenterAction_getCenterPage",
        type: "post",
        //提交方式：post、get
        dataType: "html",
        //后台返回的响应数据形式json、xml、html、text、script、_default
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        //指定浏览器传输form表单参数时采用的字符集
        cache: false,
        timeout: 1000 * 20,
        success: function(data) { //响应成功后执行的方法体
            $("#listTableDataDiv").html(data);
        },
        error: function() { //响应错误后执行的方法体
            easyDialog.open({
                container: {
                    header: LANG["uc_prompt"],
                    content: LANG["uc_requesttimeout"],
                    noFn: true,  noText:LANG["pro_management_determine"]
                },
                fixed: false
            });
        }
    });
}

//判断时区是否 可以设置夏令时
function isTimeZoneDst(timeZoneId){
    $(".isDSTElement").hide();
    $.ajax({
        url: "userCenterAction_isTimeZoneDst",
        type: "post",
        data: {
            "timeZoneId": timeZoneId
        },
        dataType: "text",
        timeout: 1000 * 3,
        success: function (data) {
            if(data == 1){
                $(".isDSTElement").show();
            }
        },
        error: function () {
        }
    });
}