/*
 * The main module here. Try to keep this project modular.
 * 
 * */
(function () {

    //Our dependences
    var firebase = require('firebase');

    var printer = require('module-print-thermal');
    var authModule = require('module-authenticate');
    var messageModule = require('module-message');
    
    //Module level variables
    var firebaseRef = new Firebase("https://carbonchat.firebaseio.com/");
    
    function init(){
        
        //First things first, lets authenticate
        authenticate().then();


        
    }               //The startup function

    function authenticate(){
        var authMethods = [authModule.init(firebaseRef), authModule.authenticate()];
        var result = q();

        authMethods.forEach(function (f) {
            result = result.then(f);
        });

        return result.promise;
    }                   //Authenticate
    function getMessages(){                      

    }                    //Get any new messages
    function printMessag(message){

    }            //Print the message that we received

    init();     //Get things rolling
})();


