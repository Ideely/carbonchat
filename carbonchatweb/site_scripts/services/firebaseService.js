/*
    This is the service that controlls the behavior when attempting to write to the firebase. Hopefully,
    all firebase transactions will go through here execpt for authentication, but maybe we can integrate
    with that soon.
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.service('firebaseService', function ($http, $q, $firebaseObject, $firebaseArray) {
        var q = $q;

        var firebaseLocation = "https://carbonchat.firebaseio.com/";
        var userLocationPrefix = "/app_data/users";
        var messageLocationPrefix = "/messages"

		var fireRef;
		var fireRefObj;				//Need to understand how this is different from the fireRef
		
		//This function will initialize the firebase references and any other objects that we'll need 
		//when we are referencing data from the 
		function init(){
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

			console.log('about to create user');
			console.log('is the firebase null? ');
			console.log(fireRef);

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
            var firebaseToRead;
                
			//Always check to ensure that the firebase reference isn't null
			if(fireRef == null){
				init();
			}
			
			console.log(userId);

			firebaseToRead = fireRef.child("app_data/users").child(userId);
			firebaseToRead.once("value", function (snapshot) {
			    deferred.resolve(snapshot.val());
			});

            return deferred.promise;
        }            //Returns a promise that will be resolved with the information in the user's table
        var getUserMessages = function (userId) {
            //This will read the information about the user from the firebase table
            var deferred = q.defer();
            var firebaseToRead;

            //Always check to ensure that the firebase reference isn't null
            if (fireRef == null) {
                init();
            }

            firebaseToRead = fireRef.child(userLocationPrefix).child(userId).child(messageLocationPrefix);
            deferred.resolve($firebaseArray(firebaseToRead));
            
            return deferred.promise;
        }

        var writeData = function (pathList, object) {
            //This will create a new child node at the specified location and will then write data to that location and will return a reference
            //to the new child node

            var deferred = q.defer();
            var messageKey;                 //Holds the messageId

			//Always check to ensure that fireRef isn't null
			if(fireRef == null){
				init();
			}
			
			console.log('in firebase service - about to save');

            //Save the message to the messages table
			var firebaseRefToSave = fireRef;
			firebaseRefToSave = firebaseRefToSave.child(pathList);
			firebaseRefToSave = firebaseRefToSave.push();               //Create a new child
			firebaseRefToSave.set(object);                              //Save the message to the new id

            deferred.resolve(messageKey);
            return deferred.promise;

        }           //Saves data to the firebaseRef
        var updateData = function (pathList, object) {
            //This function will update on the parameters in the object at the current location
            var deferred = q.defer();

            //Always check to ensure that fireRef isn't null
            if (fireRef == null) {
                init();
            }

            try{
                console.log('in firebase service - about to update');

                //Save the message to the messages table
                var firebaseRefToUpdate = fireRef;
                firebaseRefToUpdate = firebaseRefToUpdate.child(pathList);
                firebaseRefToUpdate.update(object);

                deferred.resolve("success");
            } catch (err) {
                deferred.reject("failure");
            }
            return deferred.promise;
        }       //This function will take a path and an object and will only update the information 

        var createListener = function (path) {
            
        }
        var readDataOnce = function (path_list) {
			//This will read the information about the user from the firebase table
            var deferred = q.defer();
			var firebaseRefToRead;
			
			console.log("firebase service: " + path_list);

			//Always check to ensure that the firebase reference isn't null
			if(fireRef == null){
				init();
			}

			//console.log(fireRef);
			//firebaseRefToRead = fireRef.child(path_list);

			fireRef.once('value', function (data) {
			    deferred.resolve(data.val());
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

            getUserInformation: getUserInformation,
            getUserMessages: getUserMessages,

            writeData: writeData,
            updateData: updateData,

            createListener: createListener,
            readDataOnce: readDataOnce,
			gotNewMessage: gotNewMessage
        }
    });

})();