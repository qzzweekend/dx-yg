new Vue({
    el: '#powerMap',
    data: {
        ps_id: 'gs',  //电站Id
        station_degree:[],
        map:null
    },
    methods: {
        initSize:function(){
            $('.map_pic').height($(window).height()).width($(window).width()-220);
            $('.map_con_fl').height($(window).height()-80);
            $(window).resize(function(){
                $('.map_pic').height($(window).height()).width($(window).width()-220);
                $('.map_con_fl').height($(window).height()-80);
            });
        },
        //获取地图坐标
        getMapByUser: function (e) {
            var powerid = '', target = null;
            if (e == 1) {
                powerid = 'gs';
            } else {
                if ($(e.target)[0].tagName == 'A') {
                    target = $(e.target).parent();
                } else {
                    target = $(e.target);
                }
                target.addClass('on').siblings().removeClass('on');
                powerid = target.attr('id');
            }
            var _this = this;
            var Parameters = {
                "parameters": {"stationid": "", "statusstr": ""},
                "foreEndType": 2,
                "code": "20000006"
            };
            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                if (res.success) {
                    for (var i = 0; i < res.data.length; i++) {
                        var obj={
                            code:res.data[i].fd_station_code,
                            lot:res.data[i].fd_longitude,
                            lat:res.data[i].fd_latitude,
                        }
                        _this.station_degree.push(obj);

                    }
                    _this.drawMap(res, powerid);
                } else {
                    alert(res.message);
                }

            });
        },

        drawMap: function (res, powerid) {
            var _this = this;
            $('#power_map').css('height', $('#content_tot').height())
            // 百度地图API功能
            this.map = new BMap.Map("power_map", {enableMapClick: true});//构造底图时，关闭底图可点功能
            this.map.addControl(new BMap.NavigationControl());
            this.map.addControl(new BMap.ScaleControl());
            this.map.enableScrollWheelZoom(true);
            this.map.disableDoubleClickZoom();
            this.map.disableDoubleClickZoom();
            this.map.setMapStyle({style:'light'})

            var mapArr = res.data;

            // 向地图添加标注
            var icons = '';
            for (var i = 0; i < mapArr.length; i++) {

                if (mapArr[i].fd_station_status == 2) {
                    icons = 'images/green.png';
                    var myIcon = new BMap.Icon(icons, new BMap.Size(20, 30), {
                        offset: new BMap.Size(10, 25), // 指定定位位置
                        imageOffset: new BMap.Size(0, 0), // 设置图片偏移
                    });
                    //
                    //var marker = new BMap.Marker(new BMap.Point(mapArr[i].fd_longitude, mapArr[i].fd_latitude - 0.03), {
                    //    icon: myIcon,
                    //    title: mapArr[i].fd_station_name
                    //});
                    //var label = new BMap.Label(String(mapArr[i].fd_station_code), {offset: new BMap.Size(5, 3)});
                    //marker.setLabel(label);
                    //label.setStyle({display: "none"});
                    //map.addOverlay(marker);
                    //marker.addEventListener("click", function getAttr(e) {
                    //    _this.ps_id = e.target.getLabel().content;
                    //});


                    //map.clearOverlays();
                    var lon = mapArr[i].fd_longitude, lat = mapArr[i].fd_latitude;
                    var pt = new BMap.Point(lon, lat);
                    var marker = new BMap.Marker(pt, {
                        icon: myIcon,
                        title: mapArr[i].fd_station_name
                    });

                    var label = new BMap.Label(String(mapArr[i].fd_station_code), {offset: new BMap.Size(5, 3)});
                    marker.setLabel(label);
                    label.setStyle({display: "none"});

                    this.map.addOverlay(marker);//添加覆盖物

                    marker.addEventListener("click", function (e) {
                        _this.ps_id = e.target.getLabel().content;
                        _this.changePos(e.target);
                    });

                }
            }
            ;

            var markers = this.map.getOverlays();
            for (var i = 0; i < markers.length; i++) {
                if (markers[i].toString() == "[object Marker]") {
                    if (markers[i].getLabel().content.toLowerCase() == powerid) {
                        _this.ps_id = markers[i].getLabel().content;
                        _this.changePos(markers[i]);

                    }
                }
            }
        },

        //图标点击
        changePos: function (obj) {

            var tips=obj.getLabel().content,lot,lat;
            for(var i=0;i<this.station_degree.length; i++){
                if(tips == this.station_degree[i].code){
                    lot = this.station_degree[i].lot;
                    lat = this.station_degree[i].lat;
                }
            };

            var point = new BMap.Point(lot, lat);
            this.map.centerAndZoom(point, 13);

            var _this = this, that = obj,
                Parameters = {
                    "parameters": {
                        "stationid": this.ps_id
                    },
                    "foreEndType": 2,
                    "code": "20000010"
                };
            vlm.loadJson("", JSON.stringify(Parameters), function (result) {
                if (result.success) {
                    var result = result.data;

                    for (var name in result) {
                        if (result[name] == null) {
                            result[name] = '--';
                        }
                    }
                    var sContent = '<div class="site">' +
                        '<div class="site_1 clearfix">' +
                        '<span class="fl site_pic">' +
                        '<img id="weatherIcon" src="jsp/portal/resource/images/weather/34.png" alt="">' +
                        '</span>' +
                        '<span class="fl site_tit" id="ps_name_2" onclick="gotoSinglePsInfo()" style="cursor: pointer">' + result.fd_station_name.substring() + '</span>' +
                        '<span class="fl font14" id="design_capacity">装机功率:' + result.fd_all_intercon_cap + 'kW</span>' +
                        '</div>' +
                        '<div class="site_2">' +
                        '<table>' +
                        '<tbody><tr>' +
                        '<td>' +
                        '<h2>电站功率</h2>' +
                        '<p id="nowCapacity">' + result.fd_all_pw + result.fd_all_pw_unit + '</p>' +
                        '<br></td>' +
                        '<td>' +
                        '<h2>日发电量</h2>' +
                        '<p id="dayPower">' + result.fd_all_power_day + result.fd_all_power_day_unit + '</p>' +
                        '<br></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td>' +
                        '<h2>电站PR</h2>' +
                        '<p id="PRValue">' + result.pr + '%</p>' +
                        '<br></td>' +
                        '<td>' +
                        '<h2>等效小时</h2>' +
                        '<p id="eqValue">'+result.hour+'</p>' +
                        '<br></td>' +
                        '</tr>' +
                        '</tbody></table>' +
                        '</div>' +
                        '<div class="site_3">' +
                        '<ul class="clearfix">' +
                        '<li class="clearfix">' +
                        '<br></li>' +
                        '<li class="clearfix">' +
                        '<span class="fl">未确认</span><span class="number fl"><a href="javascript:void(0);" class="alinkNumber" onclick="goToFaultPage(109192,1);">--</a></span>' +
                        '<br></li>' +
                        '<li class="clearfix">' +
                        '<span class="fl">待处理</span><span class="new_active fl"><a href="javascript:void(0);" class="alinkNumber" onclick="goToFaultPage(109192,2);">--</a></span>' +
                        '<br></li>' +
                        '<li class="clearfix"><span class="fl">处理中</span><span class="finishing fl"><a href="javascript:void(0);" class="alinkNumber" onclick="goToFaultPage(109192,3);">--</a></span>' +
                        '<br></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>';
                    var infoWindow = new BMap.InfoWindow(sContent);//创建信息窗口对象
                    infoWindow.disableAutoPan();//关闭打开信息窗口时地图自动平移。
                    that.openInfoWindow(infoWindow);

                }
            });
        }

    },

    mounted: function () {


        this.initSize();
        this.getMapByUser('1');
    }
});

