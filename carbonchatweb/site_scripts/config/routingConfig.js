(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('landing', {
                url: '/landing',
                views: {
                    content: {
                        templateUrl: '/templates/landing.html',
                        controller: 'landingController'
                    }
                }
            })
          .state('chatting', {
              url: '/chat',
              
              views: {
                  banner:{
                      templateUrl: '/templates/banner.html',
                      controller: 'bannerController'
                  },
                  nav: {
                      templateUrl: '/templates/navbar.html',
                      controller: 'navController'
                  },
                  content: {
                      templateUrl: '/templates/chatting.html',
                      controller: 'chattingController'
                  }
              }
          })
        .state('profie', {
            url: '/profile',
            views: {
                banner: {
                    templateUrl: '/templates/banner.html',
                    controller: 'bannerController'
                },
                nav: {
                    templateUrl: '/templates/navbar.html',
                    controller: 'navController'
                },
                content: {
                    templateUrl: '/templates/profile.html',
                    controller: 'profileController'
                }
            }

        });
        //$urlRouterProvider.otherwise('/landing');
    });

})();