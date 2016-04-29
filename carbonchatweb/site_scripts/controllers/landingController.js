(function () {
    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.controller('landingController',
        ["$scope",
            "$http",
            "$q",
            "authenticationService",
            "messageService",
            "appService",
            "$state",
            "$timeout",
            "$window",
            function (
                $scope,
                $http,
                $q,
                authenticationService,
                messageService,
                appService,
                $state,
                $timeout,
                $window) {
        $scope.user = {
            email: "",
            password: ""
        };

        $scope.applicationText = {
            url: "",
            name: "",
            slogan: ""
        }
		

        function init() {
            getAppInfo();   //get the information of the app.

            //let's see if we're authenticated
            var jwt = authenticationService.isAuthenticated();
            
            if (jwt) {
                //We have an authentication jwt, so use that to authenticate the user
                authenticationService.authCarbonChatWithJWT(jwt).then(function(authdata){
                    $state.go('chatting');
                });
            }
        }
		
        function getAppInfo() {
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
        }
        
        $scope.authUser = function() {
			//This will authenticate the user assuming they have entered email and password
            var authData = authenticationService.authCarbonChatWithPassword($scope.user.email, $scope.user.password);

            authData.then(function (authData) {
                console.log(authData);

                //change state to go to the chatting state
                $state.go('chatting');
            });
        };       //Attempt to authenticate the user



        init();
    }]);
})();