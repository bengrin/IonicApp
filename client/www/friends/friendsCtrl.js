angular.module('which.controllers.friends', ['which.factory', 'ionic.contrib.ui.tinderCards'])


.controller('FriendsCtrl', function($scope, $ionicHistory, $state, User) {

  // $scope.message= undefined; 



  var getPotentialFriends= function () {
    User.getUsers()
      .then(function (response) {
        $scope.users= response; 
      })
  }

  getPotentialFriends(); 


  $scope.addFriend= function (friendName) {
    User.addFriend(friendName)
      .then(function (response) {
        if(response.status===200){ 
          $scope.message= 'Successfully added!'
        } 
      })
  }


  $scope.getFriendsWiches= function () {
    User.getFriendsWiches()
      .then (function (friendsWiches){
        console.log('friends wiches', friendsWiches); 
        $scope.friendsWiches= friendsWiches;
      })
  }

 
  
});