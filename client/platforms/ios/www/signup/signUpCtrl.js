angular.module('which.controllers.signUp', ['which.factory', 'ionic.contrib.ui.tinderCards'])


.controller('signUpCtrl', function($scope, $ionicHistory, $state, User) {

  $scope.data = {
    username: '',
    password: '',
    message: ''
  };

  $scope.signUp = function() {
    User.signUp($scope.data).then(function(response) {
      if(response.id !== undefined) {
        $state.go('app.tagView');
      } else {
        $scope.data.message = 'Username is already taken.';
      }
    });
  }

  $scope.originalData = angular.copy($scope.data);

  $scope.$on('clear', function(event, state) {
    if (state === 'app.signUp')
      $scope.data = $scope.originalData;
  });

  $scope.goToLogin = function(){
    $state.go('app.login')
  }
});
