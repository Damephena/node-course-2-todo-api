const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
//To override sending Tokens and other secure informations back to user
UserSchema.methods.toJSON = function(){
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function(){
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString()}, 'abc123').toString();

	user.tokens = user.tokens.concat([{access, token}]);

	user.save().then(() => {
		return token;
	});
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};

//var acct = new User({
// 	name: "Ifenna",
// 	email: "okoyeifenna24@gmail.com"
// })

// acct.save().then((doc) => {
// 	console.log('User account saved!', doc);
// }, (err) => {
// 	console.log('Unable to create account.', JSON.stringify(err, undefined, 2));
// });