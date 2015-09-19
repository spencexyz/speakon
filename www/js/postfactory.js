'use strict';

angular.module('starter.services', ["firebase"]).factory('Post', function ($firebaseObject, $firebaseArray) {
	var ref = new Firebase('https://speakon.firebaseio.com/');
	var posts = $firebaseArray(ref.child('posts'));

	var Post = {
		all: posts,
		create: function (post) {
			return posts.$add(post);
		},
		get: function (postId) {
			return $firebaseObject(ref.child('posts').child(postId));
		},
		delete: function (post) {
			return posts.$remove(post);
		}
	};

  return Post;
});