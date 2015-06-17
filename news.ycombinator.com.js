/**
 * Allows you to collapse and expand comments in a thread.
 *
 * Copied from: https://github.com/scouttyg/hacker-news-threadify-1
 */

var expand = "[+]";
var reduce = "[-]";

// Run Only on pages that are HN items
if (window.location.pathname.indexOf('/item') === 0) {

// Search for a string
$(".default").each(function(i,e){
    var $comhead = $(".comhead", $(this));
    var $links = $("a", $comhead);

    if($links.length > 0 && $links[0].innerHTML[0]===expand[0]){
        return;
    }

    if($links.length > 1){
        var id = $links[$links.length-1].href.split(/=/)[1];
        $comhead.prepend("<a class='collapselink' id='c_"+id+"' href='javascript:void(0)'>"+reduce+"</a> ");
    }
    else{//Comment has been deleted
        $("div", $(this)).hide();
        $(this).prepend("<a class='collapselink' style='color:#828282' id='c_"+i+"' href='javascript:void(0)'>"+reduce+"</a> ")
    }

});

$(".collapselink").on("click", function(){
    var $t = $(this);
    var id = $t.attr("id").split(/_/)[1];
    var $comment = $(".comment", $t.closest("td"));
    var curIndentLevel = parseInt($("td img", $t.closest("tr")).attr("width"));
    var $com = $t.closest("table");
    var $nextCom = $com.closest("tr").next(); //Following comment
    var changeToggleSign = true;
    var isExpand = $t.html() === expand;

    while($nextCom){
        if($nextCom.length===0 || (parseInt($("td img", $nextCom).attr("width")) <= curIndentLevel)){
            if(isExpand){
                $comment.show().next().show();
                $t.html(reduce);
            }
            else{
                $comment.hide().next().hide();
                $t.html(expand);
            }
            $nextCom = null;
        }
        else{
            if(isExpand){
                if(changeToggleSign){
                    $t.html(reduce);
                    changeToggleSign=false;
                    $comment.show().next().show();
                }
                $(".collapselink", $nextCom).html(reduce);
                $(".comment", $nextCom).show();
                $nextCom.show();
            }
            else{
                if(changeToggleSign){
                    $t.html(reduce);
                    changeToggleSign=false;
                    $comment.hide().next().hide();
                }
                $nextCom.hide();
            }

            $nextCom = $nextCom.next();
        }
    }
});

}
