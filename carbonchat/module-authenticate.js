/*
 * The authentication module, which will authenticate the user with the firebase server from an authentication.json file
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

//This will open the credentials file and will get the json object that will represent our auth info
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

//This will open the authentication file and will get the json object that will represent our device information
exports.getDeviceInformation = function getDeviceInformation() {
    var deferred = q.defer();
    var deviceInformation;
    
    //gotta check that the file exists
    try {
        
        existFileDefer = q.defer();                              //create a defer object that will resolve when if the file exists
        readFileDefer = q.defer();                               //create a deefer object that will resolve after reading the file contents
        fs.exists(authFilePath, existFileDefer.resolve());       

        existFileDefer.promise.then(function (exists) {
            if (!exists) {
                throw "authentication file doesn't exist";
            } else {
                fs.readFile(authFilePath, readFileDefer.resolve(read));
            }
        });
        readFileDefer.promise.then(function (read) {
            if (!read) {
                throw "couldn't read authentication file";
            } else {
                deferred.resolve(read.deviceInformation);			//Send back the completed promise to show that we resolved correctly
            }
        });
    } catch (err) {
        deferred.reject(err.message);
    }
    
    return deferred.promise();
}



