//EXPRESS ROUTE HANDLERS
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

//To make it Heroku ready
const port = process.argv.PORT || 3000;

//middleware
app.use(bodyParser.json());

//Create resource in JSON
app.post('/todos', (req, res) => {
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

// // //Read resource
app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos/:id', (req, res) => {
	
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	};

	Todo.findById(id).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}
		// console.log('Todo by ID: ', todo);
		res.status(200).send({todo});
	}, (e) => {
		res.status(400).send();
	});
	

	// // res.send(req.params);
})

app.listen(port, () => {
	console.log(`Started up at port ${port}`);
});

module.exports = {app};