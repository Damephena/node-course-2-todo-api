// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

//collects arguments URL and callback function
MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true}, (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');
	const db = client.db('TodoApp'); //To get ACCESS to a database reference(which is TodoApp)

	//findOneAndUpdate(filter, update, options, callback)
	db.collection('Todos').findOneAndUpdate({
		_id: ObjectID("5c44cfe5b815cf3b5d45771d"),
	}, {
		$set: {
			completed: true
		}
	}, {
		returnOriginal: false
	}).then((res) => {console.log(res)});
	
	db.collection('Users').findOneAndUpdate({
		_id: ObjectID("5c445435a566da1894c5e770")
	}, {
		$set :{
			name: 'Ifenna',
			lastName: 'Okoye'
		},
		$inc: {
			age: -2
		}
	}, {returnOriginal: false}).then((res) => {
		console.log(res);
	})
	// client.close();
});