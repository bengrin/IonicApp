angular.module('which.controllers.login', ['which.factory', 'ionic.contrib.ui.tinderCards'])


.controller('LoginCtrl', function($scope, $ionicHistory, $state, User) {

  $scope.data = {
    username: '',
    password: '',
    message: ''
  };

  $scope.login = function() {
    User.login($scope.data).then(function(response) {
      if(response.id !== undefined) {
        $state.go('app.tagView');
      } else {
        $scope.data.message = 'Incorrect credentials';
      }
    });

  }

  $scope.originalData = angular.copy($scope.data);

  $scope.$on('clear', function(event, state) {
    if (state === 'app.login')
      $scope.data = $scope.originalData;
  });

  $scope.goToSignUp = function() {
    $state.go('app.signUp')
  }
});
