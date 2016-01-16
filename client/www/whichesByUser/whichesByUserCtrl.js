angular.module('which.controllers.whichesByUser', ['which.factory', 'ionic.contrib.ui.tinderCards'])


.controller('WhichesByUserCtrl', function($scope, $state, WhichFactory) {
  $scope.data = {
    whiches: []
  }
  $scope.$on('$ionicView.afterEnter', function() {

    WhichFactory.getWhichesByUser().then(function (whiches) {
      $scope.data.whiches = whiches;
      console.log(whiches);
    });
  });


  $scope.goToWhich = function(id) {
    WhichFactory.getWhichByID(id).then(function(which) {
      console.log(which);
      $state.go('app.whichInfo', {which: which});
    })
  }

  $scope.remove = function(which) {
    console.log('this', which)
    WhichFactory.deleteWhichByID(which).then(function(err) {
      console.log(which)
    })
    var index = $scope.data.whiches.indexOf(which);
    $scope.data.whiches.splice(index, 1);
  }

});
