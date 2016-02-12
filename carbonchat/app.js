/*
 * The main module here. Try to keep this project modular.
 * 
 * */
(function () {
    
    //Our dependences
    var firebase = require('firebase');
    var auth = require('./module-authenticate.js');
    var async = require('async');
    var printer = require('../module-print-thermal.js');
    
    var queue;

    //Module level variables
    var firebaseRef = new firebase("https://carbonchat.firebaseio.com/");
    
    function init(){
        
        console.log('in init');
        
        //Lets see if we can read from the firebase
        firebaseRef.child("app_settings").child("url").once("value", 
            function (url) {
                console.log(url);
        });
        

        //First things first, lets authenticate
        authenticate().then(function () {
            //Now that we've authenticated, we'll be able to use the firebaseRef

            //Now lets go to the initialization function
            settingInitialization();

        });
        
    }               //The startup function

    function authenticate(){
        
        var result = q();
        
        //Perform authentication. At the end, this will return a firebase ref to the user's object where we will listen for new changes to the messages child
        auth.init(firebaseRef);
        auth.authenticate()
            .then(function (newFireBaseRef) {
                firebaseRef = newFireBaseRef;
                result.resolve();
            });

        return result.promise;
    }                   //Authenticate
    
    function settingInitialization(){
        firebaseRef.child('messages').on('child_added', printMessage(childSnapshot, prevChildKey));

        mainLoop();
    }

    function mainLoop(){
        //the main event loop of the program

        var queue = aysnc.queue(runtask, 10);

        queue.drain = function () {
            setTimeout(fillQueue, 100);
        };

    }
    
    function fillQueue(){
        queue.push(setTimeout(function () { }, 100));

    }                                         //Fills the task queue with work.
    function getMessages(){                      
        //get a list of all the conversations that the user 
    }                                       //Get any new messages
    function printMessag(message, previousChildKey){

        //got the message, now we need to print it!
        printer.printMessage(message);

    }             //Print the message that we received

    init();     //Get things rolling
})();


