const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
	_id: userOneId,
	email: 'ifenna@example.com',
	password: 'apassword',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
	}]
}, {

	_id: userTwoId,
	email: 'enn@example.com',
	password: 'apassword',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
	}]
	
}];

//add seed data(dummy todos)
const todos = [{
	_id: new ObjectID(),
	text: 'First test todo',
	_creator: userOneId
}, {
	_id: new ObjectID(),
	text: 'Second test todo',
	completed: true,
	completedAt: 123,
	_creator: userTwoId
}];

//to empty DB before each request
const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
};

const populateUsers = (done) => {
	User.remove({}).then(() => {
		//to save HASHED users in other to pass server.test.js
		//by calling save, we're going to run the middleware.
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		//waits for all save actions to complete
		return Promise.all([userOne, userTwo])
	}).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};