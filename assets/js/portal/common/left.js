$(document)
    .ready(
    function() {

        var page_title = $("#pageTitle").val();
        if (page_title == "psOverView") {
            $("#psOverview").attr("class", "current");
        } else if (page_title == "psMap") {
            $("#psMap").attr("class", "current");
        } else if (page_title == "allPsList") {
            $("#allPsList").attr("class", "current");
        } else if (page_title == "psReportPage") {
            $("#psReportPage").attr("class", "current");
        } else if (page_title == "psAnalyzePage") {
            $("#psAnalyzePage").attr("class", "current");
        } else if (page_title == "psAffair") {
            $("#psAffair").attr("class", "current");
        } else if (page_title == "psDevice") {
            $("#psDevice").attr("class", "current");
        } else if (page_title == "stationPic") {
            $("#stationPic").attr("class", "current");
        } else if (page_title == "psKnowledgeBase"){
            $("#psKnowledgeBase").attr("class", "current");
        } else if (page_title == "intelligentAnalysis"){
            $("#intelligentAnalysis").attr("class", "current");
        }


        /*
         //Chud : 2016-06-15 10:30
         if (document.title == LANG.sta_overview_nav) {
         $("#psOverview").attr("class", "current");
         } else if (document.title == LANG.map_nav) {
         $("#psMap").attr("class", "current");
         } else if (document.title == LANG.all_station_nav) {
         $("#allPsList").attr("class", "current");
         } else if (document.title == LANG.station_report_nav) {
         $("#psReportPage").attr("class", "current");
         } else if (document.title == LANG.analysis_report_nav) {
         $("#psAnalyzePage").attr("class", "current");
         } else if (document.title == LANG.pro_management_nav) {
         $("#psAffair").attr("class", "current");
         } else if (document.title == LANG.asset_management_nav) {
         $("#psDevice").attr("class", "current");
         } else if (document.title == LANG.pic_title) {
         $("#stationPic").attr("class", "current");
         } else if (document.title == LANG.knowledge_title){
         $("#psKnowledgeBase").attr("class", "current");
         }
         */


        /*  $('.side_navss').live('hover',function(event){
         if(event.type=='mouseenter'){
         $(this).stop().animate({"width":"150px"},200).css({"overflow":"visible"});
         $(this).find("a").children("em").show(500);
         $("#sidenav_btn").animate({"left":"149px"},200);
         $("#sidenav_btn").toggle(function(){
         $(this).removeClass("sidenav_btn").addClass("sidenav_btnon");
         $(this).parent(".side_nav").stop().animate({"width":"60px"},200).css({"overflow":"visible"});
         $(this).siblings("ul").find("a").children("em").hide();
         $(this).stop().animate({"left":"60px"},200);
         },function(){
         $(this).removeClass("sidenav_btnon").addClass("sidenav_btn");
         });
         }else{
         $(this).find("a").children("em").hide();
         $(this).stop().animate({"width":"60px"},200).css({"overflow":"visible"});
         $("#sidenav_btn").stop().animate({"left":"60px"},200);
         }
         });
         $("#sidenav_btn").hover(function(event){
         event.stopPropagation();
         }).click(function(event){

         if( $("#lock").val() == "yes"){
         $(this).removeClass("sidenav_btnon").addClass("sidenav_btn");
         $(this).parent(".side_nav").addClass('side_navss');
         $("#lock").val("no");
         } else {
         $(this).removeClass("sidenav_btn").addClass("sidenav_btnon");
         $(this).parent(".side_nav").removeClass('side_navss');
         $("#lock").val("yes");
         }

         });*/

    });

function changenewpage(url) {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var prePath = ctx;
    //addSysLog($("#pageTitle").val(),"access",strPath,"鑿滃崟鐐瑰嚮");
    $("#form_lock").attr("action",prePath+url);
    $("#form_lock").submit();
}