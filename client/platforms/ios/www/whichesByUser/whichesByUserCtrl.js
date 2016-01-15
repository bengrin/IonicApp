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


});
