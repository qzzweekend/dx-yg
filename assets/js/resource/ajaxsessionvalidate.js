$.ajaxSetup({
    cache:true,//设置全局ajax 缓存
    contentType:"application/x-www-form-urlencoded;charset=utf-8",
    complete:function(XMLHttpRequest,textStatus){
        xhr = null;
        var sessionstatus=XMLHttpRequest.getResponseHeader("sessionstatus");
        if(sessionstatus=="timeout"){
            if(typeof(console)!="undefined"){console.log('session time out,please login!')}
            if(typeof(layer)!="undefined"){
                layer.msg(LANG["sessionTimeOut"] , {
                    time:3000,
                }, function(){
                    backToLogin();
                });
            } else if(typeof(parent.layer)!="undefined"){
                parent.layer.msg(LANG["sessionTimeOut"] , {
                    time:3000,
                }, function(){
                    backToLogin();
                });
            }
        }
    },
    error: function (xhr, status, e) {
        xhr = null;
        if(typeof(console)!="undefined"){console.log('request url:'+url+' is failed:'+e)}
    }
});

function backToLogin() {
    var url = getRootPath() + "/login.jsp";
    var top = getTopWinow();
    top.location.href = url;
}


function getRootPath() {

    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var pos = strFullPath.indexOf(strPath);
    var prePath = strFullPath.substring(0, pos);
    //  var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    //  return (prePath + postPath);
    return prePath;
}

function getTopWinow(){
    var p = window;
    while(p != p.parent){
        p = p.parent;
    }
    return p;
}