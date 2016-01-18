
angular.module('user.factory', [])

.factory('User', function($http, $state, $ionicHistory) {

  var loggedIn = false;


  // var apiUrl = 'http://whichwhich.herokuapp.com'

  var apiUrl= 'http://localhost:3000'; 


  /*
   * Sends login credentials from submit form to server
   * Based on response, function enables login session and sets token in localStorage
   * Setting historyRoot to true, creates a clean history path for current view
   */

  var login = function(credentials) {
    return $http.post(apiUrl + '/api/user/login', credentials)
      .then(function(response) {
        if (response.data.id !== undefined) {
          loggedIn = true;
          window.localStorage.setItem('which.userToken', response.data.id);
          window.localStorage.setItem('which.username', credentials.username);
          $ionicHistory.nextViewOptions({
            historyRoot: true
          })
          analytics.identify(response.data.id, {
            username: credentials.username
          });
         analytics.track('Logged in', {
            username: credentials.username
          });
        }
        return response.data;
      }, function(err) {
        return err;
      })
  };

  /*
   * Sends signUp credentials from submit form to server
   */

  var signUp = function(credentials) {
    return $http.post(apiUrl + '/api/user/signup', credentials)
      .then(function(response) {
        if (response.data.id !== undefined) {
          loggedIn = true;
          window.localStorage['which.userToken'] = response.data.id;
          $ionicHistory.nextViewOptions({
            historyRoot: true
          });
          analytics.identify(response.data.id, {
            username: credentials.username
          });
         analytics.track('Signed Up', {
            username: credentials.username,
            createdAt: Date.now()
          });
        }
        return response.data;

      }, function(err) {
        return err;
      })

  };

  /*
   * Returns login status
   */

  var isloggedIn = function() {
    return loggedIn;
  }

  /*
   * Deletes current session on device
   */

  var signOut = function() {
    loggedIn = false;
    window.localStorage.removeItem('which.userToken');
    $state.go('app.login');
  };

  /*



   * Gets all the other users, except for the currently logged in user
   */
   var getUsers = function() {
    return $http.get(apiUrl+ '/api/users', {params: {userId: window.localStorage['which.userToken'] }})
      .then(function(res) {
        return res.data;
      }); 
  };



   /*
   * Sends friend username to be added to user's friends list
   */

  var addFriend= function (friend) {

    var data= {
      friend: friend,
      userId: window.localStorage['which.userToken']
    }
    return $http.post(apiUrl + '/api/user/friends', data)
      .then(function(response) {
        return response.data;
      }, function(err) {
        return err;
      })
  }

  var removeFriend= function (friendId) {

    var data= {
      friendId: friendId,
      userId: window.localStorage['which.userToken']
    }
    return $http.post(apiUrl + '/api/user/friend', data)
      .then(function(response) {
        return response.data;
      }, function(err) {
        return err;
      })
  }

  var getFriendsWiches= function () {
    return $http.get(apiUrl+ '/api/user/friends', {params: {userId: window.localStorage['which.userToken'] }})
      .then(function(res) {
        return res.data;
      });
  }

  return {
    isloggedIn: isloggedIn,
    signUp: signUp,
    login: login,
    signOut: signOut,
    getUsers: getUsers,
    addFriend: addFriend,
    getFriendsWiches: getFriendsWiches,
    removeFriend: removeFriend

  }

});
