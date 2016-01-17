angular.module('which.controllers.tagView', ['which.factory', 'ionic.contrib.ui.tinderCards'])


.controller('TagViewCtrl', function($scope, $state, WhichFactory) {

  $scope.data = {
    tagSearch: '',
    tags: [],
    top: []

  };

  $scope.$on('$ionicView.afterEnter', function() {
    WhichFactory.getTags().then(function(tags) {
      $scope.data.top = tags
      console.log(tags);
    })
  });

  $scope.getWhichesByTag = function(tag) {
    if (tag) {
      WhichFactory.getWhichesByTag(tag).then(function(whiches){
        $scope.data.whiches = whiches;
      })
    }
    else if ($scope.data.tagSearch !== '') {
      WhichFactory.getWhichesByTag($scope.data.tagSearch).then(function(whiches) {
        $scope.data.whiches = whiches;
      })
    }
  };

  $scope.goToWhich = function(id) {
    WhichFactory.getWhichByID(id).then(function(which) {
      console.log(which);
      $state.go('app.which', {
        id: which.id,
        question: which.question,
        thingA: which.thingA,
        thingB: which.thingB
      });
    })
  };

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

  $scope.originalData = angular.copy($scope.data);

  $scope.$on('clear', function(event, state) {
    if (state === 'app.tagView')
      $scope.data = $scope.originalData;
  });
});

