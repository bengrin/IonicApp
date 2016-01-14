/**
 * Created by VaibhavNamburi on 12/01/2016.
 */

angular.module('which.cloudinaryFactory', []).factory('ImageUploadService', ius);

/*
*Promise is generated and returned with the local Image URL and additional data
 NB the cloudinary account does not receive an API because the current approach uses a direct upload method from angular
 Authentication has been disabled from cloudinary's side
 */

function ius($q, $ionicLoading, $cordovaFileTransfer) {
  var service = {};
  service.uploadImage = uploadImage;
  return service;
  function uploadImage(imageURI) {
    var deferred = $q.defer();
    var fileSize;
    var percentage;
    // Find out how big the original file is
    window.resolveLocalFileSystemURL(imageURI, function(fileEntry) {
      fileEntry.file(function(fileObj) {
        fileSize = fileObj.size;
        // Display a loading indicator reporting the start of the upload
        $ionicLoading.show({template : 'Uploading Picture : ' + 0 + '%'});
        // Trigger the upload
        uploadFile();
      });
    });

    function uploadFile() {
      // Add the Cloudinary "upload preset" name to the headers
      var uploadOptions = {
        params : {
          'cloud_name' : 'veebuv',
          'upload_preset': 'fotoload'
        }
      };
      $cordovaFileTransfer
      // Your Cloudinary URL will go here
        .upload('https://api.cloudinary.com/v1_1/veebuv/image/upload', imageURI, uploadOptions)

        .then(function(result) {
          // Let the user know the upload is completed
          $ionicLoading.show({template : 'Upload Completed', duration: 1000});
          // Result has a "response" property that is escaped
          // FYI: The result will also have URLs for any new images generated with
          // eager transformations
          var response = JSON.parse(decodeURIComponent(result.response));
          deferred.resolve(response);
        }, function(err) {
          // Uh oh!
          $ionicLoading.show({template : 'Upload Failed', duration: 3000});
          deferred.reject(err);
        }, function (progress) {
          // The upload plugin gives you information about how much data has been transferred
          // on some interval.  Use this with the original file size to show a progress indicator.
          percentage = Math.floor(progress.loaded / fileSize * 100);
          $ionicLoading.show({template : 'Uploading Picture : ' + percentage + '%'});
        });
    }
    return deferred.promise;
  }
}
