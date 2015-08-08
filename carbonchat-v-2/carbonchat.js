var mongoose = require('mongoose');



//Let's connect to that database.
mongoose.connect('');			//TODO Need to provide connection information
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(callback){
	//Looks like we've opened the db
});