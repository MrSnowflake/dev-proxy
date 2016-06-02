angular.module('DevProxy.services', ['ngResource'])
.factory('Routes', function($resource) {
	return $resource('http://localhost:3000/routes/:id', {id: '@id'}, {
		update: {
			method: 'PUT'
		}
	})
})
.factory('Router', function($resource) {
	return $resource('http://localhost:3000/router');
});
