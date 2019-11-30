function callApi(callMethod, callUrl, sendData, donefunc, sendHeader) {

    baseUrl = config["base_url"]
    fullUrl = baseUrl + callUrl

    var settings = {
        url: fullUrl,
        type: callMethod,
    }
    if (sendHeader) {
        settings["headers"] = getCookies();
    }
    if (callMethod == "POST") {
        settings["data"] = JSON.stringify(sendData)
    }

    $.ajax(settings).done(function(data) {
        donefunc(data)
    })

}

function logIn(username, password) {
    user={"username": username, "password": password}
    callApi("POST", config["authenticate"], user, setCookies, false)
}

function displayUser() {
    var session = getCookies()
    if (typeof session["X-Booked-SessionToken"] == "undefined" || typeof session["X-Booked-UserId"] == "undefined")  {
        return false
    } else {
        callUrl = config["accountinfo"] + "/" + session["X-Booked-UserId"]
        callApi("GET", callUrl, null, showAccountInfo, true)
    }
    
}

function setCookies(session) {
    Cookies.set("X-Booked-SessionToken", session.sessionToken);
    Cookies.set("X-Booked-UserId", session.userId);
    location.reload()
}

function getCookies() {
    var sessionToken = Cookies.get("X-Booked-SessionToken");
    var userId = Cookies.get("X-Booked-UserId");
    if (typeof sessionToken != undefined && typeof userId != undefined) {
        return { "X-Booked-SessionToken": sessionToken, "X-Booked-UserId": userId }
    } else {
        return null
    }
    
}

function showAccountInfo(user) {
    return user
}