$(function(){
    resizePage();
});

$(window).resize(function(){
    resizePage();
});

/*
 function resizePage(){
 var HH= window.screen.height;
 if(HH)
 {
 $(parent.document).find("#liebiao").css("height",HH-240);
 $(parent.document).find(".map_con").css("height",HH-240);
 $(parent.document).find(".map_pic").css("height",HH-240);
 $(parent.document).find(".map_wapp").css("height",HH-170);
 }
 }*/

function resizePage(){

    //ifm高度
    $(".index_ifm_siz").height($(window).height()-56);
    //左边导航的高度
    $(".admin_left").height($(window).height());
    //右边总体宽高
    $(".admin_right").height($(window).height()-$(".admin_header").height());
    $(".admin_right").width($(window).width()-$(".secondnav").width());
    //智能分析内页宽高
    $(".analysis_con_main").height($(window).height()-$(".admin_header").height()-51);
    $(".analysis_con_c2 .bd").height($(".analysis_con_c2").height()-36);
    $(".analysis_con_c2 .bd ul").height($(".analysis_con_c2").height()-36);
    $(".analysis_c1_maps").height($(".analysis_c1_main").height()-15);
    //智能分析tab高度
    $(".analysis_con_c2_tab_center").height($(".analysis_con_c2 .bd ul").height()-145);
    //智能分析tab高度
    $(".analysis_con_c2_tab_center2").height($(".analysis_con_c2 .bd ul").height()-95);
    $(".analysis_con_c2_tab_center3").height($(".analysis_con_c2 .bd").height()-70);
    $(".analysis_con_c2_tab_center4").height($(".analysis_con_c2 .bd ul").height()-105);
    //智能分析table页眉
    $(".tab_width01").width($(".tab_width1").width());
    $(".tab_width02").width($(".tab_width2").width());
    $(".tab_width03").width($(".tab_width3").width());
    $(".tab_width04").width($(".tab_width4").width());
    $(".tab_width05").width($(".tab_width5").width());
    $(".tab_width06").width($(".tab_width6").width());
    $(".tab_width07").width($(".tab_width7").width());
    $(".tab_width08").width($(".tab_width8").width());
    $(".tab_width09").width($(".tab_width9").width());
    $(".tab_width010").width($(".tab_width10").width());
    $(".tab_width011").width($(".tab_width11").width());
    //首页宽高
    $(".index_main").width($(".admin_right").width()-15);
    $(".index_main").height($(".admin_right").height()-15);
    //$(".index_left").width($(".index_main").width()-520);
    $(".index_left").height($(".index_main").height());
    $(".index_right").height($(".index_main").height());
    //$(".index_left_top").width($(".index_left").width());
    //$(".index_left_top_top").width($(".index_left_top").width());
    $(".index_right_list_con").height($(".index_right_list_main").height()-50);
    $(".index_right_list_con ul li div").css("line-height",$(".index_right_list_con ul li div").height()+'px');
    $(".index_right_echarts_mian").height($(".index_right_echarts_left").height()-40);
    $(".index_right_echarts_mian").width($(".index_right_list_main").width()/2);
    $(".index_left_top_top_echarts").width($(".index_left").width());
    $(".index_left_top_top_echarts").height($(".index_left_top_top").height()-10);
    $(".index_right_slide").height($(".index_right_list_main").height()-50);
    $(".index_left_bottom_list_bottom").height($(".index_left_bottom_list_main").height());
    $(".column_echarts").height($(".index_left_bottom_list_bottom").height());
    $(".column_echarts").width($(".index_left_bottom_list_bottom").width());
    $(".distab").height($(".index_num_con_mian img").height());
    $(".daochu1").css('left', $(".index_right_list_main").width()/2 - 71);
    $(".daochu2").css('left', $(".index_right_list_main").width()/2 - 71);

    //智能分析3table页眉
    $(".tab2_width01").width($(".tab2_width1").width());
    $(".tab2_width02").width($(".tab2_width2").width());
    $(".tab2_width03").width($(".tab2_width3").width()+$(".tab2_width4").width()+$(".tab2_width5").width());
    $(".tab2_width04").width($(".tab2_width6").width()+$(".tab2_width7").width()+$(".tab2_width8").width());
    $(".tab2_width05").width($(".tab2_width9").width()+$(".tab2_width10").width()+$(".tab2_width11").width());
    $(".tab2_width06").width($(".tab2_width12").width()+$(".tab2_width13").width()+$(".tab2_width14").width());
    $(".tab2_width07").width($(".tab2_width15").width()+$(".tab2_width16").width()+$(".tab2_width17").width());
    $(".tab2_width08").width($(".tab2_width18").width());
    $(".analysis_wet_main").height($(".analysis_con_c2 .bd ul").height()-30);
    $(".analysis_wet_left_con").height($(".analysis_wet_main").height()-100);
    $(".analysis_weather_top_right").height($(".analysis_weather_top img").height());
    //值班信息
    $(".duty_con").height($(".duty_main").height()-25);
    $(".duty_left_bottom").height($(".duty_con").height()-100);
    $(".duty_left_table_ovf").height($(".duty_left_bottom").height()-105);
    $(".duty_t1").width($(".duty_t01").width());
    $(".duty_t2").width($(".duty_t02").width());
    $(".duty_t3").width($(".duty_t03").width());
    $(".duty_t4").width($(".duty_t04").width());
    $(".duty_t5").width($(".duty_t05").width());
    $(".duty_t6").width($(".duty_t06").width());
    $(".duty_t7").width($(".duty_t07").width());
    $(".duty_t8").width($(".duty_t08").width());
    $(".duty_t9").width($(".duty_t09").width());

}