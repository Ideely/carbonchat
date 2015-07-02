(function () {
    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.controller('landingController', ["$scope", "$http", "$q", "authService", "messageService", "appService", "$state", "$timeout", function ($scope, $http, $q, authService, messageService, appService, $state, $timeout) {
        $scope.user = {
            email: "",
            password: ""
        };

        $scope.applicationText = {
            url: "",
            name: "",
            slogan: ""
        }
		
		appService.getAppInformation().then(
		    function(app_info){
		        applicationText = app_info;

		        $timeout(function () {
		            $scope.$apply();
		        });
		    }, function(error){
			    console.log("getting application info error");
		    }
        );
		
        $scope.authUser = function() {
			//This will authenticate the user assuming they have entered email and password
            var authData = authService.authCarbonChat($scope.user.email, $scope.user.password);

            authData.then(function (authData) {
                console.log(authData);

                //change state to go to the chatting state
                $state.go('chatting');
            });
        };       //Attempt to authenticate the user
    }]);
})();