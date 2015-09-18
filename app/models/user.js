var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

// 1. create a user schema with properties name, username, password
var UserSchema = new Schema({
	username: {type: String, required: true, index: {unique: true}},
	password: {type: String, required: true, select: false}
});

// 2. Hash the user password
UserSchema.pre('save', function(next) {

	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.has(user.password, null, null, function(err, hash) {
		if(err) return next(err);

		user.password = hash;
		next();
	});
});

// export the api
module.exports = mongoose.model('User', UserSchema);