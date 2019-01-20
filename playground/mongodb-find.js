// const MongoClient = require('mongodb').MongoClient;
//INTRODUCING DESTRUCTURING
const {MongoClient, ObjectID} = require('mongodb');

//collects arguments URL and callback function
MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true}, (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');
	const db = client.db('TodoApp'); //To get ACCESS to a database reference(which is TodoApp)

	// db.collection('Todos').find({
	// 	_id: ObjectID('5c444ea9e1c98813f809b8c5')
	// }).toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// }); 
	//Find() returns a MongoDB cursor which could contain tons of data. Cursors are pointers, hence, have METHODS which can be called
	//These methods(eg toArray()) also returns PROMISES
	// client.close();

	// db.collection('Todos').find().count().then((count)=> {
	// 	console.log(`Todos count: ${count}`);
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// }); 

	db.collection('Users').find({name: 'Ifenna'}).count().then((count) =>{
		console.log(`Total count: ${count}`);
	}, (err) => {
		console.log('Could not find name');
	});
});