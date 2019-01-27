var mongoose = require('mongoose');

//tell mongoose to use in-built promise
mongoose.Promise = global.Promise;
//connect to db
let db = {
	localhost: 'mongodb://localhost:27017/TodoApp',
	mlab: 'mongodb://damephena:Le@rning1@ds213665.mlab.com:13665/node-todo-api'
}

mongoose.connect(db.localhost || db.mlab,{useNewUrlParser: true});

module.exports = {mongoose};