angular.module('which', ['ionic',
  'which.controllers.afterCreate',
  'which.controllers.login',
  'which.controllers.app',
  'which.controllers.create',
  'which.controllers.result',
  'which.controllers.tagView',
  'which.controllers.which',
  'which.controllers.signUp',
  'which.controllers.whichesByUser',
  'which.controllers.whichInfoCtrl',
  'which.factory',
  'which.cloudinaryFactory',
  'user.factory',
  'ionic.contrib.ui.tinderCards',
  'ngCordova'
])

.run(function($rootScope, $ionicPlatform, User, $state) {
  $ionicPlatform.ready(function() {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      $rootScope.$broadcast('clear', fromState.name);
      if (!User.isloggedIn() && toState.name !== 'app.login' && toState.name !== 'app.signUp') {
        event.preventDefault();
        $state.go('app.login');
      }
    })

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$compileProvider) {
  $stateProvider

  //Main app state, contains the logic/views for the menu and login
  //Will be present on EVERY state
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'app/app.html',
    controller: 'AppCtrl'
  })

  //State for viewing a single Which. ***THIS IS THE DEFAULT STATE***
  .state('app.which', {
    url: '/which',
    params: {
      id: '1',
      question: " should I eat?",
      thingA: 'http://cdn2.rosannadavisonnutrition.com/wp-content/uploads/2015/10/chocolate-chocolate-30471811-1024-768.jpg',
      thingB: 'http://weknowyourdreams.com/images/chocolate/chocolate-01.jpg'
    },
    views: {
      'menuContent': {
        templateUrl: 'which/which.html',
        controller: 'WhichCtrl'
      }
    }
  })

  //State for creating a Which.
  .state('app.tagView', {
    url: '/tagView',
    views: {
      'menuContent': {
        templateUrl: 'tagView/tagView.html',
        controller: 'TagViewCtrl'
      }
    }
  })

  //State for viewing the Whiches of a tag
  .state('app.create', {
    url: '/create',
    views: {
      'menuContent': {
        templateUrl: 'create/create.html',
        controller: 'CreateCtrl'
      }
    }
  })

  //State for after a Which has been created. Provides confirmation to the user that the Which has been created.
  .state('app.afterCreate', {
    url: '/afterCreate',
    views: {
      'menuContent': {
        templateUrl: 'afterCreate/afterCreate.html',
        controller: 'AfterCreateCtrl'
      }
    }
  })

  //State for viewing the results of a Which
  .state('app.result', {
    url: '/result',
    params: {
      a: null,
      b: null,
      choice: null
    },
    views: {
      'menuContent': {
        templateUrl: 'result/result.html',
        controller: 'ResultCtrl'
      }
    }
  })

  //State for user login

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'login/login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  //State for user signUp

  .state('app.signUp', {
    url: '/signUp',
    views: {
      'menuContent': {
        templateUrl: 'signup/signUp.html',
        controller: 'signUpCtrl'
      }
    }
  })

  //State for all user's whiches
  .state('app.whichesByUser', {
    url: '/whichesByUser',
    views: {
      'menuContent': {
        templateUrl: 'whichesByUser/whichesByUser.html',
        controller: 'WhichesByUserCtrl'
      }
    }
  })

  //State for each which made by user
    .state('app.whichInfo', {
      url: '/whichInfo',
      params: {
        which: {}
      },
      views: {
        'menuContent': {
          templateUrl: 'whichInfo/whichInfo.html',
          controller: 'WhichInfoCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');

  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//);

});
