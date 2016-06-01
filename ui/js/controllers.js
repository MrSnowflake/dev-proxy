angular.module('DevProxy.controllers', [])

.controller('RouterController', function($scope, Routes) {
  var NEW = 'new';
  var EDIT = 'edit';

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  /*
  $ionicModal.fromTemplateUrl('/templates/new-route.html', function(modal) {
    $scope.routeModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });*/

  $scope.routes = Routes.query();

  $scope.remove = function(route, $event) {
    Routes.remove(route, function() {
      $scope.routes = Routes.query();
    });
    $event.cancelBubble = true;
    $event.returnValue = false;
  };

  $scope.addRoute = function() {
    $scope.routeModal.mode = NEW;
    $scope.route = {};
    $scope.newRoute = {};
    $scope.routeModal.show();
  };

  $scope.edit = function(routeId) {
    Routes.get({ id: routeId }, function(route) {
      console.log(route);
      $scope.routeModal.mode = EDIT;
      $scope.route = angular.copy(route);
      $scope.newRoute = angular.copy(route);
      $scope.routeModal.show();
    });
  };

  $scope.createRoute = function(route) {
    var newRoute = {
      path: route.path,
      localPath: route.localPath,
      domain: route.domain
    };

    if ($scope.routeModal.mode == NEW)
      Routes.save(newRoute, function() {
          $scope.routes = Routes.query();
      });
    else {
      newRoute.id = route.id;
      Routes.update(newRoute, function() {
          $scope.routes = Routes.query();
      });
    }

    $scope.routeModal.hide();

    route.path = '';
    route.localPath = '';
    route.domain = '';
  };

  $scope.cancelRoute = function() {
    $scope.routeModal.hide();
  };
});
