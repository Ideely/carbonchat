(function () {
    
    /*
     * The authentication module, which will authenticate the user with the firebase server from an authentication.json file
     * */

    var q = require('q');
    var Firebase = require('firebase');
    var firebaseRef;
    var fs = require('fs');
    var path = require('path');
    var authFilePath;
    
    //The initialization of our firebase object.
    exports.init = function (firebaseObj) {
        authFilePath = "./authInformation.json";
        firebaseRef = firebaseObj;					//Set the firebase reference
    }       //Will perform authentication, get message root directory

    exports.authenticate = function () {
        var deferred = q.defer();
        var error;
        var deviceId;                       //The unique Id of the devicre
        var ownerId;                        //The userId of the owner of the device
        
        console.log('Module-authenticate.js: Authenticate function: entered');

        try {

            getDeviceInformation().then(function (deviceInformation) {
                
                console.log('Module-authenticate.js: authenticate : got device information');
                console.log(deviceInformation);

                deviceId = deviceInformation;
                
                firebaseRef = firebaseRef.child('app_data/devices/' + deviceId);
                
                console.log(firebaseRef.toString());

                //get userId of the owner
                firebaseRef.once('value', function (snapshot) {
                    deferred.resolve(
                        snapshot.val().owner
                    );
                });
            });

        } catch (err) {
            console.log('module-authenticate: error before return');
            console.log(err);
            error = err.message;
            deferred.reject(error);
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
            
            try {
                fs.stat(path.resolve(__dirname, authFilePath), function (err, stats) {
                    if (!err)
                        existFileDefer.resolve(stats);
                    else
                        existFileDefer.reject(err);
                });
            } catch (ex) {
                console.log('Got an error reading the file');
                console.log(ex);
            }
           
            existFileDefer.promise.then(function (stats) {
                if (!stats) {
                    console.log('Module-authenticate.js: getDevice Information : seeing if file exists');
                    console.log("authentication file doesn't exist");
                    throw "authentication file doesn't exist";
                } else {
                    fs.readFile(path.resolve(__dirname, authFilePath), 'utf8', function (err, data) {
                        if (!err)
                            readFileDefer.resolve(data);
                        else
                            readFileDefer.reject(err);
                    });
                }
            }, function (error) {
                console.log('Module-authenticate.js: getDevice Information : seeing if file exists');
                console.log('Module-authenticate.js: getDevice Information : exception thrown');
                console.log(error);
            });
            readFileDefer.promise.then(function (read) {
                if (!read) {
                    console.log('Module-authenticate.js: getDevice Information : did not get device information');
                    console.log("couldn't read authentication file");
                    throw "couldn't read authentication file";
                } else {
                    read = read.substring(1, read.length);                                      //Removes first character, which is BOM (determines endiness)
                    console.log(read);
                    console.log(JSON.parse(read).deviceInformation.deviceSerial);
                    deferred.resolve(JSON.parse(read).deviceInformation.deviceSerial);			//Send back the completed promise to show that we resolved correctly
                }
            }, function (err) {
                console.log('Module-authenticate.js: getDevice Information : did not get device information');
                console.log('Module-authenticate.js: getDevice Information : error thrown');
                console.log(err);
            });
        } catch (err) {
            deferred.reject(err.message);
        }
        
        return deferred.promise;
    }           //This will open the authentication file and will get the json object that will represent our device information

})();