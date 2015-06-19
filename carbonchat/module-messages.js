/*
 * The print module, lets make this work for the thermal printer that we bought.
 * */

var q = require('q');
var Firebase = require('firebase');
var fs = requite('fs');
var authFilePath;

//The initialization of our firebase object.
//Will perform authentication, get message root directory
exports.init = function init(){
    authFilePath = "authInformation.json";
}

//This is our authentication function
exports.authenticate = function authenticate() {
    var deferred = q.defer();
    var authCredentials;
    var error;

    try {
        authCredentials = getCredentials.then();        //Get login credentials 

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
    //NEED TO FINISH
    try {
        if (fs.exists(authFilePath, function(exists) {
            fs.read
        } else {
            throw "Authentication credential file does not exist";
        }
        deferred.resolve(credentials)
    } catch (err) {
        deferred.reject(err.message);
    }   

    return deferred.promise();
}