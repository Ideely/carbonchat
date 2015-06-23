/*
    This is the service that controlls the behavior when attempting to save or read messages
    from the firebase
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.service('authService', function ($http, $q, $firebaseObject) {
        var q = $q;
        var firebaseRef = null;
        var firebaseObj = null;
        var location = "https://carbonchat.firebaseio.com/";

        //This is the init function, if at anytime our firebase reference objects are null, then we need
        //to call this function to re-instantiate them
        function init(){
            firebaseRef = new Firebase(location).child("app_data");
            firebaseObj = firebaseRef;
        }

        var readUserMessagesByConversation = function (conversation) {
            var deferred = q.defer();

            //read the first message from the conversation and add it to the 
            firebaseRef.child("messages").child(conversation).once('value', function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });

            return deferrd.promise;
        }
        var createConversationListener = function (conversation) { }
        var writeMessage = function (message, userData) { }
        
        return {
            readUserMessages: readUserMessages,
            createConversationListener: createConversationListener,

            writeMessage: writeMessage
        }
    });

})();