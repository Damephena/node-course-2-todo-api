var mongoose = require('mongoose');

//tell mongoose to use in-built promise
mongoose.Promise = global.Promise;
//connect to db
let db = {
	localhost: 'mongodb://localhost:27017/TodoApp',
	mlab: 'mongodb://damephena:Learning1@ds213665.mlab.com:13665/node-todo-api'
};

mongoose.connect(process.env.MONGODB_URI || db.localhost, { useNewUrlParser: true});
//mongoose.connect(db.localhost || db.mlab, { useNewUrlParser: true });
//process.env.PORT
module.exports = {mongoose};