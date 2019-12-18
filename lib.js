function callApi(callMethod, callUrl, sendData, donefunc, sendHeader) {

    baseUrl = config["base_url"]
    fullUrl = baseUrl + callUrl

    var settings = {
        url: fullUrl,
        type: callMethod,
    }
    if (sendHeader) {
        settings["beforeSend"] =  function(request) {
            request.setRequestHeader("X-Booked-SessionToken", getCookies()["X-Booked-SessionToken"]);
            request.setRequestHeader("X-Booked-UserId", getCookies()["X-Booked-UserId"]);
          };
    }
    if (callMethod == "POST") {
        settings["data"] = JSON.stringify(sendData)
    }

    $.ajax(settings).done(function(data) {
        donefunc(data);
    })

}

function preparePath(key, args) {
    switch (key) {
        case "login":
        case "logout":
            return config[key]
            break
        case "accountinfo":
            return config[key] + "/" + args[0]
            break
      }
}

function logIn(username, password) {
    user={"username": username, "password": password}
    callApi("POST", preparePath("login"), user, setCookies, false)
}

function logOut() {
    session=getCookies()
    logoutSession={"sessionToken": session["X-Booked-SessionToken"], "userId": session["X-Booked-UserId"]}
    callApi("POST", preparePath("logout"), logoutSession, deleteCookies, false)
}

function isLoggedIn() {
    var session = getCookies()
    if (typeof session["X-Booked-SessionToken"] == "undefined" || typeof session["X-Booked-UserId"] == "undefined")  {
        return false
    } else {
        return true
    }
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

function setCookies(session) {
    Cookies.set("X-Booked-SessionToken", session.sessionToken)
    Cookies.set("X-Booked-UserId", session.userId)
    location.reload()
}

function deleteCookies(data) {
    Cookies.remove("X-Booked-SessionToken")
    Cookies.remove("X-Booked-UserId")
    location.reload()
}