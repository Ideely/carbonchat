/*
    This is the service that controlls the behavior when attempting to authenticate users
    Will include functions for authentication, account creation, and account alteration
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.service('authService', function ($http, $q, $firebaseObject) {
        var q = $q;
        var authCredentials;                                              //The authentication credentials of the user

        var authCarbonChat = function (fireRef, email, password) {
            //This function will return a promose that will be resolved if the user is authenticated and will
            //be rejected with a message indicating why,
            var deferred = q.defer();

            console.log('trying to authenticate');

            fireRef.authWithPassword({
                "email": email,
                "password": password
            }, function (error, authData) {
                if (error) {
                    console.log("Login Failed!", error);

                    if(error.message.indexOf("not exist") > -1)
                    {
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

        var createUser = function (fireRef, email, password) {
            //This function will return a promise that will be resolved with the UID of the new user or rejected with an error code.

            var deferred = q.defer();

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
        var createUserInTable = function (fireRef, userId, email) {
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

        var getCredentials = function () {
            if (authCredentials == null) {
                return "Not Authenticated";
            } else {
                return authCredentials;
            }
        }                               //This will return the authentication credentials of the user
        var getUserInformation = function (fireRef, userId) {
            var deferred = q.defer();
            var obj = $firebaseObject(fireRef.child("app_data").child("users").child(userId));

            obj.$loaded().then(function () {
                if (err) {
                   deferred.reject(err);
                }
                deferred.resolve(obj);
            });

            return deferred.promise;            
        }            //Returns a promise that will be resolved with the information in the user's table

        return {
            authCarbonChat: authCarbonChat,
            createUser: createUser,

            getCredentials: getCredentials,
            getUserInformation: getUserInformation
        }
    });

})();