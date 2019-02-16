const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');
//Mocha and Nodemon do not need to be required

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
//add seed data(dummy todos)
const todos = [{
	_id: new ObjectID(),
	text: 'First test todo'
}, {
	_id: new ObjectID(),
	text: 'Second test todo',
	completed: true,
	completedAt: 123
}];

//to empty DB before each request
beforeEach((done) => {
	Todo.deleteMany({}).then(() => {
		return Todo.insertMany(todos);	
	}).then(() => done());
});

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = "Test text";

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				//to check DB
				Todo.find({text}).then((todos) =>{
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done(); //wrapping up test case
				}).catch((e) => done(e)); //catch overall error
			});
	});

	it('should not create todo with invalid body data', (done) => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err){
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch((e) => done(e));
			});
	});
});

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done); //this is not asynchronous, hence, no callback used.
	});
});

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)//toHexString() convert objectID to a string to be passed into URL
		.expect(200)
		.expect((res) => {
			expect((res.body.todo.text)).toBe(todos[0].text);
		})
		.end(done);
	});

	it('should return a 404 if todo not found', (done) => {
		//make sure you get 400 back
		var hexId = new ObjectID().toHexString();

		request(app)
		//.get(`/todos/5c4dfb2821aa3d1410cd125c`)
		.get(`/todos/${hexId}`)
		.expect(404)
		.end(done);
	})

	it('should return 404 for non-object IDs', (done) => {
		// /todos/123
		request(app)
		.get('/todos/123')
		.expect(404)
		// .expect((res) => {
		// 	expect(res.body.text).toNotBe(ObjectID());
		// })
		.end(done);
	})
});

describe('DELETE /todos/:id', () => {
	it('should remove a todo', (done) => {
		var hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				//Query database to be sure
				Todo.findById(hexId).then((todo) => {
					expect(todo).toNotExist();
					done();
				}).catch((e) => done(e));
				});
	});

	it('should return 404 if todo not found', (done) => {
		var hexId = new ObjectID().toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(404)
			.end(done);
	});

	it('shouldreturn 404 if object id is invalid', (done) => {
		request(app)
			.delete(`/todos/123`)
			.expect(404)
			.end(done);
	});
});

describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
		var hexId = todos[0]._id.toHexString();
		var text = "testing 123..";
		var completed = true;
		
		request(app)
			.patch(`/todos/${hexId}`)
			.send({text, completed})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(true);
				expect(res.body.todo.completedAt).toBeA('number');
			})
			.end(done);
	});

	it('should clear completedAt when todo is not completed', (done) => {
		var hexId = todos[1]._id.toHexString();
		var text = 'changed';
		var completed = false;

		request(app)
			.patch(`/todos/${hexId}`)
			.send({text, completed})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toNotExist();
			})
			.end(done);
	});
});