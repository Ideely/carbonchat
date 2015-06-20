(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.run(['$rootScope', '$window', function ($rootScope, $window) {
        console.log('app running');
    }]);
})();
