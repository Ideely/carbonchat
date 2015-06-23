/*
    This is the service that controlls the behavior when attempting to save or read messages
    from the firebase. In this behavior, I'd like the only reference to the firebase to be in
	the firebase service
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.service('authService', ["$http", "$q", "firebaseService", function ($http, $q, firebaseService ) {
        var q = $q;
        //var firebaseRef = null;
        //var firebaseObj = null;
        //var location = "https://carbonchat.firebaseio.com/";

        //This is the init function
        function init(){
            //firebaseRef = new Firebase(location).child("app_data");
            //firebaseObj = firebaseRef;
        }

		var gotNewMessage = function(userId){
			//Will return a promise that will be fulfilled after being returned a message, then will be called again
			var deferred = q.defer();
			
			var newMessagePromise = firebaseService.getNewMessage(userId)
			newMessagePromise.then(function(message){
				newMessagePromise.resolve(message);							//returning the new message
				newMessagePromise = firebaseService.getNewMessage(userId);	//Calling it again
			}, function(error){
				deferred.reject(error);										//Return the error
				newMessagePromise = firebaseService.getNewMessage(userId);	//Calling it add
			});
			
			return deferred.promise;
		}
        var readUserMessagesByConversation = function (conversation) {
            var deferred = q.defer();

            //read the first message from the conversation and add it to the 
			//firebaseService.

            return deferrd.promise;
        }
        var createConversationListener = function (conversation) { }
        var writeMessage = function (message, userData) { 
			//This will call the firebase service to write data to the database
			var deferred = q.defer();
			var writeDataPromise;
			
			writeDataPromise = firebaseService.writeData({"app_data", "messages"}, message);
			writeDataPromise.then(function(data){
				deferred.resolve(data);
			}, function(error){
				deferred.reject(error);
			});
			
			return deferred.promise;
		}
        
        return {
            readUserMessages: readUserMessages,
            createConversationListener: createConversationListener,

            writeMessage: writeMessage
        }
    }]);

})();