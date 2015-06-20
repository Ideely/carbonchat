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
        addConversationListeners(userName);                         //Add the different listeners to each conversation
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
    exports.updateMessageStatus = function updateMessageStatus(conversation, message, status) {
        var deferred = q.defer();
        var error;
        
        try {
            if (firebaseRef != null) {
                firebaseRef.child("messages").child(converation).child(message.message_id).child("status").set(status);
            } else {
                throw "firebase reference is not instantiated";
            }
        } catch (err) {
            error = err.message;
            deferred.reject(error);
        }
        
        return deferred.promise();
    }       //This is our function that will update the status of the message once it has been successfully printed
    
    //Helper functions
    function addConversationListeners(userName) {
        var deferred = q.defer();                   //The deferred object whose promise we will be returning
        var getConversationDeferred = q.defer();    //To signifiy the function that we have the conversations
        var firebaseConversationRefs = [];          //A array of conversation references

        getConversationsDeferred = getConversations(userName);      //Set up the deferred object

        getConverationsDeferred.then(function () {
            for (var count = 0; count < conversations.length; count++) {
                //firebaseConversationRef.push()
            }

            ref.on("child_added", function (snapshot, prevChildKey) {
                var newPost = snapshot.val();
                console.log("Author: " + newPost.author);
                console.log("Title: " + newPost.title);
                console.log("Previous Post ID: " + prevChildKey);
            });
        });              //Add the conversation listeners

    }       //This will attach listeners to all conversations the user is apart of
    function getConversations(userName){
        var deferred = q.defer();

        firebaseRef.child("app_data").child("users").child(userName).child("conversations").once("value", function (convos) {
            conversations = convos;
            return deferred.resolve();
        });
    }       //This will find all the conversations that we need to be listening to.

})();