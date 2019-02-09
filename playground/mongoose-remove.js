const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//Todo.remove() to remove multiple. Todo.remove({}) removes all documents 
// Todo.remove({}).then((result) => {
// 	console.log(JSON.stringify(result, undefined, 2));
// });

//Todo.findOneAndRemove() returns the removed document, to do something with it
Todo.findOneAndDelete("5c520fd0e1fd6fb3107b6f50").then((doc) => {
	console.log(JSON.stringify(doc, undefined, 2));
}).catch((e) => {
	console.log(JSON.stringify(e, undefined, 2));
});

//Todo.findByIdAndRemove() as the name
// Todo.findByIdAndDelete("5c520fd0e1fd6fb3107b6f50").then((doc) => {
// 	console.log(JSON.stringify(doc, undefined, 2));
// }).catch((e) => {
// 	console.log(JSON.stringify(e, undefined, 2));
// });