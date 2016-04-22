(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp
        .constant('_', window._)    //so we can use Lodash
        .run(['$rootScope', '$window', function ($rootScope, $window) {
            console.log('app running');
        }]);
})();
