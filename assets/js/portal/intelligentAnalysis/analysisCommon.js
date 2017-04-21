/**
 * Created by huangls on 2016/5/17.
 */
// 翻页参数
var CurPage = 1;
var h = $(window).height() - 75;
var size = 10;
var rowCount = 0;
var startPageFlag = false;
var ps_id2;

var ps_id = '';
var uuid, ps_name;
function initPage() {
    //2016 08 04 wangli 修改查询bug
    //if ($("#ps_name").val() != "" && $("#ps_name").val() != undefined) {
    //    CurPage = 0;
    //}
    //var obj = {};
    //obj["size"] = size;
    //obj["curPage"] = CurPage;
    ////如果传参过来已经有页码
    //obj["psId"] = ps_id;
    //obj["ps_id"] = ps_id2;
    //obj["uuId"] = uuid;
    //obj["ps_name"] = $("#ps_name").val();
    //obj["ps_type"] = $("#ps_type").val();
    //obj["ps_capacity"] = $("#ps_capacity").val();
    //obj["area_id"] = $("#country_all").val();
    //obj["install_date_start"] = $("#install_date_start").val();
    //$.ajax({
    //    url: "getPsView?psId=" + ps_id,
    //    type: "post",
    //    dataType: 'html',
    //    timeout: 200000,
    //    data: obj,
    //    beforeSend: function (XMLHttpRequest) {
    //        //alert(globalSmallLoadingHTML);
    //        //("#ss"+psId).html(globalSmallLoadingHTML);
    //    },
    //    success: function (data) {//响应成功后执行的方法体
    //        $("#psDetail").html(data);
    //        $(".treeDemoId li").click(function () {
    //            $(".treeDemoId li").removeClass("on");
    //            $(this).addClass("on");
    //        });
    //        rowCount = document.getElementById('totalCount').value;
    //        if (rowCount > 0) {
    //            if (document.getElementById('Pagination') != null) {
    //                document.getElementById('Pagination').style.display = '';
    //                document.getElementById('Searchresult').style.display = '';
    //                startPageFlag = false;
    //                currentPage = CurPage - 1;
    //                pslistPage();   //必须放在success里，要等待success执行结果后才能执行
    //            } else {
    //            }
    //        } else {
    //            if (document.getElementById('Pagination') != null) {
    //                document.getElementById('Pagination').style.display = 'none';
    //                document.getElementById('Searchresult').style.display = 'none';
    //            }
    //        }
    //    },
    //    error: function () {//响应错误后执行的方法体
    //        easyDialog.open({
    //            container: {
    //                header: LANG["all_station_prompt"],
    //                content: LANG["all_station_requesttimeout"],
    //                noFn: true,
    //                noText: LANG["pro_management_determine"]
    //            },
    //            fixed: false
    //        });
    //    }
    //});

    //var Parameters = {
    //    "parameters":{
    //        "stationid": "gs"
    //    },
    //    "foreEndType": 2,
    //    "code": "30000006"
    //};
    //vlm.loadJson("", JSON.stringify(Parameters), function (res) {
    //    console.log(res);
    //    var result=res.data;
    //    //$("#psDetail").html(data);   //并网电站主目录(暂时写死)
    //
    //    //for(var i=0;i<result.length; i++){
    //    //    showTreeNodeImageByDeviceType(result[i]); //code图标转换
    //    //}
    //    //
    //    //var powerStr = $('#powerTpl').html();
    //    //var powerLi = ejs.render(powerStr, {result: result});
    //    //$('#power_sec_Ul').html(powerLi);
    //
    //
    //    //电站展开，其他关闭
    //    $(".treeDemoId >li").click(function () {
    //        $(".treeDemoId >li").removeClass("on");
    //        $(this).addClass("on");
    //    });
    //    rowCount = document.getElementById('totalCount').value;
    //    if (rowCount > 0) {
    //        if (document.getElementById('Pagination') != null) {
    //            document.getElementById('Pagination').style.display = '';
    //            document.getElementById('Searchresult').style.display = '';
    //            startPageFlag = false;
    //            currentPage = CurPage - 1;
    //            pslistPage();   //必须放在success里，要等待success执行结果后才能执行
    //        } else {
    //        }
    //    } else {
    //        if (document.getElementById('Pagination') != null) {
    //            document.getElementById('Pagination').style.display = 'none';
    //            document.getElementById('Searchresult').style.display = 'none';
    //        }
    //    }
    //
    //});

}


var currentPage = 0;
function pslistPage() {
    this.size = size;
    // 此demo通过Ajax加载分页元素
    var initPagination = function () {

        currentPage < 0 ? currentPage = 0 : currentPage = currentPage;//fix currentPage为负数的BUG
        var num_entries = rowCount;
        // 创建分页
        $("#Pagination").pagination(num_entries, {
            num_edge_entries: 1, // 边缘页数
            num_display_entries: 4, // 主体页数
            current_page: currentPage,
            callback: pageselectCallback,
            ellipse_text: "...",
            Flag: 1,
            items_per_page: size, // 每页显示1项
            prev_text: "<",
            next_text: ">"
        });
    };

    function pageselectCallback(page_index, jq) {
        var new_content = $("#hiddenresult div.result:eq(" + page_index + ")").clone();
        $("#Searchresult").empty().append(new_content);
        // 装载对应分页的内容
        CurPage = page_index + 1;
        if ($("#curPage").length > 0) {
            $("#curPage").val(CurPage);
        }
        curPage = CurPage;
        //queryPowerData();
        //changePage();
        if (startPageFlag) {    //不是点击分页按钮的时候不调用changePage方法
            //queryPowerData();
            changePage();
        }
        startPageFlag = true;
        return false;
    }

    // ajax加载
    //$("#hiddenresult").load(loadding_src, null, initPagination);  qzz
}

function changePage() {
    var obj = {};
    obj["size"] = size;
    obj["curPage"] = CurPage;
    //alert(curPage);
    obj["ps_name"] = $("#ps_name").val();
    obj["ps_type"] = $("#ps_type").val();
    obj["ps_capacity"] = $("#ps_capacity").val();
    obj["area_id"] = $("#country_all").val();
    obj["install_date_start"] = $("#install_date_start").val();
    layer.load(0, 2);
    $.ajax({
        url: "psBlockAction_getPsView",
        type: "post",
        async: false,
        cache: false,
        dataType: 'html',
        timeout: 200000,
        data: obj,
        beforeSend: function (XMLHttpRequest) {
            //alert(globalSmallLoadingHTML);
            //("#ss"+psId).html(globalSmallLoadingHTML);
        },
        success: function (data) {//响应成功后执行的方法体
            layer.closeAll();
            $("#psDetail").html(data);
        },
        error: function () {//响应错误后执行的方法体
            layer.closeAll();
            easyDialog.open({
                container: {
                    header: LANG["all_station_prompt"],
                    content: LANG["all_station_requesttimeout"],
                    noFn: true,
                    noText: LANG["pro_management_determine"]
                },
                fixed: false
            });
        }
    });
}

// 全屏状态，初始为false
var fullScreenflag = false;
function expand() {
    // 全屏显示 更改样式
    $(".secondnav").css("display", "none");
    $(".side_nav").css("display", "none");
    $(".index_top").css("display", "none");
    $(".map_select").css("display", "none");
    $(".map_con_fl").css("display", "none");
    $(".map_con_fl_page").css("display", "none");
    $("#siteMoreDiv").addClass("map_bg").css({
        "background-color": "#fff"
    });
    $("#siteMoreDiv").removeClass("siteMore");
    $("#siteMoreDiv").removeClass("fr");
    $("#map_wap_div").removeClass("map_wap");
    $(".index_right").removeClass("fr");
    $(".index_right").css("width", "100%");
    $("#siteMoreDiv").css("width", "100%");
    $(".problem_con_table").addClass("problem_height");
    // 更改图标
    $(".change_size img").attr("src", "../resource/images/change_size4.png");
    // 汇流箱
    $("#problem_con_div").removeClass("problem_con_table2");
    var H = $(window).width();
    $("#problem_con_div").css("width", H - 220);
    $("tr .expand_display_flag").hide();
    getExpandValue();
    // 更改全屏状态
    $(window).trigger("resize");
    fullScreenflag = true;

}
function closeExpand() {
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
    //$("#bingMapId").addClass("fr");
    $("#siteMoreDiv").removeClass("map_bg");
    $("#siteMoreDiv").addClass("siteMore");
    $("#siteMoreDiv").addClass("fr");
    $(".index_right").addClass("fr");

    // 汇流箱
    $("#problem_con_div").addClass("problem_con_table2");

    // 更改图标
    $(".change_size img").attr("src", "../resource/images/change_size2.png");
    $("tr .expand_display_flag").show();
    getExpandValue();
    $(window).trigger("resize");
    // 更改全屏状态
    fullScreenflag = false;
    $(".just_single_show").css("display", "none");

}

//点击全屏
//$("#change_size").toggle(expand, closeExpand);

//点击全屏
$("#change_size").unbind().bind('click',
    function () {
        // console.log(fullScreenflag);
        if (fullScreenflag) {
            closeExpand();
        } else {
            expand();
        }

    });

//键盘“Esc”出发消失
$(document).keyup(function (event) {
    if (fullScreenflag == true) {
        switch (event.keyCode) {
            case 27:
                closeExpand();
                break;
            case 96:
                break;
        }
    }
});

/**
 * 通过更改CSS,让表格表头产生悬停效果
 *
 * tableid  表格table id 带有#号前缀
 * tbodyid  表格tbody id 带有#号前缀
 */
function reDisplayTable(tableId, tbodyid) {
    if ($(tbodyid).find("tr:first")) { // 防止表格没有数据
        // 去除所有的样式
        $(tbodyid).removeAttr("style");
        $(tableId).find("thead").removeAttr("style");
        $(tbodyid).find("tr:first").find("td").each(function (i) {
            $(this).removeAttr("style");
        });
        $(tableId).find("thead").find("th").each(function (i) {
            $(this).removeAttr("style");
        });

        // 去除表格左边框
        $(tableId).css({"border-left": "0"});

        // 第一行数据
        var tableTbodyTd = $(tbodyid).find("tr:first").find("td");
        var tableThSizeArray = [];
        // 保存初始表头单元格宽度
        $(tbodyid).find("tr:first").find("td").each(function (i) {
            var thWidth = $(this).width();
            tableThSizeArray.push(thWidth);
        });

        // 设置表头悬浮css
        $(tableId).find("thead").css({
            "display": "block",
            "position": "absolute",
            "top": "209px",
            "left": "0",
            "border-top": "1px solid #e2e2e2"
        });
        //  设置表格单元格宽度
        $(tableId).find("thead").find("th").each(function (i) {
            $(this).width(tableThSizeArray[i]);
            $(tableTbodyTd[i]).width(tableThSizeArray[i]);
        });
        // 设置tbody的相对位置
        var thHeight = $(tableId).find("thead").height() - 1;
        var marginTop = thHeight + "px";
        $(tbodyid).css({"display": "block", "margin-top": marginTop, "left": "0"});
    }
}


function beforeAsync() {
    curAsyncCount++;
}

function onAsyncSuccess(event, treeId, treeNode, msg) {
    curAsyncCount--;
    if (curStatus == "expand") {
        expandNodesTree(treeNode.children);
    } else if (curStatus == "async") {
        asyncNodes(treeNode.children);
    }

    if (curAsyncCount <= 0) {
        if (curStatus != "init" && curStatus != "") {
            asyncForAll = true;
        }
        curStatus = "";
    }
}

function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
    curAsyncCount--;

    if (curAsyncCount <= 0) {
        curStatus = "";
        if (treeNode != null) asyncForAll = true;
    }
}

var curStatus = "init",
    curAsyncCount = 0,
    asyncForAll = false,
    goAsync = false;
function expandAll() {
    if (!check()) {
        return;
    }
    if (asyncForAll) {
        zTree.expandAll(true);
    } else {
        expandNodes(zTree.getNodes());
        if (!goAsync) {
            curStatus = "";
        }
    }
}
var nodeList = [],
    fontCss = {};

function expandNodes(nodes) {
    //alert(uuId);
    if (!nodes) return;
    curStatus = "expand";
    //var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    for (var i = 0,
             l = nodes.length; i < l; i++) {
        if (uuId == nodes[i].uuid) {
            if (nodes[i] === null) {
                nodeList = [];
            } else {
                nodeList = [nodes[i]];
            }
            searchNode(nodeList);
        }
        zTree.expandNode(nodes[i], true, false, false);
        if (nodes[i].isParent && nodes[i].zAsync) {
            expandNodes(nodes[i].children);

        } else {
            goAsync = true;
        }
    }
}

function searchNode(nodeList) {
    //alert( nodeList.length==0);
    if (nodeList == null) {
        updateNodes(false);
    } else {
        updateNodes(true);
    }
}
function updateNodes(highlight) {
    for (var i = 0,
             l = nodeList.length; i < l; i++) {
        nodeList[i].highlight = highlight;
        zTree.selectNode(nodeList[i]);
    }
}


function check() {
    if (curAsyncCount > 0) {
        return false;
    }
    return true;
}

function expandNodesTree(nodes) {
    if (!nodes) return;
    curStatus = "expand";
    for (var i = 0, l = nodes.length; i < l; i++) {
        if (uuId == nodes[i].uuid) {
            if (nodes[i] === null) {
                nodeList = [];
            } else {
                nodeList = [nodes[i]];
            }
            searchNode(nodeList);
        }
        if (gridPointUuid == nodes[i].uuid || unitUuid == nodes[i].uuid) {//2016-09-02 ChuD; 左侧树具体定位
            zTree.expandNode(nodes[i], true);
        }
        if (nodes[i].isParent && nodes[i].zAsync) {
            expandNodesTree(nodes[i].children);
        } else {
            goAsync = true;
        }
    }
}