'use strict';

angular.module('starter', []).filter('timeago', function() {
  return function(input) {
  	var out = input - 100;
    return out
  };
});