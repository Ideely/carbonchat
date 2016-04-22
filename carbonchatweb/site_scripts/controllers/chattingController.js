/*co
    This is the controller that controlls the behavior of the chatting functionality
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.controller('chattingController', ["$scope", "$http", "$q", "authenticationService", "messageService", "appService", "$state", function ($scope, $http, $q, authenticationService, messageService, appService, $state) {
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

        var cachedQuery, lastSearch;

        function querySearch(criteria) {

            console.log($scope.user.friends);
            
            cachedQuery = cachedQuery || criteria;

            var results = [];

            angular.forEach($scope.user.friends, function (element, index) {
                if (angular.lowercase(element.name).indexOf(criteria) > -1) {
                    results.push(element);
                }
            });

            return cachedQuery ? results : [];
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            console.log(lowercaseQuery);

            return function filterFn(contact) {
                return (angular.lowercase(contact.name).indexOf(lowercaseQuery) != -1);;
            };
        }

        //get the user's auth credentials from the auth service
        $scope.credentials = authenticationService.getCredentials();
        console.log($scope.credentials);

        //get the user's information from the user's table
        var userInfoPromise = authenticationService.getUserInformation($scope.credentials.uid);
        userInfoPromise.then(function (data) {
            $scope.user = data;
            console.log(data);
        }).catch(function (err) {
            console.log("error getting user information");
        });

        $scope.sendMessage = function () {
            //Need to save this message to the firebase
			var deferred = q.defer();
			var messageSavePromise;
			
            //Populate the rest of the message attributes
			$scope.message.from = $scope.user.userId;

            console.log($scope.message)
            messageSavePromise = messageService.writeMessage($scope.user.userId, $scope.message);
			messageSavePromise.then(
				function(data){
					deferred.resolve("success");
				}
			);
			
			return deferred.promise;
		}
        $scope.querySearch = querySearch;

    }]);

})();