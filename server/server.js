require('./config/config');

const _ = require('lodash'); //Added for Patch method
//EXPRESS ROUTE HANDLERS
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

//To make it Heroku ready
const port = process.env.PORT;

//middleware
app.use(bodyParser.json());

//Create resource in JSON
app.post('/todos', authenticate, (req, res) => {
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});

	todo.save().then((doc) => {
		res.send(doc);
	}).catch((e) => {
		res.status(400).send(e);
	});
});

// // //Read resource
app.get('/todos', authenticate, (req, res) => {
	
	Todo.find({
		_creator: req.user._id
	}).then((todos) => {
		res.send({todos});
	}).catch((e) => {
		res.status(400).send(e);
	});
});

app.get('/todos/:id', authenticate, (req, res) => {
	
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	};

	Todo.findOne({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
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

app.delete('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;
	// validate id
	if(!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findOneAndDelete({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
		return res.status(400).send();
	});
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

	Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set:body}, {new:true}).then((todo) => {
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
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(JSON.stringify(e, undefined, 2));
	});
});

// Private route
app.get('/users/me', authenticate, (req, res) => {
	var token = req.header('x-auth');

	User.findByToken(token).then((user) => {
		if(!user){
			return Promise.reject();
		}

		res.send(user);
	}).catch((e) => {
		res.status(401).send();
	});
});

//POST /users/login
app.post('/users/login', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		})
	}).catch((e) => {
		res.status(400).send();
	});
});

app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}).catch((e) => {
		res.status(400).send();
	});
}); 

app.listen(port, () => {
	console.log(`Started up at port ${port}`);
});

module.exports = {app};