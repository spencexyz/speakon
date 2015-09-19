// Ionic Starter App

// angular.module is a global place for creating, registering and
// retrieving Angular modules
// 'starter' is the name of this angular module example (also set
// in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

function onDeviceReady() {
    angular.bootstrap(document, ["starter"]);
}
//console.log("binding device ready");
// Registering onDeviceReady callback with deviceready event
document.addEventListener("deviceready", onDeviceReady, false);

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase', 'ngCordova'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this
		// to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
		// When run with iOS status bar hidden you need this.
		//ionic.Platform.fullScreen();
		//StatusBar.hide();
	});
})

.config(function($stateProvider, $urlRouterProvider) {
	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

	// Setup an abstract state for the tabs directive
	.state('tab', {
		url: "/tab",
		abstract: true,
		templateUrl: "templates/tabs.html"
	})

	// Tabs in the app; each tab has its own nav history stack

	.state('tab.info', {
		url: '/info',
		views: {
			'tab-info': {
				templateUrl: 'templates/tab-info.html',
				controller: 'PostsCtrl'
			}
		}
	})

	.state('tab.beacons', {
		url: '/beacons',
		views: {
			'tab-beacons': {
				templateUrl: 'templates/tab-beacons.html',
				controller: 'FeedCtrl'
			}
		}
	})

	.state('tab.beacon-detail', {
		url: '/beacons/:beaconId',
		views: {
			'tab-beacons': {
				templateUrl: 'templates/beacon-detail.html',
				controller: 'BeaconDetailCtrl'
			}
		}
	})

	.state('welcome', {
		url: '/welcome',
		templateUrl: 'templates/welcome.html',
		controller: 'BeaconsCtrl'
	})

	// If none of the above states are matched, use this as the default
	$urlRouterProvider.otherwise('/welcome');

})

; // End of angular.module

