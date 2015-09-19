var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');

var app = express();

// connect to Mongodb using mongosoe
mongoose.connect(config.database, function(err) {
	if(err) {
		console.log("NOT CONNECTED TO DB " + err);
	} 
	else {
		console.log("connected to db");
	}
});
// use the dependencies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// renders public files
app.use(express.static(__dirname + 'public'));

//call api && use it
var api = require('./app/routes/api')(app, express);
app.use('/api', api);

app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/views/index.html');
});

// connect to server
app.listen(config.port, function(err) {
	if(err) {
		console.log(err);
	}
	else {
		console.log('Listening on port ' + config.port);
	}
});