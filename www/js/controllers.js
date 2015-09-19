// This file contains controllers for the pages/tabs of the app

angular.module('starter.controllers', [])

// Controller for info page has no functionality
.controller('InfoCtrl', function($scope) {})

// Controller for page with list of beacons
.controller('BeaconsCtrl', function($scope, $rootScope, Beacons, $state, $ionicHistory, $timeout) {

	function startRanging() {
		Beacons.stopRangingBeacons();
		Beacons.startRangingBeacons(beaconsRanged, rangingError);
	}

	function beaconsRanged(beacons) {
		// Update beacon list.
		$scope.$apply(function() {
			$scope.beacons = beacons;
		});

		$scope.distance = beacons[0].distance;
		// Update detail view.
		$rootScope.theDetailScopeUpdateFun && $rootScope.theDetailScopeUpdateFun();

		//this code changes the state based on how far away the beacon is
		//TODO create a homescreen where you first land while the app checks distance
		if($scope.distance) {
			var currentView = $ionicHistory.currentView();
			if(currentView.stateId === "welcome"){
				function changeState() {$state.go('tab.beacons')};

				$timeout(changeState, 5000);
			}
		}
	}

	function rangingError(error) {
		console.log('rangingError ' + error)
	}

	// Use 'deviceready' event to make sure plugins have loaded
	// before starting ranging for beacons.
	document.addEventListener('deviceready', startRanging, false);
})

.controller('PostsCtrl', function($scope, Post, $timeout, $location, GetUU) {
	$scope.posts = Post.all;
	$scope.post = {message: '', timestamp: Firebase.ServerValue.TIMESTAMP};

	$scope.loading = false;

	$scope.submitPost = function () {
		$scope.loading = true;
		Post.create($scope.post).then(function() {
			$scope.post = {message: '', timestamp: Firebase.ServerValue.TIMESTAMP};

			var hideSpinner = function() {
				$scope.loading = false;
			}

			$timeout(hideSpinner, 1000);
   		});
    };

	// init variables
	$scope.data = {};
	$scope.obj;
	var pictureSource;   // picture source
	var destinationType; // sets the format of returned value
	var url;
	
	// on DeviceReady check if already logged in (in our case CODE saved)
	ionic.Platform.ready(function() {
		//console.log("ready get camera types");
		if (!navigator.camera)
			{
			// error handling
			return;
			}
		//pictureSource=navigator.camera.PictureSourceType.PHOTOLIBRARY;
		pictureSource=navigator.camera.PictureSourceType.CAMERA;
		destinationType=navigator.camera.DestinationType.FILE_URI;
		});
	
	// get upload URL for FORM
	GetUU.query(function(response) {
		$scope.data = response;
		//console.log("got upload url ", $scope.data.uploadurl);
		});
	
	// take picture
	$scope.takePicture = function() {
		//console.log("got camera button click");
		var options =   {
			quality: 50,
			destinationType: destinationType,
			sourceType: pictureSource,
			encodingType: 0
			};
		if (!navigator.camera)
			{
			// error handling
			return;
			}
		navigator.camera.getPicture(
			function (imageURI) {
				//console.log("got camera success ", imageURI);
				$scope.mypicture = imageURI;
				},
			function (err) {
				//console.log("got camera error ", err);
				// error handling camera plugin
				},
			options);
		};

	// do POST on upload url form by http / html form    
	$scope.update = function(obj) {
		if (!$scope.data.uploadurl)
			{
			// error handling no upload url
			return;
			}
		if (!$scope.mypicture)
			{
			// error handling no picture given
			return;
			}
		var options = new FileUploadOptions();
		options.fileKey="ffile";
		options.fileName=$scope.mypicture.substr($scope.mypicture.lastIndexOf('/')+1);
		options.mimeType="image/jpeg";
		var params = {};
		params.other = obj.text; // some other POST fields
		options.params = params;
		
		//console.log("new imp: prepare upload now");
		var ft = new FileTransfer();
		ft.upload($scope.mypicture, encodeURI($scope.data.uploadurl), uploadSuccess, uploadError, options);
		function uploadSuccess(r) {
			// handle success like a message to the user
			}
		function uploadError(error) {
			//console.log("upload error source " + error.source);
			//console.log("upload error target " + error.target);
			}
		};
})

.controller('FeedCtrl', function($scope, Post) {
	$scope.posts = Post.get();

})


; // End of angular.module
