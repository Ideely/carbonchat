/*
    This is the controller that controlls the behavior of the chatting functionality
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.controller('chattingController', ["$scope", "$http", "$q", "authService", "messageService", "$state", function ($scope, $http, $q, authService, messageService, $state) {
        $scope.site = {
            url: "",
            name: "",
            slogan: ""
        }
		
		$scope.user = {
			name = "",
			userId = "",
			gender = ""
		}
		
		var messagePromise = messageService.gotNewMessage();
		messageePromise.then(function(data){
			console.log('got one' + data);
		})

        $scope.sendMessage = function () {
            //Need to save this message to the firebase
			var deferred = q.defer();
			var messageSavePromise;
			
			messageSavePromise = messageService.writeMessage($scope.user.userId);
			messageSavePromise.then(
				function(data){
					deferred.resolve("success");
				}
			);
			
			return deferred.promise;
		}
    }]);

})();