/*
 * The messages module, this will pull new messages from the firebase database
 * */

var q = require('q');
var Firebase = require('firebase');
var firebaseRef;

//The initialization of our firebase object.
//Will perform authentication, get message root directory
exports.init = function init(firebaseObj){
	firebaseRef = firebaseObj;							//Set the firebase reference
}

//This is our function to check for new messages
exports.getNewMessages = function getNewMessages(conversation) {
    var deferred = q.defer();
    var error;

    try {
        if(firebaseRef != null){
			firebaseRef.child("messages").child(converation).startAt().limit(1).once("child_added", function(snapshot){
				deferred.resolve(snapshot.val());
			});
		} else{
			throw "firebase reference is not instantiated";
		}
    } catch (err) {
        error = err.message;
        deferred.reject(error);
    }

    return deferred.promise();
}

//This is our function that will update the status of the message once it has been successfully printed
exports.updateMessageStatus = function updateMessageStatus(conversation, message, status){
	var deferred = q.defer();
    var error;

    try {
        if(firebaseRef != null){
			firebaseRef.child("messages").child(converation).child(message.message_id).child("status").set(status);	
		} else{
			throw "firebase reference is not instantiated";
		}
    } catch (err) {
        error = err.message;
        deferred.reject(error);
    }

    return deferred.promise();
}
