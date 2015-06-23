/*
    This is the service that controls the behavior when attempting to get or save information regarding
	the application settings, so anything in app_settings in teh firebase
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.service('appService', ["$http", "$q", "firebaseService", function ($http, $q, firebaseService ) {
        var q = $q;
		var app_info = {
			name: "",
			url: "",
			slogan: ""
		};
		
        //This is the init function
        function init(){
			
        }
			
		var getAppInformation = function(){
			var deferred = q.defer();
			
			firebaseService.readDataOnce({"app_settings"}).then(
			function(data){
				angular.forEach(data, function (value, key) {
					if(key == "slogan")
						app_info.slogan = value;
					else if(key == "url")
						app_info.url = value;
					else if(key == "name")
						app_info.name = value;
				});
				
				deferred.resolve(app_info);
			}, function(error){
				deferred.reject(error);
			};
			
			return deferred.promise;
		}	
			
        return {
			getAppInformation: getAppInformation
        }
    }]);

})();