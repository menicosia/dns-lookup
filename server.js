var finalhandler = require('finalhandler') ;
var http = require('http') ;
var serveStatic = require('serve-static') ;
var dns = require('dns') ;
var url = require('url') ;
var port = 8080 ;

if (process.env.VCAP_APP_PORT) { port = process.env.VCAP_APP_PORT ; }
else if (process.env.PORT) { port = process.env.PORT ; }

function lookupHelper(err, addr, family, response) {
    if (err) {
        response.end(JSON.stringify(false)) }
    else {
        response.end(JSON.stringify(addr) + "\n")
    }
}

function doLookup(response, host) {
    console.log("Resolving: " + host) ;
    dns.lookup(host, function (err, addr, family) {
        lookupHelper(err, addr, family, response) ;
    }) ;
}

function dispatchApi(request, response, method, query) {
    switch (method) {
    case "dbstatus":
        if (dbConnectState) {
            doStatus(request, response) ;
        } else {
            data += "I'm sorry, Dave, I can't do that. No connection to database." ;
            response.end(data) ;
        }
        break ;
    case "resolve":
        if ("" != query['host']) {
            console.log("Received request to resolve: " + query['host']) ;
            doLookup(response, query['host']) ;
        } else {
            response.end("ERROR: Usage: /json/resolve?host=name"
                         + " (request: " + request.url + ")") ;
        }
        break ;
    default:
        response.writeHead(404) ;
        response.end(false) ;
    }
}

function requestHandler(request, response) {
    var data = "" ;
    requestParts = url.parse(request.url, true) ;
    rootCall = requestParts["pathname"].split('/')[1] ;
    console.log("Recieved request for: " + rootCall) ;
    switch (rootCall) {
    case "env":
	      if (process.env) {
	          data += "<p>" ;
		        for (v in process.env) {
		            data += v + "=" + process.env[v] + "<br>\n" ;
		        }
		        data += "<br>\n" ;
	      } else {
		        data += "<p> No process env? <br>\n" ;
	      }
	      break ;
    case "json":
        var method = requestParts["pathname"].split('/')[2] ;
        dispatchApi(request, response, method, requestParts["query"]) ;
        return(true) ;
        break ;
	  default:
        data = "" ;
	  }

	  response.end(data + '\n') ;
}

var staticServer = serveStatic("static") ;
var dnsLookups = http.createServer(function(req, res) {
    var done = finalhandler(req, res) ;
    staticServer(req, res, function() { requestHandler(req, res, done) } ) ;
}) ;

dnsLookups.listen(port) ;

console.log("Server up and listening on port: " + port ) ;

