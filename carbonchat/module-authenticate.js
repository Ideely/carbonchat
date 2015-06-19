/*
 * The print module, lets make this work for the thermal printer that we bought.
 * */

var q = require('q');
var Firebase = require('firebase');
var firebaseRef;
var fs = requite('fs');
var authFilePath;

//The initialization of our firebase object.
//Will perform authentication, get message root directory
exports.init = function init(firebaseObj){
    authFilePath = "authInformation.json";
	firebaseRef = firebaseObj;					//Set the firebase reference
}

//This is our authentication function
exports.authenticate = function authenticate() {
    var deferred = q.defer();
    var authCredentials;
    var error;

    try {
        getCredentials.then(function(authCredentials){
			if(firebaseRef != null){
				ref.authWithPassword({
					email: authCredentials.carbonchat.email,
					password: authCredentials.carbonchat.email 
				}, function(error, authData){
					if(error){ deferred.reject(error); }
					else {
						deferred.resolve(firebaseRef);
					}
				});
			}else{
				throw "firebase reference undefined";
			}
		});        //Get login credentials 

    } catch (err) {
        error = err.message;
        return deferred.reject(error);
    }

    return deferred.promise();
}

//This will open the credentials file and will get the json object that will represent out auth info
exports.getCredentials = function getCredentials(){
    var deferred = q.defer();
    var credentials;

    //gotta check that the file exists
    try {
        if (fs.exists(authFilePath, function(exists) {
            fs.readFile(authFilePath, function(err, read){});
				if(err){
					deferred.reject(err);
				}
				
				deferred.resolve(read);			//Send back the completed promise to show that we resolved correctly
        } else {
            throw "Authentication credential file does not exist";
        }
    } catch (err) {
        deferred.reject(err.message);
    }   

    return deferred.promise();
}