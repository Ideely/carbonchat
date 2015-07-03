/*co
    This is the controller that controlls the behavior of the chatting functionality
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.controller('chattingController', ["$scope", "$http", "$q", "authService", "messageService", "appService", "$state", function ($scope, $http, $q, authService, messageService, appService, $state) {
        var q = $q;
        $scope.credentials = {
            uid: ""
        };
        $scope.user = {
            name: "",
            userId: "",
            gender: "",
            friends: ""
        };
        $scope.message = {
            text: "",
            to: [],
            timestamp: "",
            from: "",
            location: ""
        };

        //get the user's auth credentials from the auth service
        $scope.credentials = authService.getCredentials();
        console.log($scope.credentials);

        //get the user's information from the user's table
        var userInfoPromise = authService.getUserInformation($scope.credentials.uid);
        userInfoPromise.then(function (data) {
            console.log(data);
        }).catch(function (err) {
            console.log("error getting user information");
        });

        //Auto complete for user's friends
        function querySearch(query) {
            var results = query ? $scope.user.friends.filter(createFilterFor(query)) : [];
            return results;
        }
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(friend) {
                return (angular.lowercase(friend.name).indexOf(lowercaseQuery) === 0) ||
                    (angular.lowercase(friend.email).indexOf(lowercaseQuery) === 0);
            };
        }
       
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