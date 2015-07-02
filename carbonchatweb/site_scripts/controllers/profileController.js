(function () {
    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.controller('profileController', ["$scope", "$http", "$q", "authService", "appService", "$state", "$timeout", function ($scope, $http, $q, authService, appService, $state, $timeout) {
        $scope.user = {
            email: "",
            password: "",
            name: "",
            gender: ''
        };

        $scope.applicationText = {
            url: "",
            name: "",
            slogan: ""
        }

        appService.getAppInformation().then(
		    function (app_info) {
		        applicationText = app_info;

		        $timeout(function () {
		            $scope.$apply();
		        });

		    }, function (error) {
		        console.log("getting application info error");
		    }
        );

        $scope.saveProfile = function () {
            //This will authenticate the user assuming they have entered email and password
            var saveProfilePromise = authService.updateUserInformation({ email: $scope.user.email, password: $scope.user.password, name: $scope.user.name, gender: $scope.user.gender });

            saveProfilePromise.then(function (data) {
                console.log(data);

                //change state to go to the chatting state
                $state.go('chatting');
            });
        };       //Attempt to authenticate the user
    }]);
})();