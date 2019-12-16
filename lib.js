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
        console.log(data)
        donefunc(data);
    })

}

function preparePath(key, args) {
    switch (key) {
        case "authenticate":
            return config[key]
            break
        case "accountinfo":
            //return config[key] 
            return config[key] + "/" + args[0]
            break
      }
}

function logIn(username, password) {
    user={"username": username, "password": password}
    callApi("POST", preparePath("authenticate"), user, setCookies, false)
}

function isLoggedIn() {
    var session = getCookies()
    if (typeof session["X-Booked-SessionToken"] == "undefined" || typeof session["X-Booked-UserId"] == "undefined")  {
        
        /*displaying a login form*/
        var element = document.getElementById('main')
        var loginForm = '<form id="login" action="index.html"><input type="text" placeholder="user" id="user"><br><input type="password" placeholder="password" id="password"><br><input type="submit"></form>'
        element.insertAdjacentHTML('afterbegin', loginForm)
        $( "#login" ).submit(function( event ) {
          logIn(document.getElementById('user').value, document.getElementById('password').value)
          event.preventDefault()
        });

        return false
    } else {
        return true
    }
}

function getAndDisplayAccount() {
    var session = getCookies()
    var args = [session["X-Booked-UserId"]]
    return callApi("GET", preparePath("accountinfo", args), null, showAccountInfo, true)
}

function setCookies(session) {
    console.log(session)
    Cookies.set("X-Booked-SessionToken", session.sessionToken)
    Cookies.set("X-Booked-UserId", session.userId)
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
    var element = document.getElementById('main')
    element.insertAdjacentHTML('afterbegin', "<p>Great! You're logged in as "
                                            + user.firstName
                                            + " "
                                            + user.lastName
                                            + "</p>")
}