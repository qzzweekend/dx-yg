$(window).load(function(){
    window_resize();
});

$(window).resize(function(){
    window_resize();
});

function window_resize(){
    resizeWinWidth();
    resizeWinHeight();
    resizeAllDiv();
    resizeIfmWin();
}

function resizeWinHeight(){
    var h = $(window).height();
    if(h) {
        $(".map_wap").css("height",h-56);
        $(".map_wapp").css("height", h - 48);
        $(".map_con").css("height", h - 120);
        $(".pic_height").css("height", h - 130);
        $("#liebiao").css("height", h - 80);
        $(".tendencyChart_con").css("height", h - 140);
        $("#report_mess").css("height", h - 240);
        //2016 10 18 集团发电报表高度 wangli
        $(".TableSlide").height($(".if_map_pic").height()-120);
        $(".secondnav").css("height", h - 50);
        $(".svgheight").css("height", h - 10);
        $(".ygheight").css("height", h - 242);
        $(".map_con2").css("height",h-20);
        $(".ygheight2").css("height",h-142);
        //新增
        $(".yg_ifbox iframe").css("height", h - 130);
        $(".yg_panorama").css("height", h - 130);
        $(".yg_panorama iframe").css("height", h - 130);
        $("iframe.boardFrame").css("height", h - 130);
        $(".yg_mes iframe").css("height", h - 130);
        $(".yg_library").css("height",h-76);
        $(".yg_library iframe").css("height",h-76);
        $(".yg_library_noright").css("height",h-76);
        $(".yg_library_noright iframe").css("height",h-76);
        $(".yg_mes").css("height",h-130);
        $(".yg_ifbox").css("height",h-130);
        $(".tendency_ri").css("height",h-130);
    }
}

function resizeWinWidth(){
    var width = $(window).width();
    if(width) {
        $(".tendency_ri").css("width",width-380);
        $(".siteMore").css("width",width-300);
        $(".map_pic").css("width",width-315);
        //2016 09 20 电站地图 宽度 修改wangli
        $(".map_con .map_pic").css("width",width-305);
        $(".index_right").css("width",width-85);
        $(".map_wap").css("width",width-85);
        $(".map_wapp").css("width",width-85);
        $(".problem_con_table2").css("width",width-610);
        //start 2016  11 07 wangli 高度修改
        $(".siteMore_con_lf").css("width",width-915);
        $(".index_right2").css("width",width);
        //新增
        $(".yg_ifbox").css("width",width-380);
        //2016 1009 全景图 宽度 修改
        $(".yg_panorama").css("width",width-305);
        $(".yg_mes").css("width",width-380);
        $(".yg_library").css("width",width-160);
        $(".yg_library_noright").css("width",width-85);
    }
}

function resizeAllDiv(){
    var HH = $(window).height();
    var $siteMore = $(".siteMore");
    var $map_con_fl = $(".map_con_fl");
    if($siteMore.length>0){
        if($map_con_fl.length>0){
            $siteMore.css("height",$map_con_fl.height());
        } else {
            $siteMore.css("height",HH-130);
        }
        resizeInvertP();
    }
    resizeHuiLiu();
}
/*计算底部分页高度 单元,逆变器*/
function resizeInvertP(){
    var sDh = $(".siteMore").height();
    var ccH = $(".cell_charts").height();
    var allsite_dateH = $(".allsite_date").height();
    var pag = 17;
    $(".cell_table2").height(sDh-ccH-allsite_dateH-pag-$(".page-div").height()+10);
}

/*计算底部分页高度 汇流箱*/
function resizeHuiLiu(){
    if($("#pageId").val()=="psBoxPage"){
        var sDh = $(".siteMore").height();
        var allsite_dateH = $(".allsite_date").height();
        var $problem_con = $(".problem_con");
        $problem_con.height(sDh-allsite_dateH-17);
        var pDh = $problem_con.height();
        $("#psBoxTable").height(pDh-$(".page-div").height()+10);
    }
}
//iframe页面调整（报表模块）
function resizeIfmWin(){
    var $if_m = $(".if_m");
    //集团报表 样式 2016 1018 wangli
    var $if_m_rep = $(".if_m2");
    var $if_map_wapp_con = $(".if_map_wapp_con");
    var $if_map_wapp = $(".if_map_wapp");
    var $if_map_pic = $(".if_map_pic");
    var $report_mess = $("#report_mess");
    if($if_m.length>0&&$if_map_wapp.length>0){
        $if_map_wapp_con.height($if_map_wapp.height()-15);
        $if_m.height($if_map_wapp_con.height()-40);
        $if_m.width($(window).width());
        $("#liebiao").height($if_map_wapp.height()-65);
        $("#groupliebiao").height($if_map_wapp.height()-25);
        $if_map_pic.width($(window).width()-230);
        $report_mess.height($if_map_wapp.height()-165);
        $report_mess.width($if_map_pic.width()-16);
        $(".TableSlide").height($if_map_wapp.height()-120);
        $if_map_pic.height($if_map_wapp.height()-65);
        $(".groupRight").height($if_map_wapp.height()-35);//2016 1019 集团发电报表 修改
    }else if($if_m_rep.length>0&&$if_map_wapp.length>0){//集团报表 样式 2016 1018 wangli
        $if_map_wapp_con.height($if_map_wapp.height()-15);
        $if_m_rep.height($if_map_wapp_con.height());
        $if_m_rep.width($(window).width());
        $("#liebiao").height($if_map_wapp.height()-65);
        $("#groupliebiao").height($if_map_wapp.height()-25);//2016 1019 集团发电报表 修改
        $if_map_pic.width($(window).width()-230);
        $report_mess.height($if_map_wapp.height()-165);
        $report_mess.width($if_map_pic.width()-16);
        $(".TableSlide").height($if_map_wapp.height()-120);
        $if_map_pic.height($if_map_wapp.height()-65);
        $(".groupRight").height($if_map_wapp.height()-35);
    }

}


