/**
 * Created by VaibhavNamburi on 11/01/2016.
 */
angular.module('which.controllers.which', ['which.factory', 'ionic.contrib.ui.tinderCards'])


.controller('WhichCtrl', function($scope, $state, $stateParams, WhichFactory) {
  $scope.data = {
    username: window.localStorage.getItem('which.userToken'),
    activeSlide: 1,
    which: {
      id: $stateParams.id,
      question: $stateParams.question,
      thingA: $stateParams.thingA,
      thingB: $stateParams.thingB
    },
    cardSrc: ''
  };

  $scope.data.choice = '';
  //TODO: fix this
  $scope.data.type = ($scope.data.which.thingA.substring(0,4) === 'http')?'image':'text'
  $scope.data.things = [$scope.data.which.thingA, $scope.data.which.question, $scope.data.which.thingB];


  $scope.cardPartialSwipe = function(amt) {
    var threshold = .15;
    if (amt < 0 - threshold) {
      $scope.data.cardSrc = $scope.data.which.thingA;
      $scope.data.choice = 'a';
    } else if (amt > threshold) {
      $scope.data.cardSrc = $scope.data.which.thingB;
      $scope.data.choice = 'b';
    } else {
      $scope.data.cardSrc = '';
    }
  };

  $scope.showThumbnails = function () {
    $scope.data.cardSrcA = $scope.data.which.thingA;
    $scope.data.cardSrcB = $scope.data.which.thingB;

    // have possible else to show nothing when screen is reloaded
  };

  //This gets called when the user swipes, making a decision with the choice from the user
  $scope.decide = function() {
    WhichFactory.choose($scope.data.choice, $scope.data.which.id, $scope.data.username).then(function(votingResult) {
      console.log(votingResult);
      analytics.track('Decide', {
        cardSrc: $scope.data.cardSrc,
        choice: $scope.data.choice,
        whichId: $scope.data.which.id,
        whichQuestion: $scope.data.which.id,
        whichThingA: $scope.data.which.thingA,
        whichThingB: $scope.data.which.thingB,
        votingResult: votingResult
      });

      //Allows for state change, showing new view, second argument is the params being sent in to display results
      $state.go('app.result', {
        a: votingResult.votesForA,
        b: votingResult.votesForB,
        choice: $scope.data.choice
      });
    });

  }

  $scope.originalData = angular.copy($scope.data);

  $scope.$on('clear', function(event, state) {
      $scope.data = angular.copy($scope.originalData);
  });
})
