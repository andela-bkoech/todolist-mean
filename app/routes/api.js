var User = require("../models/user");
var Task = require("../models/tasks");

var config = require('../../config');
var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {
	var token = jsonwebtoken.sign({
		id: user._id,
		username: user.username
	}, secretKey, {expiresInMinute: 1440});

	return token;
};

module.exports = function(app, express) {
	var api = express.Router();


	// signup api
	api.post('/signup', function(req, res) {
		// create a user object
		var user = new User({
			username: req.body.username,
			password: req.body.password
		});

		// save the user
		user.save(function(err) {
			if(err) {
				res.send(err);
				return;
			}

			res.json({message: 'User has been created'});
		});
	});

	// get users api
	api.get('/users', function(req, res) {

		User.find({}, function(err, users) {
			if(err) {
				res.send(err);
				return;
			}

			res.json(users);
		});
	});

	// login api
	api.post('/login', function(req, res) {
		User.findOne({
			username: req.body.username
		}).select('password').exec(function(err, user) {
			if(err) throw err;

			if(!user) {
				res.send({message: "User doesn't exist"});
			}
			else if(user) {
				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword) {
					res.send({message: "Invalid password"});
				}
				else {

					// create a token for user auth
					var token = createToken(user);
					console.log("I am valid");
					res.json({
						success: true,
						message: "Successfully login",
						token: token
					});
				}
			}
		});
	});

	//Middleware to allow one to pass to destination B
	api.use(function(res, req, next) {

		console.log("Somebody just to our app");

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		//check if token exists
		if(token) {
			jsonwebtoken.verify(token, secretKey, function(err, decoded) {

				if(err) {
					res.status(403).send({success: false, message: "Failed to authenticate users"});
				}
				else {
					req.decoded = decoded;
					next();
				}
			});
		}
		else {
			res.status(403).send({success: false, message: "No token provided"});
		}
	});	

	//Destination B || provide a legitimate token
	// create a home api 
	api.route('/')
		.post(function(req, res) {

			//create a task
			var task = new Task({
				creator: req.decoded.id,
				taskTitle: req.body.tasktitle,
				taskDescription: req.body.taskdescription,
				dueDate: req.body.duedate
			});
			// save the task
			task.save(function(err) {
				if(err) {
					res.send(err);
					return;
				}

				res.json({message: "New Task has been added"});
			});

		})

		.get(function(req, res) {

			Task.find({creator: req.decoded.id }, function(err, tasks) {
				if(err) {
					res.send(err);
					return;
				}

				res.json(tasks);
			});
		});


		api.get('/me', function(req, res) {
			res.json(req.decoded);
		});
	return api;

};