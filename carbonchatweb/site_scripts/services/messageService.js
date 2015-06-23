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

        var readUserMessagesByConversation = function (conversation) {
            var deferred = q.defer();

            //read the first message from the conversation and add it to the 
			firebaseService.

            return deferrd.promise;
        }
        var createConversationListener = function (conversation) { }
        var writeMessage = function (message, userData) { }
        
        return {
            readUserMessages: readUserMessages,
            createConversationListener: createConversationListener,

            writeMessage: writeMessage
        }
    }]);

})();