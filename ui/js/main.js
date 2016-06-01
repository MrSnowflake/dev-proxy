angular.module('DevProxy',['ngMaterial'])
.controller('RouterController', function($scope) {
	$scope.routes = [{
		domain: 'www.cm.be',
		path: '/js/',
		localPath: '/Users/maarten.krijn/Private/Development/js'
	}]
});
