// This file contains controllers for the pages/tabs of the app

angular.module('starter.controllers', [])

// Controller for page with list of beacons
.controller('BeaconsCtrl', function($scope, $rootScope, Beacons, $state, $ionicHistory, $timeout, $ionicScrollDelegate) {

	var delegate = new cordova.plugins.locationManager.Delegate().implement({
		didRangeBeaconsInRegion: function (pluginResult) {
			// here you do what you like with beacons
			// the first one in the pluginResult.beacons array is the closest one
			var i, signalStrength = 0;
			for (i = 0; i < pluginResult.beacons.length; i++) {
				signalStrength = pluginResult.beacons[i].rssi;
				console.log(signalStrength, pluginResult.beacons[i].major, pluginResult.beacons[i].minor);
				if(beacons[i].major == 50887){
					$state.go('tab.beacons')
				}
			}
		}
	});

	function startRanging() {
		Beacons.stopRangingBeacons();
		Beacons.startRangingBeacons(beaconsRanged, rangingError);
	}

	$scope.scrollUp = function() {
		$ionicScrollDelegate.scrollTop();
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
		if($scope.distance < 0.2) {
			var currentView = $ionicHistory.currentView();
			if(currentView.stateId === "welcome"){
				function changeState() {$state.go('tab.beacons')};

				changeState();
			}
		}

		if($scope.distance > 0.2) {
			function changeState() {$state.go('tab.beacons')};

			$state.go('welcome');
		}
	}

	function rangingError(error) {
		console.log('rangingError ' + error)
	}

	// Use 'deviceready' event to make sure plugins have loaded
	// before starting ranging for beacons.
	document.addEventListener('deviceready', startRanging, false);
})

.controller('PostsCtrl', function($scope, Post, $timeout, $location, GetUU, $cordovaCamera, $ionicScrollDelegate) {
	$scope.posts = Post.all;
	$scope.post = {message: '', image: '', timestamp: Firebase.ServerValue.TIMESTAMP, randomIdentifier: ''};

	$scope.fakePerson = ['Guy in the blue', 'Girl with brown hair', 'Blonde haired individual behind you', 'Will Ferguson'];

	$scope.loading = false;

	// init variables
	$scope.data = {};
	$scope.obj;
	var pictureSource = Camera.PictureSourceType.CAMERA;   // picture source
	var destinationType = Camera.DestinationType.DATA_URL; // sets the format of returned value
	
	// on DeviceReady check if already logged in (in our case CODE saved)
	document.addEventListener("deviceready", function () {
	
		// take picture
		$scope.takePicture = function() {
	        var options = { 
	            quality : 75, 
	            destinationType : Camera.DestinationType.DATA_URL, 
	            sourceType : Camera.PictureSourceType.CAMERA, 
	            allowEdit : true,
	            encodingType: Camera.EncodingType.JPEG,
	            targetWidth: 300,
	            targetHeight: 300,
	            popoverOptions: CameraPopoverOptions,
	            saveToPhotoAlbum: false
	        };
 
	        $cordovaCamera.getPicture(options).then(function(imageData) {
	            $scope.post.image = "data:image/jpeg;base64," + imageData;
	        }, function(err) {
	            // An error occured. Show a message to the user
	        });
    	}
    });

	$scope.deletePicture = function() {
		$scope.post.image = '';
	};

	$scope.submitPost = function () {
		$scope.loading = true;
		var number = Math.floor(Math.random() * ($scope.fakePerson.length));
		$scope.post.randomIdentifier = $scope.fakePerson[number];

		Post.create($scope.post).then(function() {
			$scope.post = {message: '', image: '', timestamp: Firebase.ServerValue.TIMESTAMP, randomIdentifier: ''};
			var hideSpinner = function() {
				$scope.loading = false;
			}
   			$ionicScrollDelegate.scrollTop();
			$timeout(hideSpinner, 1000);
   		});
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
