var mongoose = require('mongoose');

//tell mongoose to use in-built promise
mongoose.Promise = global.Promise;
//connect to db
mongoose.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser: true});

module.exports = {mongoose};