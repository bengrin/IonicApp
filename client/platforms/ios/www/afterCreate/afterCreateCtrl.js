angular.module('which.controllers.afterCreate', ['which.factory', 'ionic.contrib.ui.tinderCards'])


  .controller('AfterCreateCtrl', function($scope, $state, WhichFactory) {

    //Load newest function after submission of previous which
    $scope.getNewWhich = function() {
      WhichFactory.getNew().then(function(which) {
        $state.go('app.which', {
          id: which[0].id,
          question: which[0].question,
          thingA: which[0].thingA,
          thingB: which[0].thingB
          //tags: which.tags
        });
      });
    };

    //Navigate to creation page via state change
    $scope.create = function() {
      $state.go('app.create');
    }

  });
