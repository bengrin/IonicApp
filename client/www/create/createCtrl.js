angular.module('which.controllers.create', ['which.factory', 'ionic.contrib.ui.tinderCards','ngFileUpload'])

.controller('CreateCtrl', function($scope, $state, WhichFactory,$cordovaImagePicker,$ionicPlatform,ImageUploadService) {
  //sets the options for the "Media Type" drop-down
  $scope.items = [{
    id: 1,
    label: 'Image'
  }, {
    id: 2,
    label: 'Text'
  }];

  $scope.data = {
    mediaType: $scope.items[0],
    question: '',
    thingA: '',
    thingB: '',
    tags: ''
  }

  //Submission of Which with input details
  $scope.submit = function() {

    var which = {
      question: $scope.data.question,
      createdBy: window.localStorage.getItem('which.userToken'),
      tags: $scope.data.tags.split(' '),
      type: $scope.data.mediaType.label.toLowerCase(),
      thingA: $scope.data.thingA,
      thingB: $scope.data.thingB
    }

    WhichFactory.submit(which);

    //Landing page after submission
    $state.go('app.afterCreate');
  }

  $scope.originalData = angular.copy($scope.data);

  $scope.$on('clear', function(event, state) {
    if (state === 'app.create')
      $scope.data = $scope.originalData;
  });


  $scope.collection = {
    selectedImage : []
  };

  /*
  IonicPlatform.ready ensures that the application is fully booted and ready prior to getting access to native features
  $cordovaImagePicker gives access to the gallery and on confirmation returns an array of rooth paths to the image
   */


  $ionicPlatform.ready(function() {

    $scope.getImage = function() {
      // Image picker will load images according to these settings
      var options = {
        maximumImagesCount: 2, // Max number of selected images
        width: 800,
        height: 800,
        quality: 80            // Higher is better
      };

      $cordovaImagePicker.getPictures(options).then(function (results) {
        //If repeated selection, set the scope to an empty array
        $scope.collection.selectedImage = [];

        // Loop through acquired images
        for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          $scope.collection.selectedImage.push(results[i]);   // We load only one image so we can use it like this

          uploadFiles(results[i])
        }

      }, function(error) {
        console.log('Error: ' + JSON.stringify(error));    // In case of error
      });
    };

  });

  /*
  Service function that returns a promise and assigns generated URLS to thingA || thingB
   */

  function uploadFiles(imageData){


    ImageUploadService.uploadImage(imageData).then(
      function(result) {


        var urlSmall;

        if(result && result.secure_url) urlSmall = result.secure_url || '';

        console.log('successful image upload',urlSmall)
        //$scope.urlCollection.push(urlSmall)
        if(!$scope.data.thingA){
          $scope.data.thingA = urlSmall
          console.log('thingA',$scope.data.thingA)
        }
        else if(!$scope.data.thingB){
          $scope.data.thingB = urlSmall
          console.log('thingB',$scope.data.thingB)
        }
      },
      function(err) {

        console.dir(err)

      })
  }


})

