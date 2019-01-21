const mongoose = require('mongoose');

var User = mongoose.model('User', {
	userName: {
		type: String,
		minlength: 1,
		trim: true
	},
	email: {
		type: String,
		minlength: 1,
		required: true,
		trim: true
	}
});

module.exports ={User};

//var acct = new User({
// 	name: "Ifenna",
// 	email: "okoyeifenna24@gmail.com"
// })

// acct.save().then((doc) => {
// 	console.log('User account saved!', doc);
// }, (err) => {
// 	console.log('Unable to create account.', JSON.stringify(err, undefined, 2));
// });