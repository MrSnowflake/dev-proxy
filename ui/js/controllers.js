(function(angular, undefined) {
angular.module('DevProxy.controllers', ['ngMaterial'])

.controller('RouterController', function($scope, $mdDialog, $mdMedia, Routes, Router) {
	var NEW = 'new';
	var EDIT = 'edit';

	$scope.router = Router.get();
	$scope.routes = Routes.query();

	$scope.changeRouterState = function() {
		Router.save($scope.router, function() {
			$scope.router = Router.get();
		});
	};

	$scope.remove = function(route, $event) {
		Routes.remove(route, function() {
			$scope.routes = Routes.query();
		});
		$event.cancelBubble = true;
		$event.returnValue = false;
	};

	function DialogController($scope, $mdDialog, route) {
		$scope.hasRoute = !!route;
		$scope.route = route;

		if (route) 
			$scope.title = 'New Route';
		else
			$scope.title = 'Edit Route';

		$scope.hide = function() {
			$mdDialog.hide();
		};
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.add = function() {
			console.log($scope.route);

			if (hasRoute)
				Routes.update($scope.route);
			else
				Routes.save($scope.route);

			$mdDialog.hide();
		};
	}

	$scope.editRoute = function(route, ev) {
		openRouteDialog(ev, route);
	};

	$scope.addRoute = function(ev) {
		openRouteDialog(ev);
	};

	function openRouteDialog(ev, route) {
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
		$mdDialog.show({
				controller: DialogController,
				templateUrl: 'addroute.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				fullscreen: useFullScreen,
				locals: {
					route: route
				},
				controller: DialogController
			})
			.then(function() {
				$scope.routes = Routes.query();
			});
		$scope.$watch(function() {
			return $mdMedia('xs') || $mdMedia('sm');
		}, function(wantsFullScreen) {
			$scope.customFullscreen = (wantsFullScreen === true);
		});
	};
});
})(angular);