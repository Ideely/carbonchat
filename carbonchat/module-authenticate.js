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
        var error;
        var deviceId;                       //The unique Id of the devicre
        var ownerId;                        //The userId of the owner of the device

        try {

            getDeviceInformation().then(function (deviceInformation) {

                deviceId = deviceInformation;
                
                firebaseRef.child('/devices/' + deviceId + '/');

                //get userId of the owner
                firebaseRef.once('value', function (snapshot) {
                    ownerId = snapshot.userId;

                    //set the new firebaseRef, which is to the user's account
                    firebaseRef.parent().parent().child('/users/' + ownerId);

                    q.resovle(firebaseRef);
                });

            });

        } catch (err) {
            error = err.message;
            return deferred.reject(error);
        }
        
        return deferred.promise;
    }   //This is our authentication function
       
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