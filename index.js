var cool = require("cool-ascii-faces");
var express = require("express");
var app = express();
var port = 10000;

app.get("/cool",(request,response) => {
	
	response.send(cool());
	console.log("New Request to /cool has arrived");
	
});

app.listen(port,() => {  
	
	console.log("Server ready listening on port " + port );
	
});