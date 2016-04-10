"use strict"

var fs = require('fs');
var path = require('path');
let hoxy = require('hoxy');
let proxyServer = hoxy.createServer();

var filePath = '/Users/maarten.krijn/amplexor/Projects/GEA/';

var config = [
	{ path: 'http://preview-gea.dev.amplexor.com/js/*', localPath: '/Users/maarten.krijn/amplexor/Projects/GEA/'},
	{ path: 'http://preview-gea.dev.amplexor.com/css/*', localPath: '/Users/maarten.krijn/amplexor/Projects/GEA/'}
];

function action(item) {
	return function(req, response, done) {
		var file = path.join(item.localPath, req.url);
		console.log('send', file);
		fs.readFile(file, {encoding: 'utf-8'}, function(err,data){
			if (!err) {
				response.string = data;
			} else {
				console.log(err);
			}
			done();
		});
	}
}

console.log('starting');

let setupProxy = function() {
	let proxy = proxyServer.listen(8888,function () {
	  console.log('Proxy listening on port 8888!');
	});
	proxy.intercept({
		phase: 'response'
	}, function(req, resp, cycle) {
		console.log(req);
	});
};

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var routes = {};
var routesByPath = {};
var maxId = 0;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/routes', function (req, res) {
	let routesArray = [];

	for (var route in routes) {
	    if (routes.hasOwnProperty(route)) {
	        routesArray.push(routes[route]);
	    }
	}
	
	res.send(routesArray);
});

/*
409 Conflict
403 Forbidden
*/
app.post('/routes', function (req, res) {
	let newRoute = req.body;
	
	res.type('json');
	
	if (!newRoute.path || !newRoute.localPath) {
		let error = {};
		error.message = "Invalid route. Provide all fields.";
		res.status(403).send(error);
		return;
	} else if (routesByPath[newRoute.path]) {
		let error = {};
		error.message = "Route already exists. If updating use PUT.";
		res.status(409).send(error);
		return;
	}

	newRoute.id = maxId;
	console.log(newRoute);
	routes[maxId] = newRoute;
	routesByPath[newRoute.path] = newRoute;

	maxId++;
	
	route(newRoute);

	res.status(201).send({message:'Created'});
});

let isValidRoute = function(route) {
	return route.path && route.localPath && route.domain;
}

app.put('/routes/:id', function (req, res) {
	let newRoute = req.body;
	
	res.type('json');
	
	if (!isValidRoute(newRoute)) {
		let error = {};
		error.message = "Invalid route. Provide all fields.";
		res.status(403).send(error);
		return;
	} else if (!routes[req.params.id]) {
		let error = {};
		error.message = "Route not found.";
		res.status(404).send(error);
		return;
	}

	let oldRoute = routes[req.params.id];

	newRoute.id = parseInt(req.params.id);
	console.log(newRoute);
	routes[req.params.id] = newRoute;
	delete routesByPath[oldRoute.path];
	routesByPath[newRoute.path] = newRoute;

	route(newRoute);

	res.status(200).send({message:'Ok'});
});

app.delete('/routes/:id', function (req, res) {
	let newRoute = req.body;
	
	res.type('json');
	
	if (!routes[req.params.id]) {
		let error = {};
		error.message = "Route not found.";
		res.status(404).send(error);
		return;
	}

	let oldRoute = routes[req.params.id];
	delete routesByPath[oldRoute.path];
	delete routes[req.params.id];

	//delete route

	res.status(200).send({message:'Ok'});
});

setupProxy();

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
