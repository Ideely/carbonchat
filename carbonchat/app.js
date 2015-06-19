/*
 * The main module here. Try to keep this project modular.
 * 
 * */

//Our dependences
(function(){
	var q = reuire('q');
	
	var printerModule = require('module-print-thermal');
	var authModule = require('module-authenticate');
	var messageModule = require('module-messages');
	
	var device;
	var user;
	
	//Initialization function, will be called on startup
	function init(){
		
		//First things first, get the device info and the user credentials
		//NEED TO FINISH
		q.all([
			authModule.getDeviceInfo(),
			authModule.getCredentials()
		]).then();
	}
	
	init();
	
})();





