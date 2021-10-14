var cookie_img;

// function to spawn a cookie
CookieImgObject = function() {
    this.cookie_img = document.createElement("img") ;
    this.cookie_img.setAttribute("src", "../icons/cookie_96.png");
    this.cookie_img.className = "spawned_cookie";
    this.cookie_img.style.top = parseInt( 100 * Math.random() ) + "%" ;
	this.cookie_img.style.left = parseInt( 100 * Math.random() ) + "%" ;
    document.body.appendChild(this.cookie_img) ;
}

function spawnCookies(n) {
    for (var i in n) {
        new CookieImgObject();
    }
}

chrome.runtime.onConnect.addListener(port => {
    console.log('connected ', port);
    alert("got here 1");

    port.onMessage.addListener(request => {
        alert("got here 2");
        if (request.msg == "Spawn cookies") {
            success_msg = document.createElement('p');
            success_msg.innerHTML = "spawning cookies!";
            document.body.appendChild(success_msg);
            let count = request.data
            spawnCookies(count)
        }
    }
)})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request) {
        if (request.msg == "Spawn cookies") {
            let count = request.data
            spawnCookies(count)

            alert("got here 3");
            success_msg = document.createElement('p');
            success_msg.innerHTML = "spawning cookies 2!";
            document.body.appendChild(success_msg);

            sendResponse({ sender: "spawn_cookies.js", data: "Success" }); // This response is sent to the message's sender 
        }
    }
});