/*
    This is the service that controlls the behavior when attempting to write to the firebase. Hopefully,
    all firebase transactions will go through here execpt for authentication, but maybe we can integrate
    with that soon.
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.service('firebaseService', function ($http, $q, $firebaseObject) {
        var q = $q;
        var firebaseLocation = "https://carbonchat.firebaseio.com/";		
		var fireRef;
		var fireRefObj;				//Need to understand how this is different from the fireRef
		
		//This function will initialize the firebase references and any other objects that we'll need 
		//when we are referencing data from the 
		var init(){
			fireRef = new Firebase(firebaseLocation);		//Create a new object refering to the root of the firebase
		}
		
        var authCarbonChat = function (email, password) {
            //This function will return a promose that will be resolved if the user is authenticated and will
            //be rejected with a message indicating why,
            var deferred = q.defer();

            console.log('trying to authenticate');
			
			//Always check to ensure that fireRef is defined
			if(fireRef == null){
				init();
			}
			
            fireRef.authWithPassword({
                "email": email,
                "password": password
            }, function (error, authData) {
                if (error) {
                    console.log("Login Failed!", error);

                    if (error.message.indexOf("not exist") > -1) {
                        console.log("need to create a user");

                        createUser(fireRef, email, password).then(function (error, authData) {
                            if (error) {
                                deferred.reject(error);
                            } else {
                                deferred.resolve(authData);
                            }
                        });
                    } else {
                        authCredentials = null;
                        deferred.reject(error);
                    }
                } else {
                    console.log("Authenticated successfully with payload:");//, authData);

                    //authCredentials = authData;
                    deferred.resolve(authData);
                }
            });

            return deferred.promise;

        }       //this will attempt to authenticate the user via the carbonchat authwithpassword 

        var createUser = function (email, password) {
            //This function will return a promise that will be resolved with the UID of the new user or rejected with an error code.

            var deferred = q.defer();

			//Always check to ensure that the firebase reference isn't null
			if(fireRef == null){
				init();
			}
			
            fireRef.createUser({
                email: email,
                password: password
            }, function (error, userData) {
                if (error) {
                    switch (error.code) {
                        case "EMAIL_TAKEN":
                            console.log("The new user account cannot be created because the email is already in use.");
                            break;
                        case "INVALID_EMAIL":
                            console.log("The specified email is not a valid email.");
                            break;
                        default:
                            console.log("Error creating user:", error);
                    }

                    deferred.reject(error.code);
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);

                    createUserInTable(fireRef, userData.uid, email).then(function () { deferred.resolve(userData.uid); });
                }
            });

            return deferred.promise;

        }           //This will attempt to create a new user with the following email and password
        var createUserInTable = function (userId, email) {
			
			//Always check to ensure that fireRef isn't null
			if(fireRef == null){
				init();
			}
			
            var saveFireRef = fireRef.child("app_data").child("users");
            var deferred = q.defer();

            console.log("setting data in table");
            saveFireRef.child(userId).set({
                userId: userId,
                email: email
            });

            deferred.resolve("success");
            return deferred.promise;
        }      //Creates the user in our table where we can store user information

        var getUserInformation = function (userId) {
			//This will read the information about the user from the firebase table
            var deferred = q.defer();
			
			//Always check to ensure that the firebase reference isn't null
			if(fireRef == null){
				init();
			}
			
            var obj = $firebaseObject(fireRef.child("app_data").child("users").child(userId));

            obj.$loaded().then(function () {
                if (err) {
                    deferred.reject(err);
                }
                deferred.resolve(obj);
            });

            return deferred.promise;
        }            //Returns a promise that will be resolved with the information in the user's table

        var writeData = function (pathList, object) {
			//This will write data to the path specified as a list of nodes
            var deferred = q.defer();
			
			//Always check to ensure that fireRef isn't null
			if(fireRef == null){
				init();
			}
			
			var firebaseRefToSave = fireRef;
			
			angular.forEach(pathList, function (value, key) {
				firebaseRefToSave = firebaseRefToSave.child(value);		//Iterate through each node and go to it in the reference
			});

            fireRef.set(object);

            deferred.resolve("success");
            return deferred.promise();
        }                     //Saves data to the firebaseRef

        var createListener = function (path) {
            
        }
        var readDataOnce = function (path) {
			//This will read the information about the user from the firebase table
            var deferred = q.defer();
			var firebaseRefToRead;
			
			//Always check to ensure that the firebase reference isn't null
			if(fireRef == null){
				init();
			}
			
			angular.forEach(pathList, function (value, key) {
				firebaseRefToRead = firebaseRefToSave.child(value);		//Iterate through each node and go to it in the reference
			});
			
            var obj = $firebaseObject(firebaseRefToRead);

            obj.$loaded().then(function () {
                if (err) {
                    deferred.reject(err);
                }
                deferred.resolve(obj);
            });

            return deferred.promise;
        }

		var gotNewMessage = function(userId){
			//This will return a promise that will be resolved whenever we get a new message		
			var deferred = q.defer();
			fireRef.child("app_data").child("users").child("messages").on("child_added", function(data){
				return deferred.resolved(data);
			});
			
			return deferred.promise;
		}
		
        return {
            authCarbonChat: authCarbonChat,
            createUser: createUser,

            getCredentials: getCredentials,
            getUserInformation: getUserInformation,

            writeData: writeData,

            createListener: createListener,
            readDataOnce: readDataOnce,
			gotNewMessage: gotNewMessage
        }
    });

})();