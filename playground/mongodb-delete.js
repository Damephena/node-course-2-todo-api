// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

//collects arguments URL and callback function
MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true}, (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');
	const db = client.db('TodoApp'); //To get ACCESS to a database reference(which is TodoApp)

	//deleteMany
	// db.collection('Todos').deleteMany({text: '#100daysOfCode'}).then((result) => {
	// 	console.log(result);
	// });

	//deleteOne
	// db.collection('Todos').deleteOne({text: 'code'}).then((res) =>{
	// 	console.log(res);
	// });

	//findOneAndDelete
	// db.collection('Todos').findOneAndDelete({completed: false}).then((res) => {
	// 	console.log(res);
	// });

	db.collection('Users').deleteMany({name: 'Ifenna'}).then((res) => {
		console.log(JSON.stringify(res, undefined, 2));
	});
	// db.collection('Users').findOneAndDelete({_id: ObjectID("5c4460c1e602f387a0a2387d")}).then((res) => {
	// 	console.log(res);
	// });
	// client.close();
});