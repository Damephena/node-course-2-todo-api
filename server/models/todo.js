var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true //removes whitespaces.
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	}
});

module.exports = {Todo};
//creating a brand new Todo
// var newTodo = new Todo({
// 	text: 'Cook dinner',
// });
//to update MongoDB 
// newTodo.save().then((doc) => {
// 	console.log('Saved Todo', doc);
// }, (e) => {
// 	console.log('Unable to save todo', e);
// });