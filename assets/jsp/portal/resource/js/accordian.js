
var DicAccordian = function() {
}

DicAccordian.prototype = {
    constructor : DicAccordian,
    name : "DicAccordian",
    id : null,
    init : function(div_id, _datas) {
        var id="#"+div_id;
        $(id).html();
        var str="<ul>";
        if(_datas!=undefined){
            $.each(_datas, function(i, n) {
                if (i == 0) {
                    str += '<li id="'+ n.fd_station_id+ '" onclick=checkCss('+n.fd_station_id+') class="on"><a href="#" title = "'+ n.fd_station_name+'" >'+ n.fd_station_name + '</a></li>';
                } else {
                    str += '<li id=' + n.fd_station_id+' onclick=checkCss('+n.fd_station_id+')><a href="#" title = "'+ n.fd_station_name+'" >'+ n.fd_station_name+ '</a></li>';
                }
            });
            str+="</ul>";
            $(id).html(str);
        }else{
            $(id).html("");
        }
    }
};