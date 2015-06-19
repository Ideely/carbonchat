(function () {
    
    /*
 * The authentication module, which will authenticate the user with the firebase server from an authentication.json file
 * */

var q = require('q');
    var Firebase = require('firebase');
    var firebaseRef;
    var fs = requite('fs');
    var authFilePath;
    
    //The initialization of our firebase object.
    exports.init = function (firebaseObj) {
        authFilePath = "authInformation.json";
        firebaseRef = firebaseObj;					//Set the firebase reference
    }       //Will perform authentication, get message root directory
    exports.authenticate = function () {
        var deferred = q.defer();
        var authCredentials;
        var error;
        
        try {
            firebaseRef = getCredentials.then(login(authCredentials));
        } catch (err) {
            error = err.message;
            return deferred.reject(error);
        }
        
        return deferred.promise;
    }   //This is our authentication function
       
    //The helper functions
    function login(authCredentials) {
        //If the login is successful, then we will return the firebase reference that has the credentials (I think that's how it works)
        var deferred = q.defer();

        if (firebaseRef != null) {
            ref.authWithPassword({
                email: authCredentials.carbonchat.email,
                password: authCredentials.carbonchat.email
            }, function (error, authData) {
                if (error) { deferred.reject(error); }
                else {
                    deferred.resolve(firebaseRef);
                }
            });
        } else {
            throw "firebase reference undefined";
        }

        return deferred.promise;


    }          //Given a set of credentials, will log the user into the system
    function getCredentials() {
        var deferred = q.defer();
        var credentials;
        
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
                    deferred.resolve(JSON.parse(read).authenticationInformation);			//Send back the completed promise to show that we resolved correctly
                }
            });
        } catch (err) {
            deferred.reject(err.message);
        }
        
        return deferred.promise;
    }                 //This will open the credentials file and will get the json object that will represent our auth info
    function getDeviceInformation() {
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
                    deferred.resolve(JSON.parse(read).deviceInformation);			//Send back the completed promise to show that we resolved correctly
                }
            });
        } catch (err) {
            deferred.reject(err.message);
        }
        
        return deferred.promise;
    }           //This will open the authentication file and will get the json object that will represent our device information

})();