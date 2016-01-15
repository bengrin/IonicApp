/**
 * Created by VaibhavNamburi on 11/01/2016.
 */
angular.module('which.controllers.whichInfoCtrl', ['which.factory', 'ionic.contrib.ui.tinderCards'])


.controller('WhichInfoCtrl', function($scope, $state, $stateParams, WhichFactory) {
  $scope.data = {
    username: window.localStorage.getItem('which.userToken'),
    activeSlide: 1,
    which: $stateParams.which,
    cardSrc: '',
  };
  console.log($scope.data);
  $scope.data.type = ($scope.data.which.thingA.substring(0,4) === 'http')?'image':'text'

  $scope.data.things = [$scope.data.which.thingA, $scope.data.which.question, $scope.data.which.thingB];


  $scope.cardPartialSwipe = function(amt) {
    var threshold = .15;
    if (amt < 0 - threshold) {
      $scope.data.cardSrc = $scope.data.which.thingA;
    } else if (amt > threshold) {
      $scope.data.cardSrc = $scope.data.which.thingB;
    } else {
      $scope.data.cardSrc = '';
    }
  };

  $scope.back = function() {
    $state.go('app.whichesByUser');
  }

  $scope.originalData = angular.copy($scope.data);

  $scope.$on('clear', function(event, state) {
    if (state === 'app.whichesByUser')
      $scope.data = angular.copy($scope.originalData);
  });
});
