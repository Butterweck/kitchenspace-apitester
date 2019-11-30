function callApi(method) {
    
    console.log(config.base_url)

    var request = new XMLHttpRequest()

    request.open(method, config.base_url, true)

    request.onload = function() {
        var data = JSON.parse(this.response)
        console.log(data)
    }

    // Send request
    request.send()
}

function logIn(method) {

}

function isUserLoggedIn() {
    var sessionToken = Cookies.get("X-Booked-SessionToken");
    var userId = Cookies.get("X-Booked-UserId");
    if (typeof sessionToken == "undefined" || typeof userId == "undefined")  {
        return false
    } else {
        return true
        //TODO call isAuthenticated endpoint
    }
    
}

function setCookies(sessionToken, userId) {
    Cookies.set("X-Booked-SessionToken", sessionToken);
    Cookies.set("X-Booked-UserId", userId);
}