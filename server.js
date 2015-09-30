//------------------------------------------------------------------------------
// The HTTP server of this application
//------------------------------------------------------------------------------

var url = require("url");
var http = require("http");

function start(route, handle){
	function onRequest(request, response) {
		console.log("Request received.");
		var pathname = url.parse(request.url).pathname;
		console.log("Request for \"" + pathname + "\" received.");
		route(handle, pathname, response, request);
		
		 	  
	}
	
	// This application uses express as its web server
	// for more info, see: http://expressjs.com
	var express = require('express');

	// cfenv provides access to your Cloud Foundry environment
	// for more info, see: https://www.npmjs.com/package/cfenv
	var cfenv = require('cfenv');

	// create a new express server
	var app = express();
	
	// get the app environment from Cloud Foundry
	var appEnv = cfenv.getAppEnv();
	
	app.all('*', onRequest);

	// start server on the specified port and binding host
	app.listen(appEnv.port, function() {

		// print a message when the server starts listening
		console.log("server starting on " + appEnv.url);
	});

	
	//http.createServer(onRequest).listen(8888);	
	//console.log("Server starting on 8888.\n");
}



exports.start = start;