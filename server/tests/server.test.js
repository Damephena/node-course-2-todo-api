const request = require('supertest');
const expect = require('expect');
//Mocha and Nodemon do not need to be required

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
//add seed data(dummy todos)
const todos = [{
	text: 'First test todo'
}, {
	text: 'Second test todo'
}];

// //to empty DB before every request
// beforeEach((done) => {
// 	Todo.remove({}).then(() => done());
// });

//to empty DB before each request
beforeEach((done) => {
	Todo.remove({}).then(() => {
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
			//.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done); //this is not asynchronous, hence, no callback used.
	});
});