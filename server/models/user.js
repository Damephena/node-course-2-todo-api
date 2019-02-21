const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
	// userName: {
	// 	type: String,
	// 	minlength: 1,
	// 	trim: true
	// },
	email: {
		type: String,
		minlength: 1,
		required: true,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		require: true,
		minlength: 6
	},
	// Tokens is a feature in MongoDB
	tokens: [{
		access: {
			type: String,
			require: true
		}, 
		token: {
			type: String,
			require: true
		}
	}]
});
// .methods is used to create instance methods
//To override sending Tokens and other secure informations back to user
UserSchema.methods.toJSON = function(){
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
};
//to creat User.generateAuthToken as a CUSTOM method.
UserSchema.methods.generateAuthToken = function(){
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString()}, process.env.JWT_SECRET).toString();

	user.tokens = user.tokens.concat([{access, token}]);

	return user.save().then(() => {
		return token;
	});
};

UserSchema.methods.removeToken = function (token) {
	var user = this;

	return user.update({
		// $pull is a MongoDB operator. Removes objects from an array that matches certain criteria
		$pull : {
			tokens: {token}
		}
	});
};

//to create MODEL method, we use statics.
UserSchema.statics.findByToken= function(token){
	var User = this;
	var decoded;

	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch (e) {
		return Promise.reject();
	}

	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	})
}
//Login Model method
UserSchema.statics.findByCredentials = function(email, password) {
	var User = this;

	return User.findOne({email}).then((user) => {
		if (!user){
			return Promise.reject();
		}
		// bcrypt does not support promises but callbacks
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user);
				} else {
					reject(err);
				}
			});
		});
	})
}

// Mongoose middleware
UserSchema.pre('save', function(next) {
	var user = this;

	if (user.isModified('password')){
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});
 
var User = mongoose.model('User', UserSchema);

module.exports = {User};