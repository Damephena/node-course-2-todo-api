require('./config/config');

const _ = require('lodash'); //Added for Patch method
//EXPRESS ROUTE HANDLERS
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

//To make it Heroku ready
const port = process.env.PORT;

//middleware
app.use(bodyParser.json());

//Create resource in JSON
app.post('/todos', (req, res) => {
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}).catch((e) => {
		res.status(400).send(e);
	});
});

// // //Read resource
app.get('/todos', (req, res) => {
	
	Todo.find().then((todos) => {
		res.send({todos});
	}).catch((e) => {
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
	}).catch((e) => {
		res.status(400).send();
	});
	

	// // res.send(req.params);
})

app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;
	// validate id
	if(!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findByIdAndDelete(id).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
		return res.status(400).send();
	});
});

app.patch('/todos/:id', (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']); //things users can update

	if(!ObjectID.isValid(id)){
		return res.status(404).send();
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	}else {
		body.completed = false;
		body.completedAt = null;
	};

	Todo.findByIdAndUpdate(id, {$set : body}, {new: true}).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}
		res.status(200).send({todo}) 
	}).catch((e) => {
		res.status(404).send();
	})
});

// POST /users

app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);

	// prefixed header() means custom header
	user.save().then(() => {
		user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(JSON.stringify(e, undefined, 2));
	})
})

app.listen(port, () => {
	console.log(`Started up at port ${port}`);
});

module.exports = {app};