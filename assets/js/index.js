new Vue({
    el: '#power_index',
    data: {},
    methods: {
        //检测hash跳转页面
        checkHash: function () {
            //进入页面判断hash跳转页面
            var url = '';
            var hash = (!window.location.hash) ? "#powerOverview" : window.location.hash;
            window.location.hash = hash;
            $('.side_nav li').removeClass('current');
            switch (hash) {
                case "#powerOverview":
                    $('.secondnav').hide();
                    url = window.location.pathname.replace('index.html', '') + 'powerOverview.html';
                    $('.side_nav li').eq(0).addClass('current');
                    break;
                case "#powerMap":
                    $('.secondnav').hide();
                    url = window.location.pathname.replace('index.html', '') + 'powerMap.html';
                    $('.side_nav li').eq(1).addClass('current');
                    break;
                case "#powerList":
                    var str = '<ul>' +
                        '<li id="psx1"><a href="javascript:;" class="secondnav1"></a>' +
                        '<span>电站信息</span>' +
                        '<i id="test1"></i>' +
                        '</li>' +
                        '<li id="psx21"><a href="javascript:;" class="secondnav1"></a>' +
                        '<span>电站首页</span>' +
                        '<i id="test21"></i>' +
                        '</li>' +
                        '<li id="psx2"><a href="javascript:;" class="secondnav2"></a>' +
                        '<span>数据曲线</span><i id="test2"></i>' +
                        '</li>' +
                        '<li id="psx3"><a href="javascript:;" class="secondnav3"></a>' +
                        '<span>一次接线图</span><i id="test3"></i>' +
                        '</li>' +
                        '<li id="psx4"><a href="javascript:;" class="secondnav4"></a>' +
                        '<span>电站单元</span><i id="test4"></i>' +
                        '</li>' +
                        '<li id="psx5"><a href="javascript:;" class="secondnav5"></a>' +
                        '<span>逆变器</span><i id="test5"></i>' +
                        '</li>' +
                        '</ul>';
                    $('.secondnav').html(str).show();

                    $('.secondnav li').click(function () {  //右侧电站列表nav
                        $('.secondnav li').removeClass('current');
                        $(this).addClass('current');

                        if ($(this).attr('id') == 'psx1') {
                            subUrl = "dialog/station_msg.html";
                        } else if ($(this).attr('id') == 'psx21') {
                            subUrl = "dialog/station_index.html";
                        } else if ($(this).attr('id') == 'psx2') {
                            subUrl = "dialog/station_dataCurve.html";
                        } else if ($(this).attr('id') == 'psx3') {
                            subUrl = "dialog/station_connection.html";
                        } else if ($(this).attr('id') == 'psx4') {
                            subUrl = "dialog/station_unit.html";
                        } else if ($(this).attr('id') == 'psx5') {
                            subUrl = "dialog/station_inverter.html";
                        }
                        $('#index_frame').attr('src', subUrl);
                    });
                    url = window.location.pathname.replace('index.html', '') + 'powerList.html';
                    $('.side_nav li').eq(2).addClass('current');
                    break;
                case "#powerReport":
                    $('.secondnav').hide();
                    var url = window.location.pathname.replace('index.html', '') + 'powerReport.html';
                    $('.side_nav li').eq(3).addClass('current');
                    break;
                case "#powerManage":
                    var str = '<ul><li id="psx1" class=""><a href="javascript:;" class="secondnav11"></a>' +
                        '<span>消缺管理</span><i id="test1" class=""></i></li>' +
                        '<li id="psx2" class="current"><a href="javascript:;" class="secondnav7"></a>' +
                        '<span>告警管理</span><i id="test2" class="rightNav_icon1"></i>' +
                        '</li>' +
                        '<li id="psx3"><a href="javascript:;" class="secondnav7"></a>' +
                        '<span>任务管理</span><i id="test2"></i>' +
                        '</li></ul>';
                    $('.secondnav').html(str).show();


                    $('.secondnav li').click(function () {  //右侧电站列表nav
                        $('.secondnav li').removeClass('current');
                        $('.secondnav li').find('i').removeClass('rightNav_icon1');
                        $(this).addClass('current');
                        $(this).find('i').addClass('rightNav_icon1');

                        if ($(this).attr('id') == 'psx1') {
                            subUrl = "dialog/power_workorder.html";
                        } else if ($(this).attr('id') == 'psx2') {
                            subUrl = "dialog/power_manage.html";
                        } else if ($(this).attr('id') == 'psx3') {
                            subUrl = "dialog/power_task.html";
                        }
                        $('#index_frame').attr('src', subUrl);
                    });


                    url = window.location.pathname.replace('index.html', '') + 'dialog/power_manage.html';
                    $('.side_nav li').eq(4).addClass('current');
                    break;
                default:
                    ;
            }
            $('#index_frame').attr('src', url);
        },

        //左侧主导航nav
        leftTab: function (e) {
            var target = null;
            if ($(e.target).parent()[0].tagName == 'LI') {
                target = $(e.target).parent();
            } else if ($(e.target).parent().parent()[0].tagName == 'LI') {
                target = $(e.target).parent().parent();
            } else if ($(e.target)[0].tagName == 'LI') {
                target = $(e.target);
            }
            $('.side_nav li').removeClass('current');
            target.addClass('current');
            var strPath = window.location.pathname;
            window.location.href = strPath + '#' + target.attr('id');
            var url = '';
            if (target.attr('id') == 'powerManage') {
                url = 'dialog/' + target.attr('id') + '.html';
            } else {
                url = target.attr('id') + '.html';
            }

            $('#index_frame').attr('src', url);
            this.checkHash();  //检测hash跳转页面

        },

        //关闭弹窗
        closeHisInfo: function () {
            $("#showHisPageFrame").hide();
        }
    },
    mounted: function () {

        //初始化弹窗iframe
        $(".ygshow_con").css("height", $(window).height() - 100);
        $(".ygshow_con").css("width", $(window).width() - 240);
        $(".Popup-iframe iframe").css("width", $(window).width() - 240);
        $(".Popup-iframe iframe").css("height", $(window).height() - 160);

        //页面resize 弹窗自适应
        $(window).resize(function () {
            $(".ygshow_con").css("height", $(window).height() - 100);
            $(".ygshow_con").css("width", $(window).width() - 240);
            $(".Popup-iframe iframe").css("width", $(window).width() - 240);
            $(".Popup-iframe iframe").css("height", $(window).height() - 160);
        });

        this.checkHash();  //检测hash跳转页面

    }
});