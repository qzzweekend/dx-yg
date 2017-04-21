new Vue({
    el: '#stationConnection',
    data: {
        stationId: 'gs',
        svgPath: "../dialog/svg/",  //svg路径
        fileExistFlag: true,  //svg文件是否存在
        fullScreenflag: false // 全屏状态，初始为false
    },
    methods: {

        //初始化页面尺寸
        initPageSize: function () {
            $('#map_wap_div').height($(window).height() - 80);
            $('.map_con_fl').height($(window).height()-80);
            $('#svg_change_color').height($('#map_wap_div').height() - 60);
            $(window).resize(function () {
                $('#map_wap_div').height($(window).height() - 80);
                $('.map_con_fl').height($(window).height()-80);
                $('#svg_change_color').height($('#map_wap_div').height() - 60);
            });

            var boxrightWidth = $(".boxlists-right").width();
            var box1Width = $(".boxt1:eq(0)").width();
            var newbox2Witdth = boxrightWidth - box1Width - 60;
            if (newbox2Witdth > 70) {
                $(".boxt2").width(newbox2Witdth + "px");
            }
            if ($("#isOperate").length == 0) {
                $(".deal").css("background-color", "#C0C0C0");
            }

        },

        //获取单电站svg
        getPerSvg: function (e) {
            var powerid = '', target = null;
            if (e == 1) {
                this.stationId = 'gs';
            } else {
                if ($(e.target)[0].tagName == 'A') {
                    target = $(e.target).parent();
                } else {
                    target = $(e.target);
                }
                target.addClass('on').siblings().removeClass('on');
                this.stationId = target.attr('id');
            }
            this.getSvgMsg();
        },


        getSvgMsg: function () {
            var _this = this;
            var Parameters = {
                "parameters": {
                    "stationid": this.stationId
                },
                "foreEndType": 2,
                "code": "30000031"
            };

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                if (res.success) {
                    _this.loadFuncDetail(res.data); //加载数据
                }
            })
        },

        //循环查询gs.svg
        loopSelectDetail: function (result) {
            var _this = this;
            var obj = document.getElementById("mySVG");
            var svg = obj.getSVGDocument();
            var node = svg.documentElement;

            for (var i = 0; i < result.length; i++) {
                if (result[i].fd_html_type == 1) { //boolean 显示隐藏

                    if (result[i].fd_value == 0) {
                        var showId = result[i].fd_html_id + '_0';
                        var hideId = result[i].fd_html_id + '_1';
                        if (node.getElementById(showId)) {
                            node.getElementById(showId).style.display = "block";
                            if (node.getElementById(hideId)) {
                                node.getElementById(hideId).style.display = "none";
                            }
                        }

                    } else if (result[i].fd_value == 1) {
                        var showId = result[i].fd_html_id + '_' + result[i].fd_value;
                        var hideId = result[i].fd_html_id + '_0';
                        if (node.getElementById(showId)) {
                            node.getElementById(showId).style.display = "block";
                            node.getElementById(hideId).style.display = "none";
                        }
                    }
                } else if (result[i].fd_html_type == 2) { //赋值
                    var showId = result[i].fd_html_id;
                    if (node.getElementById(showId)) {
                        node.getElementById(showId).textContent = result[i].fd_value;
                    }

                } else if (result[i].fd_html_type == 3) { //赋值和显示隐藏
                    var showId = result[i].fd_html_id + '_' + result[i].fd_value;
                    if (node.getElementById(showId)) {
                        node.getElementById(showId).style.display = "block";
                        var newArr = result[i].split(',');
                        for (var i = 0; i < newArr.length; i++) {
                            if (showId !== newArr[i]) {
                                node.getElementById(newArr[i]).style.display = "none";
                            }
                        }
                    }
                }
            }

            $(svg).unbind().bind('click', function () {
                $(".minicolors-panel").hide();
                _this.changeColor($("#hidden-input").val());
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
        },

        changeColor: function (type) {
            document.getElementById('svgDiv').style.backgroundColor = type;
            document.getElementById('svg_change_color').style.backgroundColor = type;
        },

        /**
         *加载Svg图像的回调函数gs.svg
         */
        loadFuncDetail: function (result) {
            var _this = this;
            var obj = document.createElement("embed");
            obj.id = "mySVG";
            obj.setAttribute("type", "image/svg+xml");
            obj.setAttribute("src", this.svgPath+this.stationId+'.svg');
            var wid = $("#svg_change_color").width();
            var hig = $("#svg_change_color").height();
            obj.setAttribute("style", "width:" + wid + "px;height:" + hig + "px");
            var container = document.getElementById("svgDiv");
            container.innerHTML = "";
            if (this.fileExistFlag) {
                container.appendChild(obj);
                clearSetInterval = setInterval(function () {
                    var svgdoc, root;
                    svgdoc = document.getElementById("mySVG");
                    root = svgdoc.getSVGDocument();
                    if (svgdoc != null && root != null) {
                        clearInterval(clearSetInterval);
                        obj.addEventListener("load", _this.loopSelectDetail(result), false);
                    }
                }, 1000);
            }
            this.toggleNoSvgMessage();

            //点击全屏
            $("#change_size").unbind().bind('click', function () {
                // console.log(this.fullScreenflag);
                if (_this.fullScreenflag) {
                    _this.closeExpand();
                } else {
                    _this.expand();
                }

            });

            //键盘“Esc”出发消失
            $(document).keyup(function (event) {
                if (this.fullScreenflag == true) {
                    switch (event.keyCode) {
                        case 27:
                            closeExpand();
                            break;
                        case 96:
                            break;
                    }
                }
            });

        },


        //没有一次接线图的情况给出提示
        toggleNoSvgMessage: function () {
            $(".nodata_message").remove(".nodata_message");
            $("#svg_change_color").css("background-color", $(".minicolors-swatch-color").css("background-color"));
            if ($("#svgDiv").html() == "" || $("#svgDiv").html() == null) {
                $("#svg_change_color").css("background-color", "white");
                $("#svg_change_color").append("<div class='nodata_message' style='text-align: center;padding:20px;'><span style='font-size:14px'>" + LANG.all_station_nowiringmessage + "</span></div>");
            }
        },

        expand: function () {
            // 全屏显示 更改样式
            //$(".secondnav").css("display", "none");
            //$(".side_nav").css("display", "none");
            //$(".index_top").css("display", "none");
            //$(".map_select").css("display", "none");
            //$(".map_con_fl").css("display", "none");
            //$(".map_con_fl_page").css("display", "none");
            //$("#tendencyDiv").addClass("map_bg").css({
            //    "background-color": "#fff"
            //});
            //$("#tendencyDiv").removeClass("tendency_ri");
            //$("#tendencyDiv").removeClass("fr");
            //$("#tendencyDiv").css("width", "100%");
            //
            //$(".tendencyChart").css("height", "100%");
            //$("#map_wap_div").removeClass("map_wap");
            //$(".index_right").removeClass("fr");
            //$(".index_right").css("width", "100%");
            //$("#svg_change_color").css("height", "100%");
            //$("#svg_change_color").css("overflow", "auto");
            //$("#svg_change_color").removeClass("tendencyChart_con");
            //$("#svg_change_color").addClass("svgheight");
            //$(window).trigger("resize");
            //// 更改图标
            //$(".change_size img").attr("src", staticUrl + "/resources/portal/images/change_size4.png");
            //// 更改全屏状态
            //this.fullScreenflag = true;
            ////许盛修改 svg自适应问题 201508151030 -----开始---
            //this.loadFuncDetail();
            ////许盛修改 svg自适应问题 201508151030 -----结束---

        },

        closeExpand: function () {
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
            $(".change_size img").attr("src", staticUrl + "/resources/portal/images/change_size2.png");
            $(window).trigger("resize");
            // 更改全屏状态
            this.fullScreenflag = false;
            //svg自适应问题
            this.loadFuncDetail();
        },

    }
    ,
    mounted: function () {

        this.initPageSize(); //初始化页面尺寸
        this.getSvgMsg(); //getSvg
    }
})
;







