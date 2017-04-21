/** *业务方法开始** */
var clearSetInterval = null;
var isIE = false;
var psId = "";
var channelId = "";
var devCode = "";
var deviceType = "";
var powerList = null;
var exportStr="";
// 翻页参数
var curPage = 1;
var h = $(window).height() - 75;
//var size = parseInt(h / 50);
var size = 10;
var rowCount = 0;

$(document).ready(function (){

    //页面宽度计算调整
    /*var w = $(window).width();
     w = w - 75 - 210 +65;
     $(".if_map_pic").width(w);
     var cw = $(window).width();
     if ( cw <= 1570 && cw > 1340){
     $(".myStat").attr('data-dimension','320');
     }else if( cw <= 1340){
     $(".myStat").attr('data-dimension','280');
     }

     var width = cw-338;
     width = width + "px";
     //$("#report_mess").width(w-20);

     //$("#liebiao").height($(window).height() - 64);//树的位置
     //$("#report_mess").height($(window).height() - 153);*/
    //getPsDataResetPage();2016 08 04 wangli 修改展示树的方式
    //2016 08 04 wangli
    if ($("#psDetail") != null) {
        initPage();
    }
    //默认展示第一个树节点的电站信息
    var psid = $("#powerList ul li:eq(0)") .attr("id");
    //初始化时间,默认展示昨天的数据
    initTime();

    //  getAndOutlet(psid);//2016 05 09  初始化的时候并网点值
    //yourFunction(psid,'');//修改有两个参数 初始化时候 另外一个条件为空
    //showDateValue();

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
    // 表格重绘
    var type = $("#reporttype").val();
    if(!type){type="";}
    if(type  == "" || type.trim() == LANG.station_report_dailyreport) {
        //  reDisplayTable("#dailyreport", "#dailyreportbody");
    } else if(type.trim() == LANG.station_report_monthreport) {
        // 	reDisplayTable("#monthreport", "#monthreportbody");
    } else if(type.trim() == LANG.station_report_yearreport) {
        //		 reDisplayTable("#yearreport", "#yearreportbody");
    }else if(type.trim() == LANG.station_report_statisticalreport) {
        // 	reDisplayTable("#yfdtj", "#yfdtjbody");
    }

    //刷新时间未点击时灰色
    $(".abcd").css({"opacity":"0.7"});
    $(".abcd em").css({"opacity":"0.7"});
    $(".allsite_dateriCheckbox").click(function(){
        if($(".allsite_dateriCheckbox").attr("checked") == 'checked'){
            $(".abcd").css({"opacity":"1"});
            $(".abcd em").css({"opacity":"1"})
        }else{
            $(".abcd").css({"opacity":"0.7"});
            $(".abcd em").css({"opacity":"0.7"})
        }

    });


    $(".allsite_datej a").click(function(){
        var ch = $(this).parent().attr("ch");
        var date_em1 = $(this).parent().find("i").text();
        if(ch)
        {
            if($(this).attr("class") == "allsite_dateUpBtn1")//+
            {
                date_em1++;
                $(this).parent().find("i").text(date_em1);
            }else
            {
                date_em1--;
                if(date_em1 <= 0)
                {
                    date_em1 = 0;
                }
                $(this).parent().find("i").text(date_em1);
            }
        }else
        {
            if($(".allsite_dateriCheckbox").attr("checked") == 'checked')
            {

                if($(this).attr("class") == "allsite_dateUpBtn1")//+
                {
                    date_em1++;
                    $(this).parent().find("i").text(date_em1);
                }else
                {
                    date_em1--;
                    if(date_em1 <= 0)
                    {
                        date_em1 = 0;
                    }
                    $(this).parent().find("i").text(date_em1);
                }
            }else {

            }
        }
    });


    $(".form_option a").hover(function(){
        $(this).find(".secondnav_bg2").fadeIn(200);
    },function(){
        $(this).find(".secondnav_bg2").fadeOut(200);
    });



    $(".content-8").mCustomScrollbar({
        axis:"yx",
        scrollButtons:{enable:true},
        theme:"3d",
        scrollbarPosition:"outside"
    });





    $(".wrap").find("#day").find("li").live("click",function(){
        var wrap_id = $(this).parents(".wrap").attr("id");
        if(wrap_id == "wrap1"){
            if($(this).text()==""){
            }else{
                $(this).addClass("today");
                $(this).siblings().removeClass("today");
                $(this).parent().siblings().children("li").removeClass("today");
            }


        }else{
            $(this).parent(".dayList").addClass("dayList_c");
            $(this).parent(".dayList").siblings().removeClass("dayList_c");

        }
    });



    //月、季、年的样式添加删除

    $(".change_size").live('click',function(){
        var hasMap_bg = $("#map_bg").hasClass("map_bg");
        var map_html = $(".map_pic").html();
        if(hasMap_bg){
            $("#map_bg").empty().removeClass("map_bg");
        }else{
            $("#map_bg").html(map_html).addClass("map_bg");
        }


    });

    $(document).keyup(function(event){
        switch(event.keyCode) {
            case 27:
                $("#map_bg").empty().removeClass("map_bg");
                break;
            case 96:
                $("#map_bg").empty().removeClass("map_bg");
                break;
        }
    });

    //select 下拉
    $(".select_down").toggle(function(){
        $(this).find("ul").slideDown(200);
    },function(){
        $(this).find("ul").slideUp(200);
    });

    $(".select_down ul li").click(function(){
        var ul_li = $(this).text();
        $(this).parent().parent("span").find(".now_a").text(ul_li);
    });

    document.onclick=function(e){
        var e=e?e:window.event;
        var tar = e.srcElement||e.target;
        if(tar.id!="select_down"){
            $(".select_down").find("ul").slideUp(200);
        }
    };

    //地图选项卡

    $("#map_select_wraphd a").click(function(){
        var now_a = $(this).index()+1;
        //查看当前点击的是否是本身
        if($(this).find('i').hasClass('a'+now_a))  //有表示已选中状态
        {
            $(this).find('i').removeClass('a'+now_a);
            $(".map_select_wrap").animate({"height":"30px"},500);
            $(".map_select_"+now_a).hide();
        }else
        {
            $("#map_select_wraphd a").each(function(i){
                var ab = i+1;
                $(".map_select_"+ab).hide();
                $(this).find('i').removeClass('a'+ab);
            });
            if (now_a == 4){
                $(".map_select_wrap").animate({"height":"180px"},500);
            }else{
                $(".map_select_wrap").animate({"height":"80px"},500);
            }
            $(this).find('i').addClass("a"+now_a);
            $(".map_select_"+now_a).show();
        }

    });

    $(".condition_btn").live('click',function(){
        var _top = $(".condition_other").css("display");
        if(_top == 'none')
        {
            $(".condition").animate({"top":"-175px;"},1500);
            $(".condition_other").fadeIn(100);
        }else
        {
            $(".condition_other").fadeOut(100);
            $(".condition").animate({"top":"0px;"},1500);
        }
    });





    $(window).resize(function(){
        // 表格重绘
        var type = $("#reporttype").val();
        if(!type){type="";}
        if(type  == "" || type.trim() == LANG.station_report_dailyreport) {
            reDisplayTable("#dailyreport", "#dailyreportbody");
        }  else if(type.trim() == LANG.station_report_monthreport) {
            reDisplayTable("#monthreport", "#monthreportbody");
        } else if(type.trim() == LANG.station_report_yearreport) {
            reDisplayTable("#yearreport", "#yearreportbody");
        }else if(type.trim() == LANG.station_report_statisticalreport) {
            reDisplayTable("#yfdtj", "#yfdtjbody");
        }
    });
});


function initTime() {
    var d = new Date();
    //  d.setTime(d.getTime()-24*60*60*1000);
    var month = d.getMonth()+1;
    if(month < 10) {
        month = "0" + month;
    }
    var date = d.getDate();
    if(date < 10) {
        date = "0" + date;
    }
    if(flag==0){//日
        var s = d.getFullYear()+"-" + month + "-" + date;

    }else if(flag==1){//月
        if(langFlag=='en'){//英文情况下  显示日期
            var s = d.getFullYear()+"-" + month;
        }else{
            var s = d.getFullYear()+"-" + month+LANG["station_report_month"];
        }

    }else if(flag==2){//分时发电
        var s = d.getFullYear()+"-" + month+LANG["station_report_month"];

    } else{//年
        if(langFlag=='en'){//英文情况下  显示日期
            var s = d.getFullYear() ;
        }else{
            var s = d.getFullYear()+LANG["station_report_year"] ;
        }

    }
    $("#chooseDate").val(s)
}

function showDateValue() {
    youFunction(psId,uuId);
}


function exportToExcel() {
    //
    var psId=$("#stationid").val();
    var bNodata = false;
    var psname = $("#" + psId).find("a").html();
    var datetime = reportDateTime; // 改 reportDateTime+'月' 为 reportDateTime 裴习柱 2016-08-24
    var type = $("#reporttype").val();
    if(type==2){//月报
        if(reportDateTime.substring(5,7)<10){
            reportDateTime=reportDateTime.substring(0,4)+"-0"+reportDateTime.substring(5,7);
        }else{
            reportDateTime=reportDateTime.substring(0,4)+"-"+reportDateTime.substring(5,7);
        }
    }
    var reporttype = "";
    var excel_title = "";
    var installedpower = LANG.station_report_installedpower;

    //if($("#and_outlets").find("option:selected").text()!='全部'){
    //    var  andOutlet=$("#and_outlets").find("option:selected").text();
    //}else{
    //    andOutlet='并网点';
    //}
    //默认导出运行日报
    if(type  == "" ) {
        type = LANG.station_report_dailyreport;
        if($("#dailyreportbody tr").length==0){
            bNodata = true;
        }
        excel_title = psName +deviceName+ datetime + LANG.station_report_dailyreport;
    }
    //start 2016 07 18 wangli
    //if(type.trim() == LANG.station_report_dailyreport) {
    if(type == 1) {
        datetime = datetime.split("-")[0] +LANG.common_year+ datetime.split("-")[1]+LANG.common_month+ datetime.split("-")[2]+LANG.common_day;
        type = 1;
        if($("#dailyreportbody tr").length==0){
            bNodata = true;
        }
        excel_title = psName+deviceName + datetime + LANG.station_report_dailyreport;
    }  //start wangli 2016 07 18 else if(type.trim() == LANG.station_report_monthreport) {
    else if(type==2){
        datetime = datetime.replace("-", LANG.common_year);
        type = 2;
        if($("#monthreportbody tr").length==0){
            bNodata = true;
        }
        excel_title = psName +deviceName+ datetime + LANG.station_report_monthreport;
    } ///start wangli 2016 07 18  else if(type.trim() == LANG.station_report_yearreport) {
    else if(type ==3){
        type = 3;
        if($("#yearreportbody tr").length==0){
            bNodata = true;
        }
        excel_title = psName+deviceName + datetime + LANG.station_report_yearreport;
    }// /start wangli 2016 07 18 else if(type.trim() == LANG.station_report_statisticalreport) {
    else if(type ==4) {
        datetime = datetime.replace("-", LANG.common_year);
        type = 4;
        if($("#yfdtjbody tr").length==0){
            bNodata = true;
        }
        excel_title = psName + datetime + LANG.station_report_statisticalreport;
    }
    if(bNodata){
        easyDialog.open({
            container : {
                header : LANG.station_report_prompt,
                content : LANG.station_report_noexport,
                noFn : true,
                noText:LANG["pro_management_determine"]
            },
            fixed : false
        });
        return;
    }

    excel_title=$("#report_name").text()+""+$("report_rl").text();
    if($("#reporttype").val() == "") {
        reporttype = LANG.station_report_dailyreport;
        //star 2016 07 18 wangli
    } else {
        if($("#reporttype").val()==1){//日报
            reporttype=LANG.station_report_dailyreport;
        }else if($("#reporttype").val()==2){
            reporttype=LANG.station_report_monthreport;
        }else if($("#reporttype").val()==3){
            reporttype= LANG.station_report_yearreport;
        }else if($("#reporttype").val()==4){
            reporttype=  LANG.station_report_statisticalreport;
        }
        //reporttype = $("#reporttype").val();
    }
    if(excel_title.indexOf("#")!=-1){
        excel_title= excel_title.replace("#","|");
    }

    //并网点
    var And_outlets=deviceName;
    if(And_outlets.indexOf("#")!=-1){
        And_outlets= And_outlets.replace("#","|");
    }
    //不能用ajax请求，否则不能出现提示框
    var url = ctx + "/psStatementAction_exportPsStationData?type=" + type +"&installedpower="+installedpower+ "&reporttype="+reporttype+ "&title="+LANG.station_report_nav+"&datetime="+reportDateTime+"&exportStr=" + exportStr+"&excel_title="+excel_title+"&andOutlet="+And_outlets;
    location.href= encodeURI(encodeURI(url));
}
//2016 05 10 下拉框触发事件
function selectByOutlet() {
    // debugger
    var uuid=document.getElementById("and_outlets").value;
    //("device_name"+device_name);
    if(''!=uuid&&null!=uuid){
        andOutLetsSize=1;
    }else if(""==uuid){//选全部时候
        var size=showAndSize;
        andOutLetsSize=size;
    }
    youFunction(psId,uuid);


}
//2016 05 09  并网点下拉框
var  andOutLetsSize = 0;//并网点个数
var showAndSize;
function getAndOutlet(psid){
    var params = {};

    //  alert(psid);
    //  alert($("#stationid").val());

    $.ajax({url:"psStatementAction_getAndOutlet",
        data:{
            "params.ps_id":psid
        },
        type:"post",
        dataType:"html",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        timeout:50*1000,
        success:function(data){
            //alert("data"+data);
            var jsonObj = eval("(" + data + ")");
            showAndSize=jsonObj.length;
            andOutLetsSize=jsonObj.length;
            // alert("并网点个数:"+andOutLetsSize);
            var str="";
            str+='<option value ="">'+LANG["station_report_all"]+'</option>';
            $.each(jsonObj,function(n,value) {
                str += '<option value ="'+value.uuid+ '">'+ value.device_name + '</option>';
            });


            $("#and_outlets").html(str);
        },
        error: function() { //响应错误后执行的方法体
            layer.closeAll();
            top.easyDialog.open({
                container: {
                    header: LANG["all_station_prompt"],
                    content: LANG["all_station_requesttimeout"],
                    noFn: true,
                    noText: LANG["pro_management_determine"]
                },
                fixed: false
            });
        }

    });
}
var reportDateTime;//标题时间
var psName;//电站名称
var deviceName="";//并网点
function youFunction(psid,uuid) {
    //debugger
    //隐藏筛选条件
    hidenSelectCondition();
    var type = $("#reporttype").val();    // 根据type类型重新给type赋值，日=1  , 月=2  , 年=3 ,分时统计=4
    var p82202 = "";
    var date=$("#chooseDate").val();
    var flag=$("#dateflag").val();
    if(flag==1){//日
        var chooseDate = date;
        reportDateTime=chooseDate;
    }else if(flag==2){
        if(langFlag=='en'){//英文情况下  显示日期
            chooseDate=date;
        }
        else{
            var chooseDate=date.substring(0,date.lastIndexOf(LANG["station_report_month"]));
        }
        reportDateTime=chooseDate;
    }else if(flag==3){
        var chooseDate = date.substring(0,4);
        dateTime=chooseDate;
        reportDateTime=chooseDate;
    }
    layer.load(0,2);
    $.ajax({url:"psStatementAction_getPsStationValue",
        data:{"params.starttime":chooseDate,
            "params.psid": psid,
            "params.psname": $("#" + psid).find("a").html(),
            "params.uuid":uuid,//添加了
            "params.type": type},
        type:"post",
        dataType:"html",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        timeout:50*1000,
        success:function(data){

            //如果超时，返回数据为空值，其他情况不会出现这个值
            if(data=="") {
                var url = getRootPath() + "/login.jsp";
                var top = getTopWinow();
                top.location.href = url;
            }
            //请求完成后关闭滚动
            layer.closeAll();

            var jsondata=eval("("+data+")");

            //	alert("返回长度为："+jsondata.length);
            if(jsondata == null){
                easyDialog.open({
                    container : {
                        header : LANG.station_report_prompt,
                        content : LANG.station_report_dataexception,
                        noFn : true,
                        noText:LANG["pro_management_determine"]
                    },
                    fixed : false
                });
                return;
            }
            var str = "";
            var theadStr="";

            //初始化标题
            exportStr = '';
            //if($("#and_outlets").find("option:selected").text()!='全部'){
            //    var  andOutlet=$("#and_outlets").find("option:selected").text();
            //}else{
            //    andOutlet='并网点';
            //}
            //根据报表类型展示相应的报表
            if(type == 2) {
                //拼接表头
                theadStr = '<tr>';
                //2016  11 04 wangli ie浏览器 样式调整  电站报表---日月年报表
                theadStr += '<th style="word-wrap:break-word;word-break:break-all">';
                theadStr += LANG.station_report_data;
                exportStr += LANG.station_report_data;
                exportStr += ',';
                theadStr += '</th>';

                if(jsondata.length > 31) {
                    theadStr += '<th style="word-wrap:break-word;word-break:break-all">';
                    theadStr += LANG.station_report_network;
                    exportStr += LANG.station_report_network;
                    exportStr += ',';
                    theadStr += '</th>';
                }
                theadStr += '<th style="word-wrap:break-word;word-break:break-all">';
                theadStr += LANG.station_report_avgtemperature+'(℃)';
                exportStr += LANG.station_report_avgtemperature+'(℃)';
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th style="word-wrap:break-word;word-break:break-all">';
                theadStr += LANG.pic_planeradiationquantity+'(Wh/m2)';
                exportStr += LANG.pic_planeradiationquantity+'(Wh/m2)';
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th>';
                theadStr += LANG.station_report_sunshinehours+'(h)';
                exportStr += LANG.station_report_sunshinehours+'(h)';
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th style="word-wrap:break-word;word-break:break-all">';
                theadStr += LANG.station_report_daycapacity+'(kWh)';
                exportStr += LANG.station_report_daycapacity+'(kWh)';
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th>';
                theadStr += LANG.station_report_usehours+'(h)';
                exportStr += LANG.station_report_usehours+'(h)';
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th style="word-wrap:break-word;word-break:break-all">';
                theadStr += LANG.station_report_monthcapacity_pei;//  裴习柱 修改  2016-09-01
                exportStr += LANG.station_report_monthcapacity_pei;//  裴习柱 修改  2016-09-01
                theadStr += '</th>';
                theadStr += '</tr>';
                $("#monthreport thead").html(theadStr);
                $("#headerTable thead").html(theadStr);
                $("#report_name").text("--"+LANG.station_report_stamonthreport);
                $("#report_rl").text("("+LANG.station_report_installedpower+":--kWp)");
                $.each(jsondata,function(n,value) {
                    if( value.p82202 != "--") {
                        p82202 =  value.p82202;
                    }
                    psName=value.psname;

                    if(value.psname != undefined && value.psname != "undefined") {
                        //裴习柱 add
                        //
                        var stamonthreport=chooseDate.substring(0,chooseDate.lastIndexOf(LANG["station_report_month"] ));
                        var flag=chooseDate.substring(5,7);
                        if(flag<10){
                            // stamonthreport=chooseDate.substring(0,4)+"-0"+chooseDate.substring(5,6);
                            stamonthreport=chooseDate.substring(0,4)+"-"+chooseDate.substring(5,7);

                        }else if(flag>=10){
                            stamonthreport=chooseDate.substring(0,4)+"-"+chooseDate.substring(5,7);
                        }

                        //var stamonthreportTime = stamonthreport.replace(/-/g,'/');
                        var stamonthreportTime = stamonthreport;
                        $("#report_name").text(value.psname+" " +deviceName+" "+ LANG.station_report_monthreport+" " + stamonthreportTime);
                        $("#report_rl").text("("+LANG.station_report_installedpower+":" + formatDesignEnergyUnit(p82202) + ")");
                    }
                    str+='<tr>';
                    //合并
                    if(andOutLetsSize != 0){
                        if(n%andOutLetsSize==0){
                            str+='<td rowspan='+andOutLetsSize+'>'+value.time_stamp+'</td>';
                        }
                    }else { // 如果 andOutLetsSize=0 则直接加载 time_stamp  裴习柱 2016-08-24
                        str+='<td>'+value.time_stamp+'</td>';
                    }
                    if(jsondata.length > 31) {
                        str+='<td>'+value.device_name+'</td>';
                    }

                    str+='<td>'+value.p2009+'</td>';
                    str+='<td>'+value.p2003+'</td>';
                    str+='<td>'+value.validhour+'</td>';
                    str+='<td>'+value.p8062+'</td>';
                    str+='<td>'+value.p8062_p82202+'</td>';
                    str+='<td>'+value.p8030_p8030+'</td>';
                    str+='</tr>';
                });

                $("#monthreportbody").html(str);
                $("#monthreport").css("display","block");
                $("#weekreport").css("display","none");
                $("#yearreport").css("display","none");
                $("#dailyreport").css("display","none");
                $("#ydlfx").css("display","none");
                $("#yfdtj").css("display","none");
                reDisplayTable("#monthreport", "#monthreportbody");
            } else if(type == 3) {
                theadStr = '<tr>';
                theadStr += '<th>';
                theadStr += LANG.station_report_data;
                exportStr += LANG.station_report_data;
                exportStr += ',';
                theadStr += '</th>';

                if(jsondata.length >= 24) {
                    theadStr += '<th>';
                    theadStr += LANG.station_report_network;
                    exportStr += LANG.station_report_network;
                    exportStr += ',';
                    theadStr += '</th>';

                }
                theadStr += '<th>';
                theadStr += LANG.station_report_avgtemperature+'(℃)';
                exportStr += LANG.station_report_avgtemperature+'(℃)';
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th>';
                theadStr += LANG.pic_planeradiationquantity+'(Wh/m2)';
                exportStr += LANG.pic_planeradiationquantity+'(Wh/m2)';
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th>';
                theadStr += LANG.station_report_usehours+'(h)';
                exportStr += LANG.station_report_usehours+'(h)';
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th>';
                theadStr += LANG.station_report_monthirradiation+'(Wh/m2)';
                exportStr += LANG.station_report_monthirradiation+'(Wh/m2)';
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th>';
                theadStr += LANG.station_report_monthcapacity_pei; //  裴习柱 修改  2016-09-01
                exportStr += LANG.station_report_monthcapacity_pei;//  裴习柱 修改  2016-09-01
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th>';
                theadStr += LANG.station_report_yearcapacity_pei;//  裴习柱 修改  2016-09-01
                exportStr += LANG.station_report_yearcapacity_pei;//  裴习柱 修改  2016-09-01
                theadStr += '</th>';
                theadStr += '</tr>';
                $("#yearreport thead").html(theadStr);
                $("#headerTable thead").html(theadStr);

                $("#report_name").text("--"+LANG.station_report_stayearreport);
                $("#report_rl").text("("+LANG.station_report_installedpower+":--kWp)");

                $.each(jsondata,function(n,value) {
                    //	  n = n + 1;
                    if( value.p82202 != "--") {
                        p82202 =  value.p82202;
                    }
                    psName=value.psname;
                    if(value.psname != undefined && value.psname != "undefined") {
                        //裴习柱 add
                        var stayearreport = $("#chooseDate").val();
                        //var stayearreportTime = stayearreport.replace(/-/g,'/');
                        var stayearreportTime = stayearreport.substring(0,4);
                        $("#report_name").text(value.psname+" " +deviceName+" "+ LANG.station_report_yearreport +" "+ stayearreportTime);
                        $("#report_rl").text("("+LANG.station_report_installedpower+":" + formatDesignEnergyUnit(p82202) + ")");
                    }

                    str+='<tr>';
                    if(andOutLetsSize != 0){
                        if(n%andOutLetsSize==0){
                            str+='<td rowspan='+andOutLetsSize+'>'+value.time_stamp+'</td>';
                        }
                    }else { // 如果 andOutLetsSize=0 则直接加载 time_stamp  裴习柱 2016-08-24
                        str+='<td>'+value.time_stamp+'</td>';
                    }
                    if(jsondata.length >= 24) {
                        str+='<td>'+value.device_name+'</td>';
                    }

                    str+='<td>'+value.p2009+'</td>';
                    str+='<td>'+value.p2003+'</td>';
                    str+='<td>'+value.p8030_p82202+'</td>';
                    str+='<td>'+value.ljfz+'</td>';
                    str+='<td>'+value.p8030_mon+'</td>';
                    str+='<td>'+value.p8030_year+'</td>';
                    str+='</tr>';
                });

                $("#yearreportbody").html(str);
                $("#yearreport").css("display","block");
                $("#weekreport").css("display","none");
                $("#monthreport").css("display","none");
                $("#dailyreport").css("display","none");
                $("#ydlfx").css("display","none");
                $("#yfdtj").css("display","none");
                reDisplayTable("#yearreport", "#yearreportbody");
            }  else if(type == 4) {
                theadStr = '<tr>';
                theadStr += '<th width="30px">';
                theadStr += LANG.station_report_data;
                exportStr += LANG.station_report_data;
                exportStr += ',';
                theadStr += '</th>';

                if(jsondata.length > 31) {
                    theadStr += '<th>';
                    theadStr += LANG.station_report_network;
                    exportStr += LANG.station_report_network;
                    exportStr += ',';
                    theadStr += '</th>';
                }
                theadStr += '<th>';
                theadStr += LANG.station_report_daycapacity+'(kWh)';
                exportStr += LANG.station_report_daycapacity+'(kWh)';
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th>';
                theadStr += LANG.station_report_maxhourscapacity+'kWh)';
                exportStr += LANG.station_report_maxhourscapacity+'kWh)';
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th>';
                theadStr += LANG.station_report_maxpowertime;
                exportStr += LANG.station_report_maxpowertime;
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th>';
                theadStr += LANG.station_report_sharpcapacity+'(kWh)';
                exportStr += LANG.station_report_sharpcapacity+'(kWh)';
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th>';
                theadStr += LANG.station_report_peakcapacity+'(kWh)';
                exportStr += LANG.station_report_peakcapacity+'(kWh)';
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th>';
                theadStr += LANG.station_report_usuallycapacity+'(kWh)';
                exportStr += LANG.station_report_usuallycapacity+'(kWh)';
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th>';
                theadStr += LANG.station_report_valleycapacity+'(kWh)';
                exportStr += LANG.station_report_valleycapacity+'(kWh)';
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th>';
                theadStr += LANG.station_report_sharpusecapacity+'(kWh)';
                exportStr += LANG.station_report_sharpusecapacity+'(kWh)';
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th>';
                theadStr += LANG.station_report_peakusecapacity+'(kWh)';
                exportStr += LANG.station_report_peakusecapacity+'(kWh)';
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th>';
                theadStr += LANG.station_report_usuallyusecapacity+'(kWh)';
                exportStr += LANG.station_report_usuallyusecapacity+'(kWh)';
                exportStr += ',';
                theadStr += '</th>';
                theadStr += '<th>';
                theadStr += LANG.station_report_valleyusecapacity+'(kWh)';
                exportStr += LANG.station_report_valleyusecapacity+'(kWh)';
                theadStr += '</th>';
                theadStr += '</tr>';
                $("#yfdtj thead").html(theadStr);
                $("#headerTable thead").html(theadStr);
                $("#report_name").text("--"+LANG.station_report_stastatisticalreport);
                $("#report_rl").text("("+LANG.station_report_installedpower+":--kWp)");
                $.each(jsondata,function(n,value) {
                    //
                    if(value.p82202 != "--") {
                        p82202 = value.p82202;
                    }
                    psName=value.psname;
                    if(value.psname != undefined && value.psname != "undefined") {
                        //裴习柱 add
                        //var stastatisticalreport = $("#start.Wdate").val();
                        //var stastatisticalreportTime = stastatisticalreport.replace(/-/g,'/');
                        $("#report_name").text(value.psname + LANG.station_report_stastatisticalreport);
                        $("#report_rl").text("("+LANG.station_report_installedpower+":" + formatDesignEnergyUnit(p82202) + ")");
                    }
                    str+='<tr>';
                    if(andOutLetsSize != 0){
                        if(n%andOutLetsSize==0) {
                            str += '<td rowspan='+andOutLetsSize+'>' + value.time_stamp.replace(/\d+LANG.station_report_month/g, "") + '</td>';
                        }
                    }else { // 如果 andOutLetsSize=0 则直接加载 time_stamp  裴习柱 2016-08-24
                        str += '<td>' + value.time_stamp.replace(/\d+LANG.station_report_month/g, "") + '</td>';
                    }
                    if(jsondata.length > 31) {
                        str+='<td>'+value.device_name+'</td>';
                    }
                    str+='<td>'+value.p8030_day+'</td>';
                    str+='<td>'+value.max_val+'</td>';
                    str+='<td>'+value.max_time+'</td>';
                    str+='<td>'+value.p8058+'</td>';
                    str+='<td>'+value.p8034+'</td>';
                    str+='<td>'+value.p8042+'</td>';
                    str+='<td>'+value.p8038+'</td>';
                    str+='<td>'+value.p8059+'</td>';
                    str+='<td>'+value.p8035+'</td>';
                    str+='<td>'+value.p8043+'</td>';
                    str+='<td>'+value.p8039+'</td>';
                    str+='</tr>';
                });

                $("#yfdtjbody").html(str);

                $("#yfdtj").css("display","block");
                $("#yearreport").css("display","none");
                $("#weekreport").css("display","none");
                $("#monthreport").css("display","none");
                $("#dailyreport").css("display","none");
                $("#ydlfx").css("display","none");
                reDisplayTable("#yfdtj", "#yfdtjbody");
            } else {
                //拼接日报表头
                theadStr='<tr>';
                theadStr+='<th>';
                theadStr+=LANG.station_report_time;
                exportStr += LANG.station_report_time;
                exportStr += ',';
                theadStr+='</th>';
                if(jsondata.length >= 48) {
                    theadStr+='<th>';
                    theadStr+=LANG.station_report_network;
                    exportStr += LANG.station_report_network;
                    exportStr += ',';
                    theadStr+='</th>';
                }
                theadStr+='<th>';
                theadStr+=LANG.station_report_ambienttemperature+'<span style="font-size:12px;">(℃)</span>';
                exportStr += LANG.station_report_ambienttemperature+'(℃)';
                exportStr += ',';
                theadStr+='</th>';
                theadStr+='<th>';
                theadStr+=LANG.station_report_batterytemperature+'<span style="font-size:12px;">(℃)</span>';
                exportStr += LANG.station_report_batterytemperature+'(℃)';
                exportStr += ',';
                theadStr+='</th>';
                theadStr+='<th>';
                theadStr+=LANG.station_report_irradiation+'<span style="font-size:12px;">(W/m2)</span>';
                exportStr += LANG.station_report_irradiation+'(W/m2)';
                exportStr += ',';
                theadStr+='</th>';
                theadStr+='<th>';
                theadStr+=LANG.station_report_windspeed;
                exportStr += LANG.station_report_windspeed;
                exportStr += ',';
                theadStr+='</th>';
                theadStr+='<th>';
                theadStr+=LANG.station_report_winddirection;
                exportStr += LANG.station_report_winddirection;
                exportStr += ',';
                theadStr+='</th>';
                theadStr+='<th>';
                theadStr+='Uab<span style="font-size:12px;">(V)</span>';
                exportStr += 'Ua(V)';
                exportStr += ',';
                theadStr+='</th>';
                theadStr+='<th>';
                theadStr+='Ubc<span style="font-size:12px;">(V)</span>';
                exportStr += 'Ub(V)';
                exportStr += ',';
                theadStr+='</th>';
                theadStr+='<th>';
                theadStr+='Uca<span style="font-size:12px;">(V)</span>';
                exportStr += 'Uc(V)';
                exportStr += ',';
                theadStr+='</th>';
                theadStr+='<th>';
                theadStr+='Ia<span style="font-size:12px;">(A)</span>';
                exportStr += 'Ia(A)';
                exportStr += ',';
                theadStr+='</th>';
                theadStr+='<th>';
                theadStr+='Ib<span style="font-size:12px;">(A)</span>';
                exportStr += 'Ib(A)';
                exportStr += ',';
                theadStr+='</th>';
                theadStr+='<th>';
                theadStr+='Ic<span style="font-size:12px;">(A)</span>';
                exportStr += 'Ic(A)';
                exportStr += ',';
                theadStr+='</th>';
                theadStr+='<th>';
                theadStr+=LANG.station_report_activepower+'<span style="font-size:12px;">(kW)</span>';
                exportStr += LANG.station_report_activepower+'(kW)';
                exportStr += ',';
                theadStr+='</th>';
                theadStr+='<th>';
                theadStr+=LANG.station_report_powergeneration+'<span style="font-size:12px;">(kWh)</span>';
                exportStr += LANG.station_report_powergeneration+'(kWh)';
                exportStr += ',';
                theadStr+='</th>';
                theadStr+='<th>';
                theadStr+=LANG.station_report_daycapacity+'<span style="font-size:12px;">(kWh)</span>';
                exportStr += LANG.station_report_daycapacity+'(kWh)';
                exportStr += ',';
                theadStr+='</th>';
                theadStr+='<th>';
                theadStr+=LANG.station_report_powerfactor;
                exportStr +=LANG.station_report_powerfactor;
                exportStr += ',';
                theadStr+='</th>';
                theadStr+='<th>';
                theadStr+=LANG.station_report_frequency+'<span style="font-size:12px;">(HZ)</span>';
                exportStr +=LANG.station_report_frequency+'(HZ)';
                theadStr+='</th>';
                theadStr+='</tr>';
                $("#dailyreport thead").html(theadStr);
                $("#headerTable thead").html(theadStr);
                $("#report_name").text("--"+LANG.station_report_stadayreport);
                $("#report_rl").text("("+LANG.station_report_installedpower+":--kWp)");
                $.each(jsondata,function(n,value) {

                    if( value.p82202 != "--") {
                        p82202 = value.p82202;
                    }
                    psName=value.psname;
                    if(value.psname != undefined && value.psname != "undefined") {
                        /*  裴习柱 add  */
                        var stadayreport = $(".Wdate").val();
                        var stadayreportTime = stadayreport;

                        $("#report_name").text(value.psname+" "+deviceName+" " + LANG.station_report_dailyreport+" "+stadayreportTime);
                        $("#report_rl").text("("+LANG.station_report_installedpower+":" + formatDesignEnergyUnit(p82202) + ")")
                    }

                    str+='<tr>';
                    if(andOutLetsSize != 0){
                        if(n%andOutLetsSize==0) {
                            str += '<td rowspan='+andOutLetsSize+'>' + value.time_stamp + '</td>';
                        }
                    }else {
                        str += '<td>' + value.time_stamp + '</td>';
                    }

                    if(jsondata.length >= 48) {
                        str+='<td>'+value.device_name+'</td>';
                    }
                    str+='<td>'+value.p2009+'</td>';  //环境温度(℃)
                    str+='<td>'+value.p2010+'</td>';  //电池板温度(℃)
                    str+='<td>'+value.p2003+'</td>';  //辐照度(W/m2)
                    str+='<td>'+value.p2011+'</td>';  //风速
                    str+='<td>'+value.p2013+'</td>';  //风向
                    str+='<td>'+value.p8000+'</td>';  //ua
                    str+='<td>'+value.p8001+'</td>';  //UB
                    str+='<td>'+value.p8002+'</td>';  //Uc
                    str+='<td>'+value.p8006+'</td>';  //Ia
                    str+='<td>'+value.p8007+'</td>';  //Ib
                    str+='<td>'+value.p8008+'</td>';  //Ic
                    str+='<td>'+value.p8018+'</td>';  //有功功率
                    str+='<td>'+value.p8030+'</td>';  //小时发电量
                    str+='<td>'+value.p8062+'</td>';  //日发电量
                    str+='<td>'+value.p8014+'</td>';  //功率因数 p8014
                    str+='<td>'+value.p8064+'</td>'; //频率
                    str+='</tr>';
                });
                $("#dailyreportbody").html(str);

                $("#dailyreport").css("display","block");
                $("#yearreport").css("display","none");
                $("#weekreport").css("display","none");
                $("#monthreport").css("display","none");
                $("#ydlfx").css("display","none");
                $("#yfdtj").css("display","none");
                reDisplayTable("#dailyreport", "#dailyreportbody")
            }
        },
        error:function(){
            layer.closeAll();
            easyDialog.open({
                container : {
                    header : LANG.station_report_prompt,
                    content : LANG.station_report_requesttimeout,
                    noFn : true,
                    noText:LANG["pro_management_determine"]
                },
                fixed : false
            });
        }
    });
}



/**
 * 国际化配置风向
 */
function  checkWindPos(wind) {

    if( wind == 0.0 ) {
        wind = LANG.station_report_bei;
    }  else if(wind == 1.0) {
        wind = LANG.station_report_dbpb;
    }  else if(wind == 2.0) {
        wind = LANG.station_report_db;
    }  else if(wind == 3.0) {
        wind = LANG.station_report_dbpd;
    }  else if(wind == 4.0) {
        wind = LANG.station_report_dong;
    }   else if(wind == 5.0) {
        wind = LANG.station_report_dnpd;
    }  else if(wind == 6.0) {
        wind = LANG.station_report_dn;
    }  else if(wind == 7.0) {
        wind = LANG.station_report_dnpn;
    }  else if(wind == 8.0) {
        wind = LANG.station_report_nan;
    }  else if(wind == 9.0) {
        wind = LANG.station_report_xnpn;
    }  else if(wind == 10.0) {
        wind = LANG.station_report_xn;
    }  else if(wind == 11.0) {
        wind = LANG.station_report_xnpx;
    }  else if(wind == 12.0) {
        wind = LANG.station_report_xi;
    } else if(wind == 13.0) {
        wind = LANG.station_report_xbpx;
    } else if(wind == 14.0) {
        wind = LANG.station_report_xb;
    } else if(wind == 15.0) {
        wind = LANG.station_report_xbpb;
    } else {
        wind = "--";
    }

    return wind;

}

/**
 * 国际化配置风速
 */

function checkWindSpeed(speed) {

    if( speed == 0.0 ) {
        speed = LANG.station_report_wuf;
    }  else if(speed == 1.0) {
        speed = LANG.station_report_rf;
    }  else if(speed == 2.0) {
        speed = LANG.station_report_qingf;
    }  else if(speed == 3.0) {
        speed = LANG.station_report_weif;
    }  else if(speed == 4.0) {
        speed = LANG.station_report_hf;
    }  else if(speed == 5.0) {
        speed = LANG.station_report_qf;
    }  else if(speed == 6.0) {
        speed = LANG.station_report_qiangf;
    }  else if(speed == 7.0) {
        speed = LANG.station_report_jif;
    }  else if(speed == 8.0) {
        speed = LANG.station_report_daf;
    }  else if(speed == 9.0) {
        speed = LANG.station_report_lief;
    }  else if(speed == 10.0) {
        speed = LANG.station_report_quangf;
    }  else if(speed == 11.0) {
        speed = LANG.station_report_baof;
    }  else if(speed == 12.0) {
        speed = LANG.station_report_juf;
    } else {
        speed = "--";
    }

    return speed;
}



/**
 * 通过更改CSS,让表格表头产生悬停效果
 *
 * tableid  表格table id 带有#号前缀
 * tbodyid  表格tbody id 带有#号前缀
 */

function reDisplayTable(tableId, tbodyid){
    var tableThSizeArray = [];
    // 保存初始表头单元格宽度
    $(tableId).find("thead").find("th").each(function(i){
        var thWidth = $(this).width();
        tableThSizeArray.push(thWidth);
    });

    var tableWidth = $(tableId).width();
    var tableHeadWidth =  $(tableId).find("thead").width();
    var thLength =  $(tableId).find("th").length;
    var addLength = Math.floor((tableWidth - tableHeadWidth)/thLength);
    if(thLength==0) {
        return;
    }
    var lastThlength = tableWidth - tableHeadWidth - addLength * (thLength-1);
    // IE10下表格宽度不自适应调整
    if($.browser.msie || $.browser.mozilla){
        if($.browser.version==10||$.browser.version==11){

            $("#tableHead").find("th").each(function(i){
                if(i==thLength-1){
                    $(this).width(tableThSizeArray[i]+lastThlength);
                } else if(i==0){
                    $(this).width(tableThSizeArray[i]+addLength + 1);
                }else{
                    $(this).width(tableThSizeArray[i]+addLength);
                }
            });
            $(tableId).find("thead").find("th").each(function(i){
                if(i==thLength-1){
                    $(this).width(tableThSizeArray[i]+lastThlength);
                } else {
                    $(this).width(tableThSizeArray[i]+addLength);
                }
            });

        }else {
            $("#tableHead").find("th").each(function(i){
                $(this).width(tableThSizeArray[i]);
            });
        }
    } else {
        $("#tableHead").find("th").each(function(i){
            if(i==thLength-1){
                $(this).width(tableThSizeArray[i]+lastThlength-2);
            } else if(i==0){
                $(this).width(tableThSizeArray[i]+addLength + 1);
            }else{
                $(this).width(tableThSizeArray[i]+addLength);
            }
        });
        $(tableId).find("thead").find("th").each(function(i){
            if(i==thLength-1){
                $(this).width(tableThSizeArray[i]+lastThlength-2);
            } else {
                $(this).width(tableThSizeArray[i]+addLength);
            }
        });
    }
    //  设置表格单元格宽度
//	$("#tableHead").find("th").each(function(i){
    //	$(this).width(tableThSizeArray[i]);
//	});

}
function reDisplayTable_old(tableId, tbodyid){
    //if($(tbodyid).find("tr:first")){ // 防止表格没有数据
    //$(tableId).find("thead").css("display", "none");

    // 第一行数据
    var tableTbodyTd = $(tbodyid).find("tr:first").find("td");
    var tableThSizeArray = [];
    // 保存初始表头单元格宽度
    $(tbodyid).find("tr:first").find("td").each(function(i){
        var thWidth = $(this).width();
        tableThSizeArray.push(thWidth);
    });

    //  设置表格单元格宽度
    $("#headerTable").find("thead").find("th").each(function(i){
        $(this).width(tableThSizeArray[i]);
        $(tableTbodyTd[i]).width(tableThSizeArray[i]);
    });

    if(false){ // 防止表格没有数据
        // 去除所有的样式
        $(tbodyid).removeAttr("style");
        $(tableId).find("thead").removeAttr("style");
        $(tbodyid).find("tr:first").find("td").each(function(i){
            $(this).removeAttr("style");
        });
        $(tableId).find("thead").find("th").each(function(i){
            $(this).removeAttr("style");
        });
        $("#space_adjust").removeAttr("style");
        // 去除表格左边框
        $(tableId).css({"border-left":"0"});

        // 第一行数据
        var tableTbodyTd = $(tbodyid).find("tr:first").find("td");
        var tableThSizeArray = [];
        // 保存初始表头单元格宽度
        $(tbodyid).find("tr:first").find("td").each(function(i){
            var thWidth = $(this).width();
            tableThSizeArray.push(thWidth);
        });

        // 设置表头悬浮css
        $(tableId).find("thead").css({ "display":"block", "position": "absolute", "top": "93px", "left":"0","border-top":"1px solid #e2e2e2" });
        //  设置表格单元格宽度
        $(tableId).find("thead").find("th").each(function(i){
            $(this).width(tableThSizeArray[i]);
            $(tableTbodyTd[i]).width(tableThSizeArray[i]);
        });
        // ie下面重新 tbody margin-top无效
        if($.browser.msie || $.browser.mozilla){
            $("#space_adjust").css({"height":"19px"});
        }


        // 设置tbody的相对位置
        var thHeight = $(tableId).find("thead").height() - 1;
        var marginTop = thHeight + "px" ;
        $(tbodyid).css({"display":"block","margin-top":marginTop,"left":"0"});
    }
}

//// 组件注册方法名称（名称必须统一）
//function getPsDataResetPage() {
//    // 分页查询电站列表并分页
//    //queryPsDataList();
//    powerSearch();
//    pslistPage();
//}
/**
 *
 * 2016 08 04 wangli
 */
//function checkCss(id) {
//    $(".on").removeClass();
//    $("#" + id).removeClass().addClass("on");
//    addCalendarOnClass();
//    $("#stationid").val(id);
//    //$("#psname").val($("#" + id).find("a").html());
//    psId =  id.toString();
//
//    // var type = $("#reporttype").val();
//
//    //  alert(type);
//
//    getAndOutlet(psId);//根据选中的电站展示相应的并网点 2016 05 09
//    youFunction(psId,'');
//}
function checkCss(id,count) {
    //;
    var yesId="#tps"+psId;
    var thisId="#tps"+id;
    if(id!=""&&id!=undefined){
        if($("#selectPsId").length>0){
            $("#selectPsId").val(id);
        }
    }
    if(yesId!=thisId){
        // layer.load(0, 2);
        if(psId!=id || $("#lp" + id).hasClass("on")) {
            $(yesId).hide();
            $(".on").removeClass();
            $("#lp" + id).addClass("on");
            $(thisId).show();
            showTree(id, count);
        }
        getAndOutlet(psId);//
        youFunction(psId, '');
    }
}

function addCalendarOnClass(){
    var type = $("#select_down>a").text();
    if(type.trim() == LANG.station_report_dailyreport) {
        $(".dateWrap_tit ul li :eq(0)").removeClass().addClass("on");
    } else if(type.trim() == LANG.station_report_monthreport || type.trim() == LANG.station_report_statisticalreport) {
        $(".dateWrap_tit ul li :eq(2)").removeClass().addClass("on");
    } else if(type.trim() == LANG.station_report_yearreport) {
        $(".dateWrap_tit ul li :eq(4)").removeClass().addClass("on");
    }else {
        $(".dateWrap_tit ul li :eq(0)").removeClass().addClass("on");
    }
}

//var queryPowerData =function() {
//    var obj = {};
//    obj["size"] = size;
//    obj["curPage"] = curPage;
//    obj["ps_name"] = $("#ps_name").val();
//    obj["ps_type"] = $("#ps_type").val();
//    obj["ps_capacity"] = $("#ps_capacity").val();
//    obj["area_id"] = $("#country_all").val();
//    obj["install_date_start"] = $("#install_date_start").val();
//    var tableJson = Dic.Ajax.request({
//        url : ctx+"/psMapAction_queryPowerList",
//        data : obj
//    });
//    return tableJson;
//};
//
//function powerSearch() {
//    //displaySearchDiv(6);
//    var psData = queryPowerData();
//    powerList = psData.pageList;
//    rowCount = psData.rowCount;
//    var accordian = new DicAccordian();
//    accordian.init('powerList', powerList);
//}

//function pslistPage() {
//    this.size = size;
//    // 此demo通过Ajax加载分页元素
//    var initPagination = function() {
//        var num_entries = rowCount;
//        // 创建分页
//        $("#Pagination").pagination(num_entries, {
//            num_edge_entries : 1, // 边缘页数
//            num_display_entries : 4, // 主体页数
//            callback : pageselectCallback,
//            ellipse_text:"...",
//            Flag:1,
//            items_per_page : size, // 每页显示1项
//            prev_text : '<',
//            next_text : ">"
//        });
//    };
//    function pageselectCallback(page_index, jq) {
//        var new_content = $("#hiddenresult div.result:eq(" + page_index + ")").clone();
//        $("#Searchresult").empty().append(new_content);
//        // 装载对应分页的内容
//        curPage = page_index + 1;
//        powerSearch();
//        if($("#powerList ul li:eq(0)").attr("id")){
//            $("#powerList ul li:eq(0)").trigger("click");
//        }else{
//            $("#stationid").val("");
//        }
//        return false;
//    }
//    // ajax加载
//    $("#hiddenresult").load(loadding_src, null, initPagination);
//}

// 装机功率单位转换 value的默认单位为Wp
function formatDesignEnergyUnit(value){
    var result = "kWp";
    var newValue = Number(value);

    if(newValue >= 0){
        // value < 1000不转换
        if(newValue< 1000){
            result = newValue + "Wp";
        }else if(newValue>=1000 && newValue < 1000000){
            newValue = (Math.round(newValue/10))/100;
            result = newValue + "kWp";
        }else if(1000000 <= newValue && newValue <1000000000){
            newValue = (Math.round(newValue/10000))/100;
            result = newValue + "MWp";
        }else if(newValue >= 1000000000 && newValue <1000000000000 ){
            newValue = (Math.round(newValue/10000000))/100;
            result = newValue + "GWp";
        }else {
            newValue = (Math.round(newValue/10000000000))/100;
            result = newValue + "TWp";
        }
    }
    return result;
}
//展示树
function showTree(id,count){
    var thisId="#tps"+id;
    var c=0;
    if(count==0){c=1}else{c=count-1;}
    psId = id;
    psName = $($(".psName")[c]).val();
    $.ajax({
        url : "psBlockAction_getPsTree",
        type : "post",
        data : {"params.psid":psId,"params.up_device_type":11,"params.device_type":3,"params.level":2,"params.isparent":2},
        dataType: "html",
        timeout:1000*10,
        success : function(data){
            var jsonObj = eval("(" + data + ")");
            var zNodes =jsonObj;
            $.each(zNodes,function(i){
                if(zNodes[i].psLevel==2){
                    showTreeNodeImageByDeviceType(zNodes[i]);
                }
            });
            $.fn.zTree.init($(thisId), setting, zNodes);
        },
        error : function() {//响应错误后执行的方法体
            easyDialog.open({
                container : {
                    header: LANG["all_station_prompt"],
                    content:LANG["all_station_requesttimeout"],
                    noFn : true,
                    noText:LANG["pro_management_determine"]
                },
                fixed : false
            });
        }
    });

}

var setting = {
    view: {
        dblClickExpand: false,
        showLine:false
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        onClick: onClick,
        beforeAsync: beforeAsync,
        onAsyncSuccess: onAsyncSuccess,
        onAsyncError: onAsyncError
    }
};


function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i=0, l=childNodes.length; i<l; i++) {
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes;
    //console.log(childNodes);

}



function onClick(e, treeId, treeNode) {
    initTime();
    var uuid=treeNode.uuid;
    var device_Name=treeNode.name;//并网点名称
    deviceName=device_Name;
    if(uuid==''){//
        var size=showAndSize;
        andOutLetsSize=size;
    }else if(uuid!=''&&uuid!=null) {//如果选中了其中一个并网点 则合并项为1
        andOutLetsSize = 1;
    }
    uuId=uuid;
    youFunction(psId,uuid);


}


//工具栏 搜索 功能
function getPsListData() {
    initPage();
    // 隐藏筛选条件
    hidenSelectCondition();
}
