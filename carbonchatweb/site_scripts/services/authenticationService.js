/*
    This is the service that controlls the behavior when attempting to authenticate users
    Will include functions for authentication, account creation, and account alteration
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.service('authService', function ($http, $q, firebaseService) {
        var q = $q;
        var authCredentials;                                              //The authentication credentials of the user

        var authCarbonChat = function (email, password) {
            //This function will return a promose that will be resolved if the user is authenticated and will
            //be rejected with a message indicating why,
            var deferred = q.defer();

            console.log('trying to authenticate');

            firebaseService.authCarbonChat(email, password).then(
				function(authData){
					deferred.resolve(authData);
				}, function(error){
					deferred.reject(error);
				});
				
            return deferred.promise;

        }       //this will attempt to authenticate the user via the carbonchat authwithpassword 

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
            if (authCredentials == null) {
                return "Not Authenticated";
            } else {
                return authCredentials;
            }
        }                      //This will return the authentication credentials of the user
        var getUserInformation = function (userId) {
            var deferred = q.defer();
            
			firebaseService.getUserInformation(userId).then(
				function(userInfo){
					deferred.resolve(userInfo);
				}, function(error){
					deferred.reject(error);
				});

            return deferred.promise;            
        }            //Returns a promise that will be resolved with the information in the user's table

        var updateUserInformation = function(userId, value){
            var deferred = q.defer();

            var userPath = 'app_data/users/' + userId;                          //get to the path of the user so we can update their information

            firebaseService.updateData(userPath, value).then(function (data) {
                deferred.resolve(data);
            }).catch(function(err){
                deferred.reject(err);
            });

            return deferred.promise;
        }

        return {
            authCarbonChat: authCarbonChat,
            createUser: createUser,

            getCredentials: getCredentials,
            getUserInformation: getUserInformation
        }
    });

})();