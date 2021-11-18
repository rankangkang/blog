var web_style = $("#web_style").val();
var valine_appid = $("#valine_appid").val();
var valine_appKey = $("#valine_appKey").val();

// const queryElement = (str) => {
//     return document.querySelector(str)
// }

// var web_style = queryElement("#web_style").value;
// var valine_appid = queryElement("#valine_appid").value;
// var valine_appKey = queryElement("#valine_appKey").value;

new Valine({
    el: '#vcomments',
    appId: valine_appid,
    appKey: valine_appKey,
    placeholder: '请输入内容...',
    avatar: "wavatar"
})

function setCookie(key, value) {
    localStorage.setItem(key, value);
}

function getCookie(key) {
    var data = localStorage.getItem(key);
    return data
}

function updateStyle() {
    // const rooter = queryElement("#footer")
    // const flink = queryElement(".flink")
    // const ba = queryElement(".ba")
    // const bodyx = queryElement("#bodyx")
    // const update = queryElement("#update_style")
    if (getCookie("style") == "white") {
        $("#footer").attr("style", "color: #51525d;");
        $(".flink").attr("style", "color: #51525d;");
        $(".ba").attr("style", "color: #51525d;");
        $("#bodyx").attr("class", "bg_while");
        $("#update_style").attr('checked', false);
        // rooter.setAttribute("style", "color: #51525d;");
        // flink.setAttribute("style", "color: #51525d;");
        // ba.setAttribute("style", "color: #51525d;");
        // bodyx.setAttribute("class", "bg_while");
        // update.setAttribute('checked', false);
    } else {
        $("#footer").attr("style", "");
        $(".flink").attr("style", "");
        $("#bodyx").attr("class", "");
        $(".ba").attr("style", "");
        $("#update_style").attr('checked', true);
        // rooter.setAttribute("style", "");
        // flink.setAttribute("style", "");
        // ba.setAttribute("style", "");
        // bodyx.setAttribute("class", "");
        // update.setAttribute('checked', true);
    }
}

if (getCookie("style") == null) {
    setCookie("style", web_style)
    updateStyle();
} else if (getCookie("style") == "white") {
    setCookie("style", "white")
    updateStyle();
} else if (getCookie("style") == "black") {
    setCookie("style", "black")
    updateStyle();
}

$("#update_style").change(function() {
    var style = $("#update_style").is(':checked');
    if (style) {
        setCookie("style", "black")
        updateStyle();
    } else {
        setCookie("style", "white")
        updateStyle();
    }
});