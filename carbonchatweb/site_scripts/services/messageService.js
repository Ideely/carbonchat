/*
    This is the service that controlls the behavior when attempting to save or read messages
    from the firebase. In this behavior, I'd like the only reference to the firebase to be in
	the firebase service
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.service('messageService', ["$http", "$q", "firebaseService", "_", function ($http, $q, firebaseService, _ ) {
        var q = $q;

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
		var writeMessage = function (userId, message) {

            var deferred = q.defer();

			var writeDataPromise;
			var recipientsPromise;
            
            //Get an array of messages that the user has, add the message that was passed in, and save
			messages = firebaseService.getUserMessages(userId).then(function (messages) {
			    messages.$add(message);
			    messages.$save();

			    deferred.resolve('success');
			});

			return deferred.promise;
		}
        
        return {
            writeMessage: writeMessage
        }
    }]);

})();