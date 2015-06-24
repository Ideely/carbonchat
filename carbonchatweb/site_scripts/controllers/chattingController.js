/*
    This is the controller that controlls the behavior of the chatting functionality
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.controller('chattingController', ["$scope", "$http", "$q", "authService", "messageService", "appService", "$state", function ($scope, $http, $q, authService, messageService, appService, $state) {
        $scope.site = {
            url: "",
            name: "",
            slogan: ""
        }
		
		$scope.user = {
			name: "",
			userId: "",
			gender: ""
		}
		
        
		var sitePromise = appService.getAppInformation();
		sitePromise.then(function(data){
			angular.foreach(data, function(key, value){
				if(key == "url")
					$scope.site.url = value;
				else if(key =="slogan")
					$scope.site.slogan = value;
				else if(key == "name")
					$scope.site.name = value;
			});
		}, function(error){
			console.log("error getting site information " + error);
		});
		
        /*
		var messagePromise = messageService.gotNewMessage();
		messageePromise.then(function(data){
			console.log('got one' + data);
		});
        

        $scope.sendMessage = function () {
            //Need to save this message to the firebase
			var deferred = q.defer();
			var messageSavePromise;
			
			messageSavePromise = messageService.writeMessage($scope.user.userId, );
			messageSavePromise.then(
				function(data){
					deferred.resolve("success");
				}
			);
			
			return deferred.promise;
		}
        */
    }]);

})();