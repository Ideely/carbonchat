/*
    This is the controller that controlls the behavior of the chatting functionality
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.controller('chattingController', ["$scope", "$http", "$q", "authService", "messageService", "appService", "$state", function ($scope, $http, $q, authService, messageService, appService, $state) {
        var q = $q;
        $scope.user = {
            name: "",
            userId: "",
            gender: ""
        };
        $scope.message = {
            text: "",
            to: [],
            timestamp: "",
            from: "",
            location: ""
        };

        authService.getUserInformation(authService.getCredentials().userId).then(function (data) {
            //TODO finish this bit
            $scope.user = data;
        });
        
        $scope.sendMessage = function () {
            //Need to save this message to the firebase
			var deferred = q.defer();
			var messageSavePromise;
			
            //Populate the rest of the message attributes
			$scope.message.user = $scope.user.userId;

            console.log($scope.message)
			messageSavePromise = messageService.writeMessage($scope.message);
			messageSavePromise.then(
				function(data){
					deferred.resolve("success");
				}
			);
			
			return deferred.promise;
		}
        
    }]);

})();