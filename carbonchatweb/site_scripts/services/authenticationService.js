/*
    This is the service that controlls the behavior when attempting to authenticate users
    Will include functions for authentication, account creation, and account alteration
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.factory('authService', function ($scope, $http, $q, $firebaseObject) {

        var authCarbonChat = function (firebaseRef, email, password) {
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
                    deferred.reject(error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    deferred.resolve(authData);
                }
            });

        }       //this will attempt to authenticate the user via the carbonchat authwithpassword 
        var createUser = function (firebaseRef, email, password) {
            //This function will return a promise that will be resolved with the UID of the new user or rejected with an error code.

            var deferred = q.deferred();

            fireRef.createUser({
                email: $scope.user.email,
                password: $scope.user.password
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
                    deferred.resolve(userData.uid);
                }
            });

            return deferred.promise;

        }       //This will attempt to create a new user with the following email and password

        return {
            authCarbonChat: authCarbonChat,
            createUser: createUser
        }
    });

})();