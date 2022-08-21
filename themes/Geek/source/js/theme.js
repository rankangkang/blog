const footer = document.querySelector('#footer')
const flink = document.querySelector('.flink')
const ba = document.querySelector('.ba')
const bodyx = document.querySelector('#bodyx')
const upd = document.querySelector('#update_style')

function setCookie(key, value) {
    localStorage.setItem(key, value);
}

function getCookie(key) {
    var data = localStorage.getItem(key);
    return data
}

function updateStyle() {
    if (getCookie("style") == "white") {
        footer?.setAttribute('style', "color: #51525d;")
        flink?.setAttribute('style', "color: #51525d;")
        ba?.setAttribute('style', "color: #51525d;")
        bodyx?.setAttribute('class', "bg_white")
        upd?.setAttribute('checked', "false")
    } else {
        footer?.removeAttribute('style')
        flink?.removeAttribute('style')
        ba?.removeAttribute('style')
        bodyx?.classList.remove('bg_white')
        upd?.setAttribute('checked', "true")
    }
}

if (getCookie("style") == "white") {
    setCookie("style", "white")
    updateStyle();
} else {
    setCookie("style", "black")
    updateStyle();
}

upd.addEventListener('change', function() {
    const checked = upd.matches(':checked')
    if (checked) {
        setCookie("style", "black")
        updateStyle();
    } else {
        setCookie("style", "white")
        updateStyle();
    }
})