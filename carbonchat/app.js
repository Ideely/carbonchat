/*
 * The main module here. Try to keep this project modular.
 * 
 * */
(function () {
    
    //Our dependences
    var firebase = require('firebase');
    var auth = require('./module-authenticate.js');
    var async = require('async');
    var printer = require('./module-print-thermal.js');
    var q = require('q');
    
    var queue;

    //Module level variables
    var firebaseRef = new firebase("https://carbonchat.firebaseio.com/");
    
    function init(){
        //Lets see if we can read from the firebase
        firebaseRef.child("app_settings").child("url").once("value", 
            function (url) {
                console.log(url);
        });
        
        //First things first, lets authenticate
        authenticate().then(function (path) {
            //Now lets go to the initialization function
            settingInitialization(path);

        });
    }               //The startup function

    function authenticate(){
        
        var result = q.defer();
        
        auth.init(firebaseRef);

        //Perform authentication. At the end, this will return a firebase ref to the user's object where we will listen for new changes to the messages child
        auth.authenticate()
            .then(function (path) {
                result.resolve(path);
            }, function (err) { });

        return result.promise;
    }                   //Authenticate
    
    function settingInitialization(path){
        
        firebaseRef = new firebase("https://carbonchat.firebaseio.com/app_data/users/" + path)
        //firebaseRef.child('messages').on('child_added', function () { console.log('got a message'); });
       
        firebaseRef.child('messages').on('child_added', function (childSnapshot, prevChildKey) {
            return printMessage(childSnapshot, prevChildKey);
        });
    }
                                       //Get any new messages
    function printMessage(message, previousChildKey){
        
        console.log('got message!');
        console.log(message.val());

        //got the message, now we need to print it!
        printer.printMessage(message.val());

    }             //Print the message that we received

    init();     //Get things rolling
})();


