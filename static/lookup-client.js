// Lookup Client - code to access the dns-lookup server

var dbStatus = undefined ;

window.onload = function () {
    var resolveButton = document.getElementById("resolveButton") ;
    resolveButton.onclick = resolveHost ;
}

function displayIP(IP) {
    if (! IP) { IP = "Unable to resolve hostname." }
    
    var ipTD = document.getElementById("ipTD") ;
    if (ipTD.hasChildNodes()) {
        ipTD.replaceChild(document.createTextNode(IP), ipTD.firstChild) ;
    } else {
        ipTD.appendChild(document.createTextNode(IP)) ;
    }
}

function resolveHost() {
    var hostnameInput = document.getElementById("hostname") ;
    var hostname = hostnameInput.value ;
    if ("" == hostname) { alert("hostname empty") ; }
    else {
        var url = document.baseURI + "json/resolve" + "?host=" + hostname ;
        console.log("resolveHost called on hostname: " + hostname) ;

        var request = new XMLHttpRequest() ;
        request.onload = function () {
            if (200 == request.status) {
                q = JSON.parse(request.responseText) ;
                displayIP(q) ;
            }
            else {
                alert("Server failed.") ;
            }
        } ;
        request.open("GET", url) ;
        request.send(null) ;
    }
}
