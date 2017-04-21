
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
                    str += '<li id="'+ n.id+ '" onclick=checkCss('+n.id+') class="on"><a href="#" title = "'+ n.name+'" >'+ n.name + '</a></li>';
                } else {
                    str += '<li id=' + n.id+' onclick=checkCss('+n.id+')><a href="#" title = "'+ n.name+'" >'+ n.name+ '</a></li>';
                }
            });
            str+="</ul>";
            $(id).html(str);
        }else{
            $(id).html("");
        }
    }
};