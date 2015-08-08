(function () {
    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.controller('profileController', ["$scope", "$http", "$q", "authService", "appService", "$state", "$timeout", function ($scope, $http, $q, authService, appService, $state, $timeout) {
        $scope.userCredentials = { };

        $scope.genderList = ["Male", "Female"];

        $scope.user = {
            email: "",
            password: "",
            name: "",
            gender: '',
            friends: []
        };

        $scope.friendsToAdd = [];

        $scope.applicationText = {
            url: "",
            name: "",
            slogan: ""
        };

        $scope.userCredentials = authService.getCredentials();
        console.log(authService.getCredentials());

        authService.getUserInformation($scope.userCredentials.uid).then(
            function (user_info) {
                $scope.user = user_info;


                $timeout(function () {
                    $scope.$apply();
                });

            }, function (error) {
                console.log("getting user info error");
            }
        );

        $scope.saveProfile = function () {
            //This will authenticate the user assuming they have entered email and password
            var saveProfilePromise = authService.updateUserInformation({ email: $scope.user.email, password: $scope.user.password, name: $scope.user.name, gender: $scope.user.gender });

            saveProfilePromise.then(function (data) {
                console.log(data);
                return authService.addFriends($scope.friendsToAdd);
            }).then(function (data) {
                //The result of the add friends function
                //change state to go to the chatting state
                $state.go('chatting');
            });
        };       //Attempt to authenticate the user
    }]);
})();