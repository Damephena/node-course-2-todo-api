const request = require('supertest');
const expect = require('expect');
//Mocha and Nodemon do not need to be required

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
//to empty DB before every request
beforeEach((done) => {
	Todo.remove({}).then(() => done());
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
				Todo.find().then((todos) =>{
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done(); //wrapping up test case
				}).catch((e) => done(e)); //catch overall error
			});
	});

	it('should not create todo with invalid body data', (done) => {
		var text = [];
		request(app)
			.post('/todos')
			.send({text})
			.expect(400)
			.end((err, res) => {
				if (err){
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(0);
					done();
				}).catch((e) => done(e));
			});
	});
});