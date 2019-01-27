const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = "5c485c988e476f1660421d4a";
var userId = "5c4549ec1e9a6015f4f65db4";
 //ID Validation
if(!ObjectID.isValid(id)){
	console.log('ID not valid');
}

// Todo.find({_id:id}).then((todos) => {
// 	console.log('Todos', todos);
// }, (e) => {
// 	console.log(JSON.stringify(e, undefined, 2));
// });

// Todo.findOne({_id:id}).then((todo) => {
// 	console.log('Todo', todo);
// }, (e) => {
// 	console.log(JSON.stringify(e, undefined, 2));
// });

Todo.findById(id).then((todo) => {
	if (!todo){
		return console.log('Id not found');
	}
	console.log('Todo by ID', todo);
}, (e) => {
	console.log(JSON.stringify(e, undefined, 2));
});

// //User
// User.findById(userId).then((user) => {
// 	if (!user) {
// 		return console.log('User not found!');
// 	}
// 	console.log('User: ', user);
// }, (e) => {
// 	console.log(JSON.stringify(e, undefined, 2));
// })