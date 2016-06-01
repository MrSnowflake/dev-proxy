angular.module('DevProxy.services', ['ngResource'])
.factory('Routes', function($resource) {
  return $resource('http://localhost:3000/routes/:id', {id: '@id'}, {
    update: {
      method: 'PUT'
    }
  });
  /*// Might use a resource here that returns a JSON array

  // Some fake testing data
  var lastId = 1;
  var routes = [{
    id: 0,
    path: 'aaaa',
    localPath: 'bbb'
  }];

  return {
    all: function() {
      var routes = $resource('http://localhost:3000/routes');
      return routes.get();
    },
    remove: function(route) {
      routes.splice(routes.indexOf(route), 1);
    },
    add: function(route) {
      route.id = lastId++;

      routes.push(route);
    },
    update: function(route) {
      for (var i = 0; i < routes.length; i++) {
        if (routes[i].id === route.id) {
          routes[i] = route;
          return;
        }
      }
    },
    get: function(routeId) {
      for (var i = 0; i < routes.length; i++) {
        if (routes[i].id === parseInt(routeId)) {
          return routes[i];
        }
      }
      return null;
    }
  };*/
});
