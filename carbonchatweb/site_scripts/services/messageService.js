﻿/*
    This is the service that controlls the behavior when attempting to save or read messages
    from the firebase. In this behavior, I'd like the only reference to the firebase to be in
	the firebase service
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.service('messageService', ["$http", "$q", "firebaseService", function ($http, $q, firebaseService ) {
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
        var writeMessage = function (message) { 
			//This will call the firebase service to write data to the database
			var deferred = q.defer();
			var writeDataPromise;
			var recipientsPromise;

			console.log('writing message to table: ' + message.text);
			writeDataPromise = firebaseService.writeData('app_data/messages', message);     //Write the message to the messages table
			writeDataPromise.then(function (messageId) {
                
			    console.log('message created in table with id: ' + messageId);

                //Then we need to save a reference to each 
			    _.foreach(message.to, function (recipient, key) {
			        console.log('writing reference at user: ' + recipient);

			        var promise = firebaseService.writeData('app_data/users/' + recipient + '/messages', { from: message.from, messageId: messageId});
			        recipientsPromise.push(promise);
			    });

			    //Find when all the promises have been completed
			    q.all(recipientsPromise).then(function (data) {
			        deferred.resolve("success");
			    });

			}, function(error){
				deferred.reject(error);
			});
			
			return deferred.promise;
		}
        
        return {
            readUserMessagesByConversation: readUserMessagesByConversation,
            createConversationListener: createConversationListener,

            writeMessage: writeMessage
        }
    }]);

})();