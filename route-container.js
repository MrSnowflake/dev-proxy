"use strict"

var fs = require('fs');

module.exports = () => {
	let routeDomains = {};
	let routesById = {};
	let maxId = 0;
	
	const isNumber = n => {
		return !isNaN(parseFloat(n)) && isFinite(n);
	};

	const isValidRoute = route => {
		return !!route && route.path && route.localPath && route.domain;
	};

	const mergeRoute = (routeId, route) => {
		let oldRoute = routesById[routeId];

		route.path = route.path || oldRoute.path;
		route.localPath = route.localPath || oldRoute.localPath;
		route.domain = route.domain || oldRoute.domain;

		return route;
	};

	const getRoutesFor = route => {
		let routes = {};
		if (routeDomains.hasOwnProperty(route.domain)) {
			routes = routeDomains[route.domain];
		} else {
			routeDomains[route.domain] = routes;
		}

		return routes;
	};

	const routeExists = route => {
		let routes = getRoutesFor(route);
		return routes.hasOwnProperty(route.path);
	};

	let self = {
		open: (filename) => {
			if (!filename)
				throw 'Add the filename as parameter ' + filename;

			routeDomains = JSON.parse(fs.readFileSync(filename, 'utf8'));

			// fix routesById
			for (let domain in routeDomains) {
				if (!(routeDomains.hasOwnProperty(domain)))
					continue;

				var routeWithDomain = routeDomains[domain];
				for (let path in routeWithDomain) {
					if (!(routeWithDomain.hasOwnProperty(path)))
						continue;

					let route = routeWithDomain[path];

					routesById[route.id] = route;
				}
			}
		},
		save: (filename) => {
			if (!filename)
				throw 'Add the filename as parameter'

			fs.writeFileSync(filename, JSON.stringify(routeDomains, null, 2) , 'utf-8');
		},
		add: route => {
			if (!isValidRoute(route))
				throw "Invalid route";
			else if (routeExists(route))
				throw 'Route already exists';

			let routes = getRoutesFor(route);

			route.id = maxId;
			routes[route.path] = route;
			routesById[maxId] = route;

			maxId++;
		},
		put: (routeId, route) => {
			let oldRoute = routesById[routeId];

			route = mergeRoute(routeId, route);

			if (!isValidRoute(route))	
				throw "Invalid route";
			
			let routes = getRoutesFor(route);

			delete routes[oldRoute.path];

			route.id = oldRoute.id;
			routes[route.path] = route;
			routesById[route.id] = route;
		},
		get: route => {
			if (!route) {
				return routesById;
			}
			return routesById[route];
		},
		getForDomain: domain => {
			return routeDomains[domain];
		},
		delete: routeId => {
			if (!self.hasRoute(routeId))
				throw 'Route not found';

			let route = routesById[routeId];

			var routes = routeDomains[route.domain];
			delete routes[route.path];
			if (route.length === 0)
				delete routeDomains[route.domain];

			delete routesById[routeId];
		},
		hasRoute: route => {
			if (isNumber(route))
				return !!routesById[route];
			else
				return routeExists(route);
		}
	};

	return self;
};