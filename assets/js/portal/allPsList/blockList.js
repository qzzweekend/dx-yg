var zTree, rMenu;
var psId, psName;
var nodeArray = [];
var legendSelected = {};
var uuId = "";
var gyhCName = "psB_gyh_";//电站单元归一化cookie名称
var echartColors = ['#87CEFA','#FF7F50','#DA72D7','#32CD32','#8EB2F2','#FF69B4','#BA55D3','#D26B6B','#FFA500','#40E0D0','#1E90FF','#E1624B','#948BCE','#00FA9A','#C8B44C','#99BCFF','#FF6666','#3CB371','#B8860B','#30E0E0'];
var symbolList = [
    'circle', 'rectangle', 'triangle', 'diamond',
    'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond',
    'circle', 'rectangle', 'triangle', 'diamond',
    'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond',
    'circle', 'rectangle', 'triangle', 'diamond'
];
var i=0;
var j=0;
var unitInterval;
$(document).ready(function(){
    psId='';
    initechart();
    var isChecked = getCookie(gyhCName+$("#a").val());
    if(isChecked=="checked"){
        $("#chLable").click();
    }
});


var setting = {
    async: {
        enable: true,
        url: "psBlockAction_getPsTree",//树展现到单元
        //url:"psCBoxAction_getPsTree",//树展现到逆变器
        autoParam: ["id=params.up_device_type", "psId=params.psid", "uuid=params.uuid"],
        otherParam: {"params.uuid": uuId},
        dataFilter: filter			//用于对 Ajax 返回数据进行预处理的函数
    },
    view: {
        dblClickExpand: false,
        showLine: true
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        onClick: zTreeOnClick,
        beforeAsync: beforeAsync,
        onAsyncSuccess: onAsyncSuccess,
        onAsyncError: onAsyncError

    }
};

function zTreeOnClick(event, treeId, treeNode) {
    initTime();
    clearTable();
    clearEchart();
    showChart(treeNode,null);
    timeNode=treeNode;
    uuId = treeNode.uuid;
    zTree.expandNode(treeNode);
    window.event.stopPropagation();
}


function dblClickExpand(treeId, treeNode) {
    return treeNode.level > 0;
}


function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i = 0, l = childNodes.length; i < l; i++) {
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
        var type = childNodes[i].deviceType;
        if (childNodes[i].psLevel == 3) {
            if (type == 17) {
                childNodes[i].icon = staticUrl+"/resources/portal/images/a_dy.png";
            }
        }
    }
    //console.log(childNodes);
    return childNodes;
}

var timeNode='';
function onClick(e, treeId, treeNode) {
    initTime();
    clearTable();
    clearEchart();
    showChart(treeNode,null);
    timeNode=treeNode;
    e.stopPropagation();
}

var timeDay ='';

function getBlockTime(){
    var  temp=$("#new_datetimepicker_mask").val();
    var timeDay=temp.substring(0,4)+temp.substring(5,7)+temp.substring(8,11)+temp.slice(11,13)+temp.slice(14,16)+"00";
    while(timeDay.indexOf(" ")!=-1){
        timeDay=timeDay.replace(" ","");
    }
    return timeDay;
}

function getClock() { //$("#allsite_dateDay").val();
    clearInterval(clearSetInterval);
    $(".allsite_dateriCheckbox").attr("checked",false);
    var  temp=$("#new_datetimepicker_mask").val();
    var nowDate=new Date();
    var daybegin = new Date(nowDate.getFullYear(),nowDate.getMonth(),nowDate.getDate(),nowDate.getHours(),nowDate.getMinutes());
    var year1=daybegin.getFullYear();
    var month1=daybegin.getMonth()+1;
    var date1 = daybegin.getDate();
    var hours=daybegin.getHours();
    var minutes=daybegin.getMinutes();
    month1 = month1 >= 10?month1:("0"+month1);
    date1 = date1 >= 10?date1:("0"+date1);
    hours = hours >= 10?hours:("0"+hours);
    minutes = minutes >= 10?minutes:("0"+minutes);
    var m = getFiveMinutes(minutes);
    var beginDate = year1+""+month1+date1+hours+m+"00"; // year1 与 month1 拼接错误    裴习柱  2016-11-08
    if(temp.length>0){
        timeDay=getBlockTime();
        if(timeDay==beginDate){
            clearTable();
            clearEchart();
            showChart(timeNode,null);
            return;
        }
        if(timeDay>beginDate){
            Sungrow.showMsg({
                container : {
                    header: LANG["all_station_prompt"],
                    content:LANG["all_station_writeerror"],
                    noFn : true,
                    noText:LANG["pro_management_determine"]
                },
                fixed : false
            });
            return;
        }
    }else{
        Sungrow.showMsg({
            container : {
                header: LANG["all_station_prompt"],
                content:LANG["all_station_writeerror"],
                noFn : true,
                noText:LANG["pro_management_determine"]
            },
            fixed : false
        });
        return;
    }
    clearEchart();
    showChart(timeNode,timeDay);
}

function getStart() {
    if($("div.tipsy-s")){
        $("div.tipsy-s").remove();
    }
    initTime();

    if(!showChartInterval){ //2016-06-24 ChuD；电站单元 刷新时 记录选中的设备
        clearTable();
        clearEchart();
    }
    //将时间控件里面的时间传递 2016 06 01  http://192.168.0.236:8081/browse/SJE-1465
    var  temp=$("#new_datetimepicker_mask").val();
    var nowDate=new Date();
    var daybegin = new Date(nowDate.getFullYear(),nowDate.getMonth(),nowDate.getDate(),nowDate.getHours(),nowDate.getMinutes());
    var year1=daybegin.getFullYear();
    var month1=daybegin.getMonth()+1;
    var date1 = daybegin.getDate();
    var hours=daybegin.getHours();
    var minutes=daybegin.getMinutes();
    month1 = month1 >= 10?month1:("0"+month1);
    date1 = date1 >= 10?date1:("0"+date1);
    hours = hours >= 10?hours:("0"+hours);
    minutes = minutes >= 10?minutes:("0"+minutes);
    var beginDate = year1+month1+date1+hours+minutes+"00";
    if(temp.length>0){
        timeDay=temp.substring(0,4)+temp.substring(5,7)+temp.substring(8,11)+temp.slice(11,13)+temp.slice(14,16)+"00";
        while(timeDay.indexOf(" ")!=-1){
            timeDay=timeDay.replace(" ","");
        }
        if(timeDay==beginDate){
            if(showChartInterval){
                //2016-06-24 ChuD；电站单元 刷新时 记录选中的设备
                showChartInterval();
            }else{
                clearTable();
                clearEchart();
                showChart(timeNode,null);
            }

            return;
        }
        if(timeDay>beginDate){
            Sungrow.showMsg({
                container : {
                    header: LANG["all_station_prompt"],
                    content:LANG["all_station_writeerror"],
                    noFn : true,
                    noText:LANG["pro_management_determine"]
                },
                fixed : false
            });
            return;
        }
    }else{
        Sungrow.showMsg({
            container : {
                header: LANG["all_station_prompt"],
                content:LANG["all_station_writeerror"],
                noFn : true,
                noText:LANG["pro_management_determine"]
            },
            fixed : false
        });
        return;
    }
    showChart(timeNode,timeDay);
    //showChart(timeNode,null);
}

function showTree(id,count){
    var thisId="#tps"+id;
    var c=0;
    if(count==0){c=1}else{c=count-1;}
    psId = id;
    psName = $($(".psName")[c]).val();
    $.ajax({
        url : "psBlockAction_getPsTree",
        type : "post",
        data : {"params.psid":psId,"params.up_device_type":11,"params.device_type":3,"params.level":2,"params.isparent":1},
        dataType: "html",
        success : function(data){
            //console.log(data);
            var jsonObj = eval("(" + data + ")");
            var zNodes =jsonObj;
            $.each(zNodes,function(i){
                if(zNodes[i].psLevel==2){
                    //var type = zNodes[i].deviceType;
                    showTreeNodeImageByDeviceType(zNodes[i]);
                }
            });
            $.fn.zTree.init($(thisId), setting, zNodes);
            zTree = $.fn.zTree.getZTreeObj("tps" + id);
            //alert(zNodes[0]);
            if(zNodes.length>1){
                zNodes[0].uuid=null;
            }
            timeNode=zNodes[0];
            showChart(zNodes[0],null);
        },
        error : function() {//响应错误后执行的方法体
            Sungrow.showMsg({
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

function clearTable(){
    var optiontable = document.getElementById("psBlock");
    var len=optiontable.rows.length;
    for(var i = len-1; i>0; i--){
        //alert(optiontable.rows.length);
        //alert( optiontable.rows[i].cells[1].innerHTML );
        optiontable.deleteRow(i);
    }
}

var flag=false;
function checkCss(id,count) {
    var yesId="#tps"+psId;
    var thisId="#tps"+id;
    if(id!=""&&id!=undefined){
        if($("#selectPsId").length>0){
            $("#selectPsId").val(id);
        }
    }
    // layer.load(0, 2);
    //if(psId!=id || $("#lp" + id).hasClass("on")){
    if(psId!=id){
        uuId = id;
        $(yesId).hide();
        $(".on").removeClass();
        $("#lp" + id).addClass("on");
        $(thisId).show();
        showTree(id,count);
        clearTable();
        timeNode='';
        timeDay='';
        //showChart(treeNode);
        clearEchart();
        initTime();
        //testVal();
    }

}

function changeGYH(){
    var isChecked = $("#checkbox_c1").attr("checked");
    setCookie(gyhCName+$("#a").val(),isChecked,30);
    clearEchart();
    testVal();
}

function testVal(){
    i=0;
    j=0;
    var pskey="";
    var dataname="";
    $("[name='batchIds'][checked]").each(function(index){
        pskey=$(this).val().split("&")[0];
        //alert(pskey);
        dataname=$(this).val().split("&")[1];
        var pointId_cap = "p81002";//"p81002";//逆变器交流功率  p81001 : 逆变器功率归一化
        var pointId_pow = "p81012";//param["params.ponitId"] = pintId;//"p81012";//逆变器发电量 p81011 : 日等效小时
        var yAxisName_capacity = LANG["all_station_ac_power"]+"(kW)";//交流功率
        var yAxisName_power = LANG["all_station_daily_energy"]+"(kWh)";//"日发电量";
        var isChecked = $("#checkbox_c1").attr("checked");
        if(isChecked=="checked"){
            pointId_cap = "p81001";//"p81002";//逆变器交流功率  p81001 : 逆变器功率归一化
            pointId_pow = "p81011";//param["params.ponitId"] = pintId;//"p81012";//逆变器发电量 p81011 : 日等效小时
            var yAxisName_capacity = LANG["common.glgyh"]+"(kW/kWp)";//交流功率
            var yAxisName_power = LANG["common.dxxs"]+"(kWh/kWp)";//"日发电量";
        }
        setOptionData_capacity(pskey,dataname,pointId_cap,yAxisName_capacity, echartColors[index]);
        setOptionData_power(pskey,dataname,pointId_pow,yAxisName_power, echartColors[index]);
    })


}



var powerLegend = [];
function clearEchart(){
    /*if(myPowerChart!=null){
     myPowerChart = null;
     }

     if(myCapacityChart!=null){
     myCapacityChart = null;
     }*/
    //  每次点击时间刷新echarts时，清空capacityArr、PowerArr，  裴习柱  add  2016-11-08
    capacityArr = [];
    PowerArr = [];
    initechart();
}


function showDetail(ps_id,uuid){
    var size = getPageNum($("#pageId").val());
    //alert(uuid.innerHTML);
    clickType="5";
    $("i").removeClass("rightNav_icon1");
    $(".secondnav li").removeClass("current");
    var param = {};
    param["params.psId"] = ps_id;
    param["params.uuId"] = uuid; // 裴习柱 修改
    param["params.curPageList"] = AllPS.CurPage;
    param["size"] = size;
    param["curPage"] = AllPS.CurPage;
    $("#contentDiv").removeClass().addClass("map_con clearfix");
    $.post("psInverteChartAction_getPsInverteChartPage",param,
        function(data){
            $("#contentDiv").html(data);
            $("#test5").addClass("rightNav_icon1");
            $("#test5").parent().addClass("current");
            $(window).resize();
        });
}

function showChart(obj,time_stamp){
    currentPage = 1;
    //chuD 2016-06-04 : 电站单元添加分页
    obj_pg = obj;
    time_stamp_pg = time_stamp;
    pageList();

    layer.load(0, 2);
    //全屏时隐藏列
    if(fullScreenflag){
        $("tr .expand_display_flag").hide();
    }
}
//交流功率
var capacityArr=[];//2016 09 09
function setOptionData_capacity(pskey,dataname,pintId,yAxisName, color) {
    optionCapacity.color.push(color);
    var URL = "psBlockAction_getCapacityData";//交流功率
    var param = {};
    param["params.pskey"] = pskey;
    param["params.time_stamp"] = timeDay;//getBlockTime();
    param["params.pointId"] = pintId;//"p81002";//逆变器交流功率
    //param["params.ponitId"] = "p81001";//逆变器功率归一化
    /*var capacityJsondata = Dic.Ajax.request({
     url: URL,
     data: param
     });*/
    $.ajax({
        url: URL,
        type: "post",
        dataType: "json",
        data: param,
        success: function (data) {
            var unitCapacityarr=[];
            var capacityJsondata = data;
            var capacityDates = capacityJsondata.xAxis;// 日期
            //var capacityData = dealArray(capacityJsondata.yAxis);
            //alert("交流功率："+capacityData);
            unitCapacityarr=dealArray(capacityJsondata.yAxis);
            //交流功率
            //optionCapacity.legend.data.push(dataname);
            //optionCapacity.color.push(color);
            optionCapacity.xAxis = [{
                type: 'category', // 坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
                data: capacityDates,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    margin: 8,
                    rotate: 0,
                    interval: 7,
                    textStyle: {
                        color: '#1e90aa',
                        fontFamily: 'verdana',
                        fontSize: 10,
                        fontStyle: 'normal'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#4488bb'
                    }
                },
                axisLabel:{
                    textStyle:{
                        color: 'black'
                    }
                }/*,
                 nameTextStyle:{
                 color: 'black'
                 }*/
            }];
            optionCapacity.yAxis = [{
                name : yAxisName,
                position : 'left',
                type : 'value',
                axisLine: {
                    lineStyle: {
                        color: '#4488bb'
                    }
                },
                axisLabel:{
                    textStyle:{
                        color: 'black'
                    }
                }/*,
                 nameTextStyle:{
                 color: 'black'
                 }*/
            }];
            capacityArr.push({
                name: dataname,
                type: 'line',
                data: unitCapacityarr
            });
            //optionCapacity.series.push({
            //	name: dataname, // 系列名称
            //	type: 'line', // 图表类型，折线图line、散点图scatter、柱状图bar、饼图pie、雷达图radar
            //	data: capacityData
            //});
            //myCapacityChart.setOption(optionCapacity);
        },

        complete : function(){
            j++;
            if($("[name='batchIds'][checked]").length==j){
                $("[name='batchIds']").each(function(index){
                    var name = $(this).val().substring($(this).val().indexOf("&")+1);
                    var symbol = symbolList[index];
                    for(var i = 0;i<capacityArr.length;i++){
                        if(capacityArr[i].name==name){
                            capacityArr[i].symbol = symbol;
                            optionCapacity.legend.data.push(name);
                            optionCapacity.series.push(capacityArr[i]);
                            break;
                        }
                    }
                });
                myCapacityChart.setOption(optionCapacity);
                layer.closeAll();
            }
        }
    });
    //$.post(URL,param,function(data){
    //	var capacityJsondata = data;
    //	var capacityDates = capacityJsondata.xAxis;// 日期
    //	var capacityData = dealArray(capacityJsondata.yAxis);
    //	//交流功率
    //	optionCapacity.legend.data.push(dataname);
    //	//optionCapacity.color.push();
    //	optionCapacity.xAxis = [{
    //		type: 'category', // 坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
    //		data: capacityDates,
    //		splitLine: {
    //			show: false
    //		},
    //		axisLabel: {
    //			show: true,
    //			margin: 8,
    //			rotate: 0,
    //			interval: 7,
    //			textStyle: {
    //				color: '#1e90aa',
    //				fontFamily: 'verdana',
    //				fontSize: 10,
    //				fontStyle: 'normal'
    //			}
    //		}
    //	}];
    //	optionCapacity.yAxis = [{
    //		name : yAxisName,
    //		position : 'left',
    //		type : 'value'
    //	}];
    //	optionCapacity.series.push({
    //		name: dataname, // 系列名称
    //		type: 'line', // 图表类型，折线图line、散点图scatter、柱状图bar、饼图pie、雷达图radar
    //		data: capacityData
    //	});
    //	myCapacityChart.setOption(optionCapacity);
    //},"json");

}

//发电量chart
var PowerArr=[];//2016 09 09
function setOptionData_power(pskey,dataname,pintId,yAxisName,color) {
    optionPower.color.push(color);
    var param = {};
    param["params.pskey"] = pskey;
    param["params.time_stamp"] = timeDay;
    param["params.pointId"] = pintId;//"p81012";//逆变器发电量
    //param["params.ponitId"] = "p81011";//逆变器等效小时
    var totalPowerDataURL = "psBlockAction_getCapacityData";//发电量
    /*var powerJsonData = Dic.Ajax.request({
     url: totalPowerDataURL,
     data: param
     });*/
    $.ajax({
        url: totalPowerDataURL,
        type: "post",
        dataType: "json",
        data: param,
        success: function (data) {
            var unitpowerArr = [];
            var powerJsonData = data;
            var powerDates = powerJsonData.xAxis;// 日期
            var powerData = dealArray(powerJsonData.yAxis);
            unitpowerArr= dealArray(powerJsonData.yAxis);//2016 09 10
            //powerLegend.push(dataname);
            //optionPower.legend.data.push(dataname);
            //optionPower.color.push(color);
            optionPower.xAxis = [{
                type: 'category', // 坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
                data: powerDates,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    margin: 8,
                    rotate: 0,
                    interval: 7,
                    textStyle: {
                        color: '#1e90aa',
                        fontFamily: 'verdana',
                        fontSize: 10,
                        fontStyle: 'normal'
                    }
                }
            }];
            optionPower.yAxis = [{
                name: yAxisName,
                position: 'left',
                type: 'value'
            }];
            PowerArr.push({
                name:dataname,
                type:'line',
                data:unitpowerArr
            });
            //optionPower.series.push({
            //	name: dataname, // 系列名称
            //	type: 'line', // 图表类型，折线图line、散点图scatter、柱状图bar、饼图pie、雷达图radar
            //	data: powerData
            //});
            //myPowerChart.setOption(optionPower);
        },
        complete: function () {
            i++;
            if($("[name='batchIds'][checked]").length==i){
                $("[name='batchIds']").each(function(index){
                    var name = $(this).val().substring($(this).val().indexOf("&")+1);
                    var symbol = symbolList[index];
                    for(var i = 0;i<PowerArr.length;i++){
                        if(PowerArr[i].name==name){
                            PowerArr[i].symbol = symbol;
                            optionPower.legend.data.push(name);
                            optionPower.series.push(PowerArr[i]);
                            break;
                        }
                    }
                });
                myPowerChart.setOption(optionPower);
                layer.closeAll();
            }
        }
    });
    //$.post(totalPowerDataURL,param,function(data){
    //	var powerJsonData = data;
    //	var powerDates = powerJsonData.xAxis;// 日期
    //	var powerData = dealArray(powerJsonData.yAxis);
    //	powerLegend.push(dataname);
    //	optionPower.legend.data.push(dataname);
    //	//optionPower.color.push();
    //	optionPower.xAxis = [{
    //		type: 'category', // 坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
    //		data: powerDates,
    //		splitLine: {
    //			show: false
    //		},
    //		axisLabel: {
    //			show: true,
    //			margin: 8,
    //			rotate: 0,
    //			interval: 7,
    //			textStyle: {
    //				color: '#1e90aa',
    //				fontFamily: 'verdana',
    //				fontSize: 10,
    //				fontStyle: 'normal'
    //			}
    //		}
    //	}];
    //	optionPower.yAxis = [{
    //		name : yAxisName,
    //		position : 'left',
    //		type : 'value'
    //	}];
    //	optionPower.series.push({
    //		name: dataname, // 系列名称
    //		type: 'line', // 图表类型，折线图line、散点图scatter、柱状图bar、饼图pie、雷达图radar
    //		data: powerData
    //	});
    //	myPowerChart.setOption(optionPower);
    //},"json");
}

function showData(obj) {
    if(obj.id!=undefined){
        var ids=obj.id.split("_")[1];
        var dataname=$("#box_"+ids).val().split("&")[1];
        var pskey=$("#box_"+ids).val().split("&")[0];

        var pointId_cap = "p81002";//"p81002";//逆变器交流功率  p81001 : 逆变器功率归一化
        var pointId_pow = "p81012";//param["params.ponitId"] = pintId;//"p81012";//逆变器发电量 p81011 : 日等效小时
        var yAxisName_capacity = LANG["all_station_ac_power"]+"(kW)";//交流功率
        var yAxisName_power = LANG["all_station_daily_energy"]+"(kWh)";//"日发电量";
        var isChecked = $("#checkbox_c1").attr("checked");
        if(isChecked=="checked"){
            pointId_cap = "p81001";//"p81002";//逆变器交流功率  p81001 : 逆变器功率归一化
            pointId_pow = "p81011";//param["params.ponitId"] = pintId;//"p81012";//逆变器发电量 p81011 : 日等效小时
            yAxisName_capacity = LANG["common.glgyh"]+"(kW/kWp)";//交流功率
            yAxisName_power = LANG["common.dxxs"]+"(kWh/kWp)";//"日发电量";
        }
        if (document.getElementById(obj.id).checked) {
            setOptionData_capacity(pskey,dataname,pointId_cap,yAxisName_capacity);
            setOptionData_power(pskey,dataname,pointId_pow,yAxisName_power);
        }else{
            $.each(optionPower.series, function(i) {//alert(optionPower.series[i].name);
                if (optionPower.series[i].name == dataname) {
                    //myPowerChart.clear();
                    optionPower.legend.data.splice(i, 1);
                    optionPower.series.splice(i, 1);
                    optionPower.color.splice(i, 1);

                    return false;
                }
            });

            $.each(optionCapacity.series, function(i) {
                if (optionCapacity.series[i].name == dataname) {
                    //myCapacityChart.clear();
                    optionCapacity.legend.data.splice(i, 1);
                    optionCapacity.series.splice(i, 1);
                    optionCapacity.color.splice(i, 1);

                    return false;
                }
            });

            myCapacityChart.setOption(optionCapacity);
            myPowerChart.setOption(optionPower);
        }

    }

}

var myCapacityChart = null;
var optionCapacity;
var myPowerChart = null;
var optionPower;

function initechart(){
    if(myPowerChart==null){
        myPowerChart = echarts.init(document.getElementById('power'));
    } else {
        myPowerChart.clear();
    }
    if(myCapacityChart==null){
        myCapacityChart = echarts.init(document.getElementById('designCapacity'));
    } else {
        myCapacityChart.clear();
    }


    optionCapacity = {
        tooltip : {
            trigger : 'axis',
            backgroundColor : 'black'
        },
        symbolList: [
            'circle', 'rectangle', 'triangle', 'diamond',
            'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond'],
        legend : {
            //selectedMode:false,
            itemHeight:10,
            left:130,
            top:10,
            data : []
        },grid:{
            width : '80%',
            x:85,
            borderWidth: 0
        },
        toolbox : {
            show : false,
            feature : {
                mark : {
                    show : true
                },
                dataView : {
                    show : true,
                    readOnly : false
                },
                magicType : {
                    show : true,
                    type : ['line', 'bar', 'stack', 'tiled']
                },
                restore : {
                    show : true
                },
                saveAsImage : {
                    show : true
                }
            }
        },
        calculable : false,
        xAxis : [{
            boundaryGap:false,
            splitLine :{
                show : false
            },data : ['00:00','03:00','06:00','09:00','12:00','15:00','18:00','21:00'],
            axisLine: {
                lineStyle: {
                    color: '#4488bb'
                }
            },
            axisLabel:{
                textStyle:{
                    color: 'black'
                }
            }/*,
             nameTextStyle:{
             color: 'black'
             }*/
        }
        ]
        ,
        yAxis : [{
            name :LANG.all_station_daily_energy+'(kWh)',
            position : 'left',
            type : 'value',
            axisTick :{
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#4488bb'
                }
            },
            axisLabel:{
                textStyle:{
                    color: 'black'
                }
            }/*,
             nameTextStyle:{
             color: 'black'
             }*/
        }],
        color : [],
        //scale: true,
        series : []
    };

    myCapacityChart.setOption(optionCapacity);

    //基于准备好的dom，初始化echarts图表
    optionPower = {
        tooltip : {
            trigger : 'axis',
            backgroundColor : 'black'
        },
        legend : {
            //selectedMode:false,
            itemHeight:10,
            left:130,
            top:10,
            data : []
        },grid:{
            width : '80%',
            x : 92,//2017 01 24 wangli
            borderWidth: 0
        },
        toolbox : {
            show : false,
            feature : {
                mark : {
                    show : true
                },
                dataView : {
                    show : true,
                    readOnly : false
                },
                magicType : {
                    show : true,
                    type : ['line', 'bar', 'stack', 'tiled']
                },
                restore : {
                    show : true
                },
                saveAsImage : {
                    show : true
                }
            }
        },

        calculable : false,
        xAxis: [
            {
                boundaryGap: false,
                splitLine: {
                    show: false
                }, data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
                axisLine: {
                    lineStyle: {
                        color: '#4488bb'
                    }
                },
                axisLabel:{
                    textStyle:{
                        color: 'black'
                    }
                }/*,
             nameTextStyle:{
             color: 'black'
             }*/
            }
        ],
        yAxis: [
            {
                axisTick: {
                    show: false
                },
                name: LANG.all_station_ac_power + '(kW)',
                position: 'left',
                type: 'value',
                axisTick :{
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#4488bb'
                    }
                },
                axisLabel:{
                    textStyle:{
                        color: 'black'
                    }
                }/*,
             nameTextStyle:{
             color: 'black'
             }*/
            }
        ],
        color : [],
        series : []
    };

    myPowerChart.setOption(optionPower);
    window.onresize = function () {
        myCapacityChart.resize();
        myPowerChart.resize();
    }

}
addTrColor();

/**
 * start 2017 02 06 wangli 电站单元  定时刷新功能修改
 */
/**
 * start2017 02 06 wangli 逆变器页面 定时刷新功能修改
 */
function refreshTime_psUnit(){
    var text = $("#timeValue").html();
    //text=1;
    if (document.getElementById("setTime").checked) {
        //initTime();
        unitInterval = setInterval("refreshunitPage()", text * 60 * 1000);
    } else {
        clearInterval(unitInterval);
    }

}

function refreshunitPage(){
    //debugger;
    var now=new Date();
    var min=now.getMinutes()>=10?now.getMinutes():("0"+now.getMinutes());
    var mon=(now.getMonth()+1)>=10?now.getMonth():("0"+(now.getMonth()+1));
    var date=now.getDate()>=10?now.getDate():("0"+now.getDate());
    var hour=now.getHours()>=10?now.getHours():("0"+now.getHours());
    min = getFiveMinutes(min);
    var refrshtime=now.getFullYear()+"/"+mon+"/"+date+" "+hour+":"+min;
    $("#new_datetimepicker_mask").val(refrshtime);
    getClock();
    $(".allsite_dateriCheckbox").attr("checked", true);

}
//end

