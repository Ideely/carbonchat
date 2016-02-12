/*
* The messages module, this will pull new messages from the firebase database
* */

(function () {
    
    //Dependencies -- Might not need these
    var q = require('q');
    var Firebase = require('firebase');

    var firebaseRef;                        //How we talk to the firebase DB
    var conversations = [];                 //A list of conversations the user is apart of
    
    //The initialization of our firebase object.
    
    exports.init = function init(firebaseObj, userName) {
        firebaseRef = firebaseObj;							//Set the firebase reference
    }                                                       //Will perform authentication, get message root directory

    exports.getNewMessages = function getNewMessages(conversation) {
        var deferred = q.defer();
        var error;
        
        try {
            if (firebaseRef != null) {
                firebaseRef.child("messages").child(converation).startAt().limit(1).once("child_added", function (snapshot) {
                    deferred.resolve(snapshot.val());
                });
            } else {
                throw "firebase reference is not instantiated";
            }
        } catch (err) {
            error = err.message;
            deferred.reject(error);
        }
        
        return deferred.promise();
    }                                  //This is our function to check for new messages

})();