'use strict';

app.controller('PostsCtrl', function ($scope, Post) {
  $scope.posts = Post.all;

  $scope.post = {message: ''};

  $scope.submitPost = function () {
	Post.create($scope.post).then(function () {
		$scope.post = {message: ''};
    });
  };

});