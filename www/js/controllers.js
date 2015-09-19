// This file contains controllers for the pages/tabs of the app

angular.module('starter.controllers', [])

// Controller for info page has no functionality
.controller('InfoCtrl', function($scope) {})

// Controller for page with list of beacons
.controller('BeaconsCtrl', function($scope, $rootScope, Beacons, $state, $ionicHistory, $timeout) {

	ionic.Platform.ready(function() {
    	// hide the status bar using the StatusBar plugin
   		// StatusBar.hide();
	});

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

.controller('PostsCtrl', function($scope, Post, $timeout) {
	hyper.log('calling postctrl');
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
})

.controller('FeedCtrl', function($scope, Post) {
	$scope.posts = Post.get();

})


; // End of angular.module
