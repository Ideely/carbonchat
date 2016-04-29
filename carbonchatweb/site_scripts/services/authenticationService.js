/*
    This is the service that controlls the behavior when attempting to authenticate users
    Will include functions for authentication, account creation, and account alteration
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.service('authenticationService', function ($http, $q, firebaseService, $window) {
        var q = $q;
        var authCredential = null;                                                //The authentication credentials of the user
        var userInformation = null;                                         //The user's information

        var authCarbonChatWithPassword = function (email, password) {
            //This function will return a promose that will be resolved if the user is authenticated and will
            //be rejected with a message indicating why,
            var deferred = q.defer();

            console.log('trying to authenticate');

            firebaseService.authCarbonChat(email, password).then(
				function (authData) {
				    storeAuthData(authData);
					deferred.resolve(authData);
				}, function(error){
					deferred.reject(error);
				});
				
            return deferred.promise;

        }       //this will attempt to authenticate the user via the carbonchat authwithpassword 
        var authCarbonChatWithJWT = function (jwt) {
            //This function will return a promose that will be resolved if the user is authenticated and will
            //be rejected with a message indicating why,
            var deferred = q.defer();

            console.log('trying to authenticate');

            firebaseService.authWithJWT(jwt).then(
				function (authData) {
				    storeAuthData(authData);
				    deferred.resolve(authData);
				}, function (error) {
				    deferred.reject(error);
				});

            return deferred.promise;

        }   //Will attempt to authenticate the user via the carbonchat auth function
        var isAuthenticated = function () {
            if ($window.sessionStorage.accessToken) {
                return $window.sessionStorage.accessToken;
            } else {
                return null;
            }
        }   //Will check session storage for a token for the user to authenticate with
        var storeAuthData = function (authData) {
            //Store the user's authentication data
            authCredential = authData;

            //Store the JWT
            $window.sessionStorage.accessToken = authData.token;
        }   //This will store the authentication data we've received and will store the JWT token in web storage

        var createUser = function (email, password) {
            //This function will return a promise that will be resolved with the UID of the new user or rejected with an error code.

            var deferred = q.defer();

			firebaseService.createUser(email, password).then(
				function(userId){
					deferred.resolve(userId);
				}, function(error){
					deferred.reject(error);
				});

            return deferred.promise;

        }           //This will attempt to create a new user with the following email and password
        var createUserInTable = function (userId, email) {
            var deferred = q.defer();
			
			firebaseService.createUserInTable(userId, email).then(
				function(result){
					deferred.resolve(result);
				}, function(error){
					deferred.reject(error);
				});
			            
            return deferred.promise;
        }      //Creates the user in our table where we can store user information

        var getCredentials = function () {
            //If we have the auth credentials cached then all we need to do is to return the credentials
            //otherwise, we need to return an error so we can sign in again

            if (authCredential == null) {
                return "Not Authenticated";
            } else {
                return authCredential;
            }
        }                      //This will return the authentication credentials of the user
        var getUserInformation = function (userId) {
            var deferred = q.defer();
            
            //Check to see if we have already pulled the information
            if (userInformation == null) {
                firebaseService.getUserInformation(userId).then(
                    function (userInfo) {
                        userInformation = userInfo;
                        deferred.resolve(userInfo);
                    }, function (error) {
                        deferred.reject(error);
                    });
            } else {
                deferred.resolve(userInformation);
            }

            return deferred.promise;            
        }            //Returns a promise that will be resolved with the information in the user's table

        var updateUserInformation = function(value){
            var deferred = q.defer();
            var userPath;

            try {

                console.log("trying to update user information");

                /*
                if (userInformation.uid == null) {
                    console.log("not authenticated");
                    deferred.reject("not authenticated");
                }
                */

                console.log(userInformation);
                userPath = 'app_data/users/' + userInformation.userId;                          //get to the path of the user so we can update their information
                console.log(userPath);

                firebaseService.updateData(userPath, value).then(function (data) {
                    deferred.resolve(data);
                }).catch(function (err) {
                    console.log("we caught an error in the firebase update data service: ");
                    console.log(err);
                    deferred.reject(err);
                });

            } catch (err) {
                console.log("error in update user information");
                console.log(err);
                deferred.reject("error in update user information");
            }

            return deferred.promise;
        }
        var addFriends = function (friendList) {
            //this function will take the array of friends that the user has chosen and will add them to the user profile
            var deferred = q.defer();
            var userPath;
            var friendListToSave = {};

            try {

                console.log("trying to add friends");
                userPath = 'app_data/users/' + userInformation.userId + '/users';                          //get to the path of the user so we can update their information
                console.log(userPath);

                //We need to loop through all of the items in the friend list. Idealy, the friend list is a colleciton of object
                //that contain a userId and email, and name
                _.foreach(friendList, function (friend, key) {
                    friendListToSave.friend
                });
                
                firebaseService.updateData(userPath, value).then(function (data) {
                    deferred.resolve(data);
                }).catch(function (err) {
                    console.log("we caught an error in the firebase update data service: ");
                    console.log(err);
                    deferred.reject(err);
                });

            } catch (err) {
                console.log("error in update user information");
                console.log(err);
                deferred.reject("error in update user information");
            }

            return deferred.promise;
        }

        return {
            authCarbonChatWithPassword: authCarbonChatWithPassword,
            authCarbonChatWithJWT: authCarbonChatWithJWT,
            isAuthenticated: isAuthenticated,
            storeAuthData: storeAuthData,

            createUser: createUser,
            updateUserInformation: updateUserInformation,

            getCredentials: getCredentials,
            getUserInformation: getUserInformation
        }
    });

})();