/*
 * The main module here. Try to keep this project modular.
 * 
 * */
(function () {
    
    //Our dependences
    var firebase = require('firebase');
    
    /*
    var printer = require("./module-print-thermal.js");
    console.log("declaring our dependencies - declared thermal printer");
    var authModule = require("./module-authenticate.js");
    var messageModule = require("./module-message.js");
    */
     
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
        //authenticate().then();


        
    }               //The startup function

    function authenticate(){
        var authMethods = [authModule.init(firebaseRef), authModule.authenticate()];
        var result = q();

        authMethods.forEach(function (f) {
            result = result.then(f);
        v});

        return result.promise;
    }                   //Authenticate
    function getMessages(){                      
        //get a list of all the conversations that the user 
    }                    //Get any new messages
    function printMessag(message){

    }            //Print the message that we received

    init();     //Get things rolling
})();


