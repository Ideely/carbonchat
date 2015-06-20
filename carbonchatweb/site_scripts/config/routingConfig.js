(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('landing', {
                url: '/landing',
                controller: 'landingController',
                views: {
                    content: {
                        templateUrl: '/templates/landing.html'
                    }
                }
            })
          .state('chatting', {
              url: '/chat',
              controller: 'chattingController',
              views: {
                  banner:{
                      templateUrl: '/templates/banner.html'
                  },
                  nav: {
                      templateUrl: '/templates/navbar.html'
                  },
                  content: {
                      templateUrl: '/templates/chatting.html'
                  }
              }
          });
        $urlRouterProvider.otherwise('/landing');
    });

})();