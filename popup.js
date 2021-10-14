var count = 0
var num_domains = 0
var test_var;
all_cookies = {}

var cookie_img;

function spawnCookies(n) {
    /* clear existing spawned cookies */
    var spawnedImages = document.getElementsByClassName('spawned_cookie');

    while (spawnedImages[0]) {
        spawnedImages[0].parentNode.removeChild(spawnedImages[0]);
    }
    var sheet = document.createElement('style')
    sheet.innerHTML = ".spawned_cookie {display: block; opacity: 1;}";
    document.body.appendChild(sheet);

    /* set spawning delay so all cookies will spawn in 30 seconds */
    let delay = parseInt(30 / n * 1000)

    /* spawn cookies randomly on viewport */
    for (let i = 0; i < n; i++) {
        setTimeout(function timer() {
            this.cookie_img = document.createElement("img");
            this.cookie_img.setAttribute("src", chrome.runtime.getURL("icons/cookie_96.png"));
            this.cookie_img.className = "spawned_cookie";
            this.cookie_img.style.top = parseInt(100 * Math.random()) + "%";
            this.cookie_img.style.left = parseInt(100 * Math.random()) + "%";
            this.cookie_img.style.transform = "rotate(" + parseInt(360 * Math.random()) + "deg)";
            this.cookie_img.style.position = "absolute";
            this.cookie_img.style.zIndex = 999;
            document.body.appendChild(this.cookie_img);
        }, i * delay);
    }
}

function clearSpawnedCookies() {

    /* clear cookeis that have been spawned */
    var spawnedImages = document.getElementsByClassName('spawned_cookie');

    while (spawnedImages[0]) {
        spawnedImages[0].parentNode.removeChild(spawnedImages[0]);
    }

    /* hide cookies that are not finished spawning */
    var sheet = document.createElement('style')
    sheet.innerHTML = ".spawned_cookie {display: none;}";
    document.body.appendChild(sheet);
}

function loadCookies() {
    chrome.cookies.getAll({}, function (cookies) {
        this.count = cookies.length;

        for (var i in cookies) {
            var domain = cookies[i].domain
            if (!this.all_cookies[domain]) {
                this.all_cookies[domain] = []
            }
            this.all_cookies[domain].push(cookies[i])
        }

        num_domains = Object.keys(this.all_cookies).length;
    })
}

/* 
* helper function to interact with the webpage DOM 
* PARAMETERS: 
* func_name - name of function
* args - optional array of arguments
*/
async function doStuffToDOM(func_name, args = null) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: func_name,
        args: args,
    }, _ => {
        let e = chrome.runtime.lastError;
        if (e !== undefined) {
            console.log(tab.id, _, e);
        }
    });;
}

function visualizeCookies() {
    msg = document.createElement('p');
    msg.setAttribute('id', 'cookie_vis_msg')
    msg.innerHTML = "Spawning " + count + " cookies!"
    document.body.appendChild(msg);

    /* Spawn cookies on page */
    doStuffToDOM(spawnCookies, [count]);
}

function hideCookieVisualization() {
    try {
        msg = document.getElementById('cookie_vis_msg');
        msg.innerHTML = "Cleared cookie visualization :P"
    }
    catch {
        console.log("No message yet")
    }
    /* Remove spawned cookies from view */
    doStuffToDOM(clearSpawnedCookies);
}

document.addEventListener('DOMContentLoaded', function () {
    /* count the cookies on the page */
    loadCookies();

    /* button interactions */
    let cookieButton = document.getElementById('see-cookies');
    cookieButton.addEventListener('click', visualizeCookies)

    let hideCookieButton = document.getElementById('hide-cookies');
    hideCookieButton.addEventListener('click', hideCookieVisualization);

    /* update the data values in the popup */
    let cookie_count = document.getElementById('cookies_count');
    setTimeout(() => {
        cookie_count.innerHTML = count.toString()
    }, 20);

    var domain_count = document.getElementById('domains_count');
    setTimeout(() => {
        domain_count.innerHTML = num_domains.toString()
    }, 20);

})