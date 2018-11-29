// Accept Client - code to access the cs-accept server

var dbStatus = undefined ;

window.onload = function () {
    getDBstatus() ;
}

function getDBstatus() {
    var url = document.baseURI + "json/dbstatus" ;
    console.log("URL: " + url) ;
    var request = new XMLHttpRequest() ;
    request.onload = function () {
        if (200 == request.status) {
            q = JSON.parse(request.responseText) ;
            dbStatus = q.dbStatus ;
            displayDBstatus() ;
            getCurrentData() ;
        }
    } ;
    request.open("GET", url) ;
    request.send(null) ;
}

function displayDBstatus() {
    var span = document.getElementById("dbstatus") ;
    span.innerHTML = dbStatus ;
}

function getCurrentData() {
    if (dbStatus) {
        var url = document.baseURI + "json/read?table=SampleData" ;
        var request = new XMLHttpRequest() ;
        request.onload = function () {
            if (200 == request.status) {
                console.log("Got data: " + JSON.stringify(request.response)) ;
                displayDBdata(JSON.parse(request.responseText)) ;
            } else {
                console.log("Failed to get data from server.") ;
            }
        }
        request.open("GET", url) ;
        request.send(null) ;
    } else {
        console.log("dbStatus not true, not loading data: " + dbStatus) ;
    }
}

function displayDBdata(data) {
    console.log("called on data: " + data) ;
    var item ;
    var dataTable = document.getElementById("dataBody") ;
    for (i = 0 ; i < data.length ; i++) {
        var newTR = document.createElement("TR") ;
        var keyTD = document.createElement("TD") ;
        var valTD = document.createElement("TD") ;
        keyTD.appendChild(document.createTextNode(data[i][0])) ;
        valTD.appendChild(document.createTextNode(data[i][1])) ;
        newTR.appendChild(keyTD) ; newTR.appendChild(valTD) ;
        dataTable.insertBefore(newTR, dataTable.firstChild) ;
    }
}
