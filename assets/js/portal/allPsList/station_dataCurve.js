var psName = '', ctx = '', staticUrl = '';

new Vue({
    el: '#dataCurve',
    data: {
        stationId: 'gs', //电站id
        myChart: null, //chart
        isdata: 0,  //时间范围
        bColor: [],
        option: {},
        legendSelected: {},
        initc: ["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#00ffff", "#ffff00", "#000000", "#70db93", "#cd7f32", "#c0c0c0", "#9f9f9f",
            "#8e236b", "#ff7f00", "#db70db", "#bc8f8f", "#8a2be2", "#a52a2a", "#ff7f50", "#dc143c", "#00008b", "#008b8b", "#b8860b",
            "#a9a9a9", "#e9967a", "#8fbc8f", "#483d8b", "#2f4f4f", "#00ced1", "#1e90ff", "#b22222"],
        // 主题，默认标志图形类型列表
        symbolList: [
            'circle', 'rectangle', 'triangle', 'diamond',
            'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond',
            'circle', 'rectangle', 'triangle', 'diamond',
            'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond',
            'circle', 'rectangle', 'triangle', 'diamond'
        ],
        chartnum: 0,
        nodeunit: "",
        nodeArray: [],
        sName: [],
        lName: [],
        clearSetInterval: null,  //定时刷新
        firstTreeFlag: true,  //是否是一级树
        dataZoom: {}
    },
    methods: {

        initSize: function () {
            $('.map_con_fl').height($(window).height() - 80);
            $('.tendency_ri').height($(window).height() - 80);
            $('.sjqx_bottom_tab').height($(window).height() * .2);
            $('.tendencyChart_con2').height($(window).height() * .5);

            $(window).resize(function () {
                $('.map_con_fl').height($(window).height() - 80);
                $('.tendency_ri').height($(window).height() - 80);
                $('.sjqx_bottom_tab').height($(window).height() * .2);
                $('.tendencyChart_con2').height($(window).height() * .5);
            });
        },

        initchart: function () {
            var _this = this;
            this.myChart = echarts.init(document.getElementById('main'));
            // 指定图表的配置项和数据
            this.option = {
                title: {
                    text: ''
                },
                tooltip: {
                    show: false,
                    trigger: 'axis',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    formatter: function (params) {
                        var res = "";
                        $.each(params, function (n) {
                            if (params[n].name) {
                                res = params[n].name + "<br/>";
                            }
                        });
                        if (params[0].name == undefined || params[0].name == "") {
                            res = params[0][1];
                        }
                        var nodearray = _this.nodeunit.split(",");
                        $.each(params, function (n) {
                            var obj = params[n];
                            var ydata = obj.data;
                            if (!ydata) {
                                ydata = "-";
                            }
                            if (res == undefined || "undefined" == res || "" == res) {
                                return res;
                            }
                            res += obj.seriesName + ":" + ydata;
                            //2016 11 11 wangli 添加非空判断
                            if (nodearray[n] != undefined && "undefined" != nodearray[n] && null != nodearray[n] && "" != nodearray[n]) {
                                res += "(" + nodearray[n] + ")" + "<br/>";
                            } else {//2016 11 12 如果没有单位的话 则不显示单位 直接换行
                                res += "<br/>";
                            }
                        });
                        return res;
                    }
                },
                legend: {
                    itemHeight: 10,
                    selected: {},
                    data: []
                },
                dataZoom: {
                    showDetail: false,
                    show: true,
                    realtime: true,
                    height: 20,
                    start: 0,
                    end: 100
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {
                            show: true,
                            title: LANG["common_saveasimage"],
                            lang: [LANG["common_save"]],
                            name: 'isolarcloud'
                        }
                    }
                },
                grid: {
                    show: false,
                    borderWidth: 0,
                    left: '5%',
                    right: '5%'
                },
                legend: {
                    itemHeight: 10,
                    data: []
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.getXAxisData(),
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#4488bb'
                            }
                        },
                        axisLabel: {
                            textStyle: {
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
                        position: 'left',
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            formatter: '{value}',
                            textStyle: {
                                color: 'black'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#4488bb'
                            }
                        }
                    }
                ],
                color: this.bColor,
                series: [{
                    name: '',
                    type: 'line',
                    data: ['-', '-', '-', '-', '-', '-', '-', '-']
                }]
            };

            // 使用刚指定的配置项和数据显示图表。
            this.myChart.setOption(this.option);
            window.onresize = function () {
                _this.myChart.resize();
            };

            this.option.series.splice(0, this.option.series.length);
        },

        //获取X轴数据
        getXAxisData: function () {  //x轴数据
            var q1 = $("#dateHid").val();
            q1 = q1.split("-");
            var startd = new Date(q1[0].substring(0, 4), q1[0].substring(4, 6) - 1, q1[0].substring(6, 8), '00', '00', '00');
            var endd = new Date(q1[1].substring(0, 4), q1[1].substring(4, 6) - 1, q1[1].substring(6, 8), '23', '59', '59');
            var data = [];
            var now = new Date();
            var hour1 = 0;
            var end2 = 0;
            if (this.isdata >= 0 && this.isdata <= 3) {
                var cycle = $("#cycle").val();
                var end = 60 / cycle;
                for (var z = 0; z <= this.isdata; z++) {
                    if (z == 0) {
                        startd.setDate(startd.getDate() + 0);
                    } else {
                        startd.setDate(startd.getDate() + 1);
                    }

                    if (z == this.isdata && endd > now) {
                        hour1 = now.getHours() + 1;
                        var minutes = now.getMinutes() + 1;
                        end2 = minutes / cycle;
                        for (var i = 0; i < hour1; i++) {
                            if (i == hour1 - 1) {
                                for (var j = 0; j < end2; j++) {
                                    var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                                    data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                                }
                            } else {
                                for (var j = 0; j < end; j++) {
                                    var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                                    data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                                }
                            }

                        }
                    } else {
                        for (var i = 0; i < 24; i++) {
                            for (var j = 0; j < end; j++) {
                                var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                                data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                            }
                        }
                    }

                }
            }
            if (this.isdata > 3 && this.isdata <= 10) {
                var cycle = $("#cycle").val();
                if (cycle == "1day") {
                    for (var i = 0; i <= this.isdata; i++) {
                        if (i == 0) {
                            startd.setDate(startd.getDate() + 0);
                        } else {
                            startd.setDate(startd.getDate() + 1);
                        }

                        data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], ""));
                    }
                } else {
                    var end = 60 / cycle;
                    for (var z = 0; z <= this.isdata; z++) {
                        if (z == 0) {
                            startd.setDate(startd.getDate() + 0);
                        } else {
                            startd.setDate(startd.getDate() + 1);
                        }

                        if (z == this.isdata && endd > now) {
                            hour1 = now.getHours() + 1;
                            var minutes = now.getMinutes() + 1;
                            end2 = minutes / cycle;
                            for (var i = 0; i < hour1; i++) {
                                if (i == hour1 - 1) {
                                    for (var j = 0; j < end2; j++) {
                                        var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                                        data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                                    }
                                } else {
                                    for (var j = 0; j < end; j++) {
                                        var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                                        data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                                    }
                                }
                            }
                        } else {
                            for (var i = 0; i < 24; i++) {
                                for (var j = 0; j < end; j++) {
                                    var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                                    data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                                }
                            }
                        }
                    }
                }
            }
            if (this.isdata > 10 && this.isdata <= 31) {
                var cycle = $("#cycle").val();
                if (cycle == "1day") {
                    for (var i = 0; i <= this.isdata; i++) {
                        if (i == 0) {
                            startd.setDate(startd.getDate() + 0);
                        } else {
                            startd.setDate(startd.getDate() + 1);
                        }

                        data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], ""));
                    }
                } else {
                    var end = 60 / cycle;
                    for (var z = 0; z <= this.isdata; z++) {
                        if (z == 0) {
                            startd.setDate(startd.getDate() + 0);
                        } else {
                            startd.setDate(startd.getDate() + 1);
                        }

                        if (z == this.isdata && endd > now) {
                            hour1 = now.getHours() + 1;
                            var minutes = now.getMinutes() + 1;
                            end2 = minutes / cycle;
                            for (var i = 0; i < hour1; i++) {
                                if (i == hour1 - 1) {
                                    for (var j = 0; j < end2; j++) {
                                        var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                                        data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                                    }
                                } else {
                                    for (var j = 0; j < end; j++) {
                                        var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                                        data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                                    }
                                }
                            }
                        } else {
                            for (var i = 0; i < 24; i++) {
                                for (var j = 0; j < end; j++) {
                                    var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                                    data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                                }
                            }
                        }
                    }
                }
            }
            if (this.isdata > 31 && this.isdata <= 730) {

                var cycle = $("#cycle").val();
                if (cycle == "1mon") {
                    for (var i = 0; i < parseInt(this.isdata / 30); i++) {
                        if (i == 0) {
                            startd.setMonth(startd.getMonth() + 0);
                        } else {
                            startd.setMonth(startd.getMonth() + 1);
                        }
                        var array = startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "").split("/");
                        data.push(array[0] + "/" + array[1]);
                    }

                } else {
                    for (var i = 0; i <= this.isdata; i++) {
                        if (i == 0) {
                            startd.setDate(startd.getDate() + 0);
                        } else {
                            startd.setDate(startd.getDate() + 1);
                        }
                        // console.log(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], ""));
                        data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], ""));
                    }
                }
            }
            if (this.isdata > 730) {

                var cycle = $("#cycle").val();
                if (cycle == "1mon") {
                    for (var i = 0; i <= this.isdata / 30; i++) {
                        if (i == 0) {
                            startd.setMonth(startd.getMonth() + 0);
                        } else {
                            startd.setMonth(startd.getMonth() + 1);
                        }
                        var array = startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "").split("/");
                        data.push(array[0] + "/" + array[1]);
                    }

                } else {
                    for (var i = 0; i <= this.isdata / 365; i++) {
                        if (i == 0) {
                            startd.setYear(startd.getFullYear() + 0);
                        } else {
                            startd.setYear(startd.getFullYear() + 1);
                        }
                        var array = startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "").split("/");
                        //console.log(array);
                        data.push(array[0]);
                    }
                }
            }


            if (data.length <= 0) {
                $("#cycle").val("15");
                return this.getXAxisData();
            }
            return data;
        }
        ,

        //获取Y轴数据
        getYAxis: function (unit) {
            var format = '{value}';
            var index = 0;
            var yAxisObj = {};
            var ysplit = [true];
            yAxisObj.type = "value";
            yAxisObj.name = LANG["all_station_unit"] + unit;
            yAxisObj.axisLine = {lineStyle: {color: '#4488bb'}};
            //yAxisObj.axisLabel = { textStyle : {color : 'black'}};
            //yAxisObj.nameTextStyle = {color : 'black'};
            yAxisObj.axisTick = {show: false};

            if (this.option.yAxis.length == 0) {
                yAxisObj.type = "value";
                //var show=true;
                yAxisObj.splitLine = {show: false};
                yAxisObj.axisLabel = {formatter: format, textStyle: {color: 'black'}};
                yAxisObj.unit = unit;
                yAxisObj.scale = true;
                this.option.yAxis.push(yAxisObj);
            } else if (this.option.yAxis.length == 1) {
                var unit1 = this.option.yAxis[0].unit;
                if (!unit1) {
                    yAxisObj.type = "value";
                    yAxisObj.splitLine = {show: false};
                    yAxisObj.axisLabel = {formatter: format, textStyle: {color: 'black'}};
                    yAxisObj.unit = unit;
                    yAxisObj.scale = true;
                    this.option.yAxis.splice(0, 1, yAxisObj);
                    index = 0;
                } else if (unit != unit1) {
                    yAxisObj.type = "value";
                    yAxisObj.splitLine = {show: false};
                    yAxisObj.axisLabel = {formatter: format, textStyle: {color: 'black'}};
                    yAxisObj.unit = unit;
                    yAxisObj.scale = true;
                    this.option.yAxis.push(yAxisObj);
                    index = 1;
                }
            } else if (this.option.yAxis.length == 2) {
                var unit1 = this.option.yAxis[0].unit;
                var unit2 = this.option.yAxis[1].unit;
                if (unit == unit1) {
                    index = 0;
                    this.option.yAxis[0].name = LANG["all_station_unit"] + unit;
                } else if (unit == unit2) {
                    index = 1;
                    this.option.yAxis[1].name = LANG["all_station_unit"] + unit;
                } else {
                    index = 0;
                    this.option.yAxis[0].name = LANG["all_station_unit"] + unit;
                }
            }
            return index;
        }
        ,

        loadPage: function () {
            this.initSize();  //初始化尺寸
            var _this = this;

            //刷新时间未点击时灰色
            $(".abcd").css({"opacity": "0.7"});
            $(".abcd em").css({"opacity": "0.7"});

            //刷新时间设置
            this.refreshClick();

            //时间选择
            this.changeDate();
            //初始化chart
            this.initchart();
            //展示tree
            this.showTree('gs', '0');   //tree  根节点id  '0'首次默认不是数据
        },
        //时间选择
        changeDate: function () {
            var dates = new Date();
            var endDate = dates.getFullYear() + '-' + (dates.getMonth() + 1) + '-' + dates.getDate() + 'T' + dates.getHours() + ':' + dates.getMinutes() + ':' + dates.getSeconds();
            var tom_day = vlm.Utils.format_date(endDate, 'YmdHispace');
            var startDate = dates.getFullYear() + '-' + (dates.getMonth() + 1) + '-' + dates.getDate() + 'T' + dates.getHours() + ':' + dates.getMinutes() + ':' + dates.getSeconds();
            var yest_day = vlm.Utils.format_date(startDate, 'YmdHizero');
            $("#start").val(yest_day);
            $("#end").val(tom_day);
            $("#quick_date1").html(yest_day);
            $("#quick_date2").html(tom_day);
            if (tom_day) {
                tom_day = (tom_day.replace("-", "")).replace("-", "").replace(" ", "").replace(":", "");
            }
            if (yest_day) {
                yest_day = (yest_day.replace("-", "")).replace("-", "").replace(" ", "").replace(":", "");
            }
            $("#dateHid").val(yest_day + "-" + tom_day);

            //时间选择显示隐藏事件
            $(".date_btn").unbind().bind("click", function (event) {
                var dateWrap_height = $(".dateWrap").is(":hidden");
                if (dateWrap_height) {
                    $(".dateWrap").show();
                } else {
                    $(".dateWrap").hide();
                }
                event.stopPropagation();
            });

            //i记录日期控件选择的时间类型：日，周，年……
            var i = 0;
            //年月日事件切换
            $(".dateWrap_tit ul li").click(function () {
                i = $(this).index();
                $(".dateWrap_tit ul li").removeClass("on");
                $(this).addClass("on");
                $('.ate_togg >ul').eq(i).addClass("active").siblings().removeClass('active');
                if (i == 0) //天
                {
                    $("#start").val($("#quick_date1").html());
                    $("#end").val($("#quick_date2").html());
                } else if (i == 1) //周
                {
                    var now_day = vlm.Utils.GetDay();
                    var week_year = vlm.Utils.getWeekNumber()[0];
                    var week_num = vlm.Utils.getWeekNumber()[1];
                    $("#week").val(week_year + LANG["all_station_yearof"] + week_num + LANG["all_station_week"]);
                } else if (i == 2) //月
                {
                    var now_day = vlm.Utils.GetDay();
                    var yest_day = vlm.Utils.GetDay(0, 0, -1);
                    var year = now_day.substring(0, now_day.indexOf("-"));
                    var month = now_day.substring(now_day.indexOf("-"), now_day.indexOf("-") + 3);
                    $("#month").val(year + month);
                } else if (i == 3) //季度
                {
                    var now_day = vlm.Utils.GetDay();
                    var month = now_day.substring(now_day.indexOf("-") + 1, now_day.indexOf("-") + 3);
                    var year = now_day.substring(0, now_day.indexOf("-"));
                    if (month >= 1 && month <= 3) {
                        $("#jidu").val(year + LANG["pro_management_year"] + LANG["pro_management_onequarter"]);
                    } else if (month >= 4 && month <= 6) {
                        $("#jidu").val(year + LANG["pro_management_year"] + LANG["pro_management_twoquarter"]);
                    } else if (month >= 7 && month <= 9) {
                        $("#jidu").val(year + LANG["pro_management_year"] + LANG["pro_management_threequarter"]);
                    } else {
                        $("#jidu").val(year + LANG["pro_management_year"] + LANG["pro_management_fourquarter"]);
                    }
                } else if (i == 4) //年
                {
                    var now_day = vlm.Utils.GetDay();
                    var month = now_day.substring(now_day.indexOf("-") + 1, now_day.indexOf("-") + 3);
                    var year = now_day.substring(0, now_day.indexOf("-"));
                    $("#year").val(year + LANG["all_station_yeartail"]);
                }
            });

            $('.wrap_su').click(function () {
                var dateType = $(this).attr('data-dateType');
                if (dateType == 'twoday') {
                    var yest_day = $("#start").val();
                    var new_tom_day = $("#start").val().replace('00:00', '23:59');
                    $("#quick_date1").html(yest_day);
                    $("#quick_date2").html(new_tom_day);
                    $("#dateHid").val(yest_day + "-" + new_tom_day);
                }
                $(".dateWrap").slideUp();
            });
        },

        //更新时间
        refreshClick: function () {

            $(".allsite_dateriCheckbox").click(function () {
                if ($(".allsite_dateriCheckbox").attr("checked") == 'checked') {
                    $(".abcd").css({"opacity": "1"});
                    $(".abcd em").css({"opacity": "1"})
                } else {
                    $(".abcd").css({"opacity": "0.7"});
                    $(".abcd em").css({"opacity": "0.7"})
                }
            });


            $("#allsite_dateYear1 a").click(function () {
                var ch = $(this).parent().attr("ch");
                var date_em1 = $(this).parent().find("i").text();
                if (ch) {
                    if ($(this).attr("class") == "allsite_dateUpBtn1") {
                        date_em1++;
                        $(this).parent().find("i").text(date_em1);
                    } else {
                        date_em1--;
                        if (date_em1 <= 5) {
                            date_em1 = 5;
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
                            if (date_em1 <= 5) {
                                date_em1 = 5;
                            }
                            $(this).parent().find("i").text(date_em1);
                        }
                    }
                }
                _this.refreshTime_point();
            });
        },

        //更换左侧列表电站
        changeStation: function (e) {
            var target = null;
            if (e == 1) {

            } else {
                if ($(e.target)[0].tagName == 'A') {
                    target = $(e.target).parent();
                } else {
                    target = $(e.target);
                }
                if (!target.hasClass('on')) {
                    target.addClass('on').siblings().removeClass('on');
                    this.stationId = target.attr('id')
                    this.firstTreeFlag = true; //重置首次树boolean
                    $('.ztree').remove(); //清空ztree
                    this.showTree(this.stationId, '0');
                }
            }
        },

        //获取tree数据
        showTree: function (id, isdata) {
            var _this = this;
            var Parameters = {
                "parameters": {
                    "stationid": this.stationId
                },
                "foreEndType": 2,
                "code": "30000006"
            };
            if (!this.firstTreeFlag) {
                Parameters.parameters.fd_dev_id = id;
                Parameters.parameters.fd_isdata = isdata;
            }

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                //console.log(res);
                if (res.success) {
                    var zNodes = res.data;
                    if (zNodes) {
                        var newNodes = [];
                        for (var i = 0; i < zNodes.length; i++) {
                            showTreeNodeImageByDeviceType(zNodes[i]); //code图标转换
                            if (zNodes[i].fd_dev_class_id == 10) {  //非特殊图标eg：svg文件夹
                                zNodes[i].icon = "";
                            }
                            var obj = {
                                id: zNodes[i].fd_dev_id,  //设备id
                                fd_name: zNodes[i].fd_name,  //设备名字
                                icon: zNodes[i].icon,     //设备图标
                                isdata: zNodes[i].fd_isdata, //是否数据
                                fd_tablename: zNodes[i].fd_tablename, //表名
                                fd_code: zNodes[i].fd_code, //点名
                                load_once: true, //点名
                            };
                            if (_this.firstTreeFlag) {  //首次树
                                if (i == 0) {
                                    obj.treeIcon = 'roots_close';
                                } else {
                                    obj.treeIcon = 'bottom_close';
                                }
                            } else {  //非首次
                                if (zNodes[i].fd_isdata == 2 || zNodes[i].fd_isdata == 0) {
                                    obj.treeIcon = 'bottom_close';  //是数据
                                } else if ((zNodes[i].fd_isdata == 1)) {
                                    obj.treeIcon = 'center_docu';
                                    obj.addOnly = 'onlyLi';
                                }
                            }

                            newNodes.push(obj);
                        }

                        var powerhtml = $('#powerTpl0').html();
                        var powerLi = ejs.render(powerhtml, {newNodes: newNodes});
                        var oUl = null;
                        if (_this.firstTreeFlag) {
                            oUl = $('<ul class="ztree"></ul>');
                        } else {
                            oUl = $('<ul class="line"></ul>');
                        }
                        oUl.html(powerLi);
                        oUl.appendTo($('#' + id));

                        oUl.find('>li').click(function (e) {
                            e.stopPropagation();
                            if ($(this).find('ul').length < 1) {
                                _this.firstTreeFlag = false;
                                if ($(this).attr('data-isdata') == 1) {
                                    if ($(this).attr('data-load_once') == 'true') {
                                        //绘制chart
                                        var obj = {
                                            id: $(this).attr('id'),
                                            name: $(this).parents('#MAIN').find('#tit').html(),
                                            fd_code: $(this).attr('data-fd_code'),
                                            fd_name: $(this).attr('data-fd_name'),
                                            fd_tablename: $(this).attr('data-fd_tablename'),
                                            fd_isdata: $(this).attr('data-isdata')
                                        };
                                        _this.showChart(obj);
                                    }
                                    $(this).attr('data-load_once', 'false');
                                } else {
                                    _this.showTree($(this).attr('id'), $(this).attr('data-isdata')); //发送tree请求
                                    if ($(this).find('>span').hasClass('roots_close')) {
                                        $(this).find('>span').removeClass('roots_close').addClass('roots_open');
                                    } else if ($(this).find('>span').hasClass('bottom_close')) {
                                        $(this).find('>span').removeClass('bottom_close').addClass('center_open');
                                    }
                                }
                            } else {
                                if ($(this).find('>span').hasClass('center_open')) {
                                    $(this).find('>span').removeClass('center_open').addClass('roots_close');
                                } else if ($(this).find('>span').hasClass('roots_open')) {
                                    $(this).find('>span').removeClass('roots_open').addClass('roots_close');
                                } else if ($(this).find('>span').hasClass('roots_close')) {
                                    $(this).find('>span').removeClass('roots_close').addClass('roots_open');
                                } else {
                                    $(this).find('>span').removeClass('roots_close').addClass('center_open');
                                }
                                $(this).find('ul').stop().slideToggle();
                            }
                        });
                    }
                }
            });
        },

        //绘制chart
        showChart: function (node) {
            var _this = this;
            // 动画效果去除
            this.myChart.hideLoading();
            var legendData = this.option.legend.data;

            var color = "";
            var symbol = "";

            //限制曲线的数量
            if (legendData.length > 14) {
                easyDialog.open({
                    container: {
                        header: LANG["all_station_prompt"],
                        content: LANG["all_station_numlimit"],
                        noFn: true,
                        noText: LANG["pro_management_determine"]
                    },
                    fixed: false
                });

                return;
            }

            if (this.chartnum < 30) {
                //此处修改为了避免出现重复颜色的曲线
                color = this.initc[this.chartnum];
                symbol = this.symbolList[this.chartnum];
            } else {
                for (var j = this.chartnum % 30; j < this.initc.length; j++) {
                    var result = false;
                    color = this.initc[j];
                    symbol = this.symbolList[j];
                    for (var k = 0; k < this.bColor.length; k++) {
                        if (this.bColor[k] == color) {
                            result = true;
                        }
                    }
                }
            }

            this.chartnum = this.chartnum + 1;
            node.color = color;
            if (legendData.length == 0) {
                this.bColor.push(color);
                this.myChart.clear();
            } else {
                this.bColor.push(color);
            }
            layer.load(0, 2);
            if ($('#' + node.id).parents('.level0').length > 1) {
                var fd_parent_id = $('#' + node.id).parents('.level0').eq(1).attr('id');
            } else {
                var fd_parent_id = $('#' + node.id).parents('.level0').attr('id');
            }

            var startd = $("#quick_date1").html(),
                endd = $("#quick_date2").html(),
                startStr = startd.replace(/[-:\s]*/ig, '') + '00',
                endStr = endd.replace(/[-:\s]*/ig, '') + '00';

            var Parameters = {
                "parameters": {
                    "fd_dev_id": node.id,
                    "fd_parent_id": fd_parent_id,
                    "fd_code": node.fd_code,
                    "fd_tablename": node.fd_tablename,
                    "fd_isdata": node.fd_isdata,
                    "timetype": "8",
                    "sorttype": "1",
                    "sort": "2",
                    "starttime": startStr, //开始时间
                    "endtime": endStr,   //结束时间
                    "topn": "1000",
                    "stationid": this.stationId
                },
                "foreEndType": 2,
                "code": "30000007"
            };

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                console.log(res.data);
                if (res.success) {
                    var result = res.data.data;
                    var ydata = [],  //曲线Y数据
                        nameArr = [];   //曲线名字
                    for (var i = 0; i < result.length; i++) {
                        ydata.push(result[i].fd_value);
                        nameArr.push(result[i].fd_name);
                    }
                    //请求完成后关闭滚动
                    layer.closeAll();
                    node.fd_code_name = res.data.fd_code_name;
                    _this.addTr(node);

                    var yAxisIndex = _this.getYAxis('%');  //y轴需要单位
                    var data = [];
                    $.each(ydata, function (i) {
                        var d = ydata[i];
                        if (i == 0) {//第一个“--”必须转换，否则echarts绘不出来线
                            d = ydata[i] == "--" ? "" : ydata[i];
                        }
                        data.push(d);
                    });

                    var cycle = $("#cycle").val()
                    if (cycle != "1day" && cycle != "1mon") {
                        data = dealArray(data);
                    }

                    //补充数据
                    var startHour = 7, totNum = 0;
                    if (result[0].fd_datetime.indexOf('07:15')) {
                        totNum = startHour * 4 + 1;
                    } else {
                        totNum = startHour * 4 + 2;
                    }
                    ;
                    for (var i = 0; i < totNum; i++) {
                        data.unshift('0');
                    }
                    //console.log(data);
                    var seriesObj1 = {};
                    seriesObj1.data = data;
                    seriesObj1.symbol = symbol;
                    seriesObj1.type = 'line';
                    seriesObj1.name = node.fd_name;
                    seriesObj1.unit = "(" + node.unit + ")";
                    seriesObj1.yAxisIndex = yAxisIndex;
                    //_this.option.xAxis.data=_this.getXAxisData();
                    //alert(_this.option.xAxis.data);
                    _this.option.legend.data.push(node.fd_name)
                    _this.option.series.push(seriesObj1);
                    // 显示 tooltip
                    _this.option.tooltip.show = true;
                    _this.myChart.setOption(_this.option);
                } else {
                    layer.closeAll();  //关闭请求动画
                    easyDialog.open({
                        container: {
                            header: LANG["all_station_prompt"],
                            content: res.message,
                            noFn: true,
                            noText: LANG["pro_management_determine"]
                        },
                        fixed: false
                    });
                }
            });
        },

        getRandomColor: function () {
            return "#" + ("00000" + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6);
        },

        addTr: function (node) {
            var _this = this;
            //var unit=node.attr('data-unit');  qzz
            var unit = 'KWh';
            var sta_table = [
                {
                    psName: node.fd_name, //电站名称
                    color: node.color, //曲线颜色
                    vcolor: node.fd_code, //点名 GS_C1_YC57
                    value: '108816_24',
                    dynamicType: 'line', //线型
                    fd_code_name: node.fd_code_name,  //测点名称

                }
            ];
            var tableStr = $('#station_table_tpl').html();
            var tpl_str = ejs.render(tableStr, {sta_table: sta_table});
            $("#tbody").append(tpl_str);

            //绑定删除事件
            $('.delA').click(function () {
                _this.delChart($(this));
                if($(this).attr('id') == $('.treeDemoId >li.on').find('.onlyOne').attr('data-fd_code')){
                    alert($('.treeDemoId >li.on').find('.onlyOne').attr('data-fd_code'));
                    $('.treeDemoId >li.on').find('.onlyOne').attr('data-load_once', 'true');
                }
            });


            if (this.nodeunit == null || this.nodeunit == "") {
                if (unit == "" || unit == null) {
                    this.nodeunit = unit + ",";
                } else {
                    this.nodeunit = unit;
                }
            }
            else {
                //2016 11 12 wangli 数据曲线 单位错误bug修改
                if (this.nodeunit != ",") {
                    this.nodeunit = this.nodeunit + "," + unit;
                } else {
                    this.nodeunit = this.nodeunit + unit;
                }
            }

            $('.cy_ul li').click(function (e) {
                e.stopPropagation();
                $(this).parents('.data_type_span').find('.map_select_2_sea').html($(this).html());
                $(this).parent().slideUp(200);
            });

            $(".sjqx_bottom_tab").height($(".tendency_table").height() - 42);
            var id = 'node' + sta_table[0].vcolor;
            this.initColor(id);
            this.nodeArray.push(node);
            this.sName.push(name);
            this.lName.push(psName);
        },


        initColor: function (id) {
            var thisId = id;
            var _this = this;
            $("#" + id).minicolors({
                control: $(this).attr('data-control') || 'hue',
                defaultValue: $(this).attr('data-defaultValue') || '',
                inline: $(this).attr('data-inline') === 'true',
                letterCase: $(this).attr('data-letterCase') || 'lowercase',
                opacity: $(this).attr('data-opacity'),
                position: $(this).attr('data-position') || 'bottom left',
                hide: function (opacity) {
                    _this.changeColor(thisId, $("#" + thisId).val());
                },
                change: function (hex, opacity) {
                    if (!hex)
                        return;
                    if (opacity)
                        hex += ', ' + opacity;
                    try {

                    } catch (e) {
                    }
                },
                theme: 'bootstrap'
            });
        },

        changeColor: function (id, color) {
            var index = $(".demo").index($("#" + id));
            this.option.color[index] = color;
            this.option.legend.selected = this.legendSelected;
            this.option.dataZoom = this.dataZoom;
            this.myChart.setOption(this.option);
        },

        changeDateSpace: function (e) {
            var obj = $(e.target);
            this.changedateSel($(e.target).html(), obj);
            $(e.target).parents('.dateSel').slideUp(200);
        },

        changedateSel: function (value, obj) {
            var _this = this;
            if (value == "5min") {
                $("#cycle").val(5);
            } else if (value == "15min") {
                $("#cycle").val(15);
            } else if (value == "60min") {
                $("#cycle").val(60);
            } else if (value == "1day") {
                $("#cycle").val("1day");
            } else if (value == "1mon") {
                $("#cycle").val("1mon");
            } else if (value == "1year") {
                $("#cycle").val("1year");
            }
            obj.parents('.tendencyChart_select2').find('#dateDef').html(value);

            //处理卡顿现象SJE-1294
            layer.load(0, 2);
            setTimeout(function () {
                // 更改统计方式的显示
                if (!/min/g.test(value)) {
                    $.each($("span.data_type_span>a"), function (n, obj) {
                        if ($(obj).text() == LANG.all_station_aggenttype_5) {
                            $(obj).text(LANG.all_station_aggenttype_2);
                        }
                    });
                } else {
                    $.each($("span.data_type_span>a"), function (n, obj) {
                        if ($(obj).text() == LANG.all_station_aggenttype_2 ||
                            $(obj).text() == LANG.all_station_aggenttype_3 || $(obj).text() == LANG.all_station_aggenttype_1) {
                            $(obj).text(LANG.all_station_aggenttype_5);
                        }
                    });
                }

                _this.myChart.dispose();
                _this.initchart();
                for (var i = 0; i < _this.nodeArray.length; i++) {
                    _this.showChart(_this.nodeArray[i]);
                }
                layer.closeAll();
            }, 500);

        },

        //批量删除
        psPoint_delAllChart: function () {
            var _this = this;
            $(".delA").each(function (i, o) {
                $('.treeDemoId >li.on').find('.onlyOne').attr('data-load_once', 'true');
                _this.delChart(o);
            });
        },

        delChart: function (obj) {
            var index = $(".delA").index(obj) - 1;  //2016-06-30 批量删除
            var temp = "";
            //删除记录的单位信息
            var unitarray = this.nodeunit.toString().split(",");
            unitarray.splice(index, 1);
            for (var i = 0; i < unitarray.length; i++) {
                if (i == 0) {
                    temp = unitarray[0];
                } else {
                    temp = temp + "," + unitarray[i];
                }
            }
            this.nodeunit = temp;
            this.option.series.splice(index, 1);

            this.lName.splice(index, 1);

            //option.color.splice(index,1);
            this.bColor.splice(index, 1);

            var moveLenged = this.option.legend.data[index];

            this.option.legend.data.splice(index, 1);
            delete this.legendSelected[moveLenged];
            this.option.legend.data.selected = this.legendSelected;
            this.option.legend.selected = this.legendSelected;

            var newDataZoom = {
                show: true,
                realtime: true,
                height: 20,
                start: this.dataZoom.start,
                end: this.dataZoom.end
            };
            this.option.dataZoom = newDataZoom;
            this.nodeArray.splice(index, 1);
            this.checkYAxis();
            this.myChart.clear();
            var legendData = this.option.legend.data;
            if (legendData.length == 0) {
                this.initchart();
            } else {
                this.myChart.setOption(this.option);
                //myChart.refresh();
            }
            $($("#tbody").find("tr")[index]).remove();
        },

        checkYAxis: function () {
            this.option.yAxis = [];
            var unitArray = [];
            var idAdd;
            for (var i = 0; i < this.nodeArray.length; i++) {
                if (unitArray.length == 2) {
                    this.getYAxis(this.nodeArray[i].unit);
                    break;
                }
                idAdd = true;
                for (var j = 0; j < unitArray.length; j++) {
                    if (this.nodeArray[i].unit == unitArray[j]) {
                        idAdd = false;
                    }
                }
                if (idAdd) {
                    unitArray.push(this.nodeArray[i].unit);
                    this.getYAxis(this.nodeArray[i].unit);
                }
            }
            for (var i = 0; i < this.nodeArray.length; i++) {
                for (var j = 0; j < unitArray.length; j++) {
                    if (this.nodeArray[i].unit == unitArray[j]) {
                        this.option.series[i].yAxisIndex = j;
                    }
                }
            }
        },

        getStart_point: function () {
            var refresh_time = $("#dateDef").text();
            this.changedateSel(refresh_time);
        },

        //定时刷新
        refreshTime_point: function () {
            var text = $("#point_time").html(), _this = this;
            if (document.getElementById("setTime_point").checked) {
                // initTime();
                clearInterval(this.clearSetInterval);
                this.clearSetInterval = setInterval(_this.getStart_point, text * 60 * 1000);
            } else {
                clearInterval(this.clearSetInterval);
            }
        }

    }
    ,
    mounted: function () {
        this.loadPage();  //初始化页面
    }
})
;

function selectValue(obj) {
    if ($(obj).find("ul").is(":hidden")) {
        $(obj).find("ul").slideDown(200);
    } else {
        $(obj).find("ul").slideUp(200);
    }
};




