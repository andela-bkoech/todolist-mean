var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var http = require('http');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));
var port = config.port;
var host = config.host;

var server = http.createServer(function(req, res) {
	res.writeHead(200, {"Content-Type" : "text/plain"});
	res.end(config.Author);
}); 

server.listen(port, host, function() {
	console.log("Listening to port 3000 .....");
});