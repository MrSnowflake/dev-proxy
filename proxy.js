"use strict"

var fs = require('fs');
var path = require('path');
let hoxy = require('hoxy');
let proxyServer = hoxy.createServer();

console.log('starting');

let routeContainer = require('./route-container.js')();

const getFilename = path => {
	let segments = path.split('/');
	return segments[segments.length - 1];
}

let setupProxy = () => {
	let proxy = proxyServer.listen(8888, () => {
	  console.log('Proxy listening on port 8888!');
	});
	proxy.intercept({
		phase: 'response'
	}, function(req, resp, cycle) {
		//console.log(req);
		
		let domainRoutes = routeContainer.getForDomain(req.hostname);
		
		if (domainRoutes) {
			console.log('domainRoutes', req.hostname, domainRoutes);
			for (var routePath in domainRoutes) {
				var route = domainRoutes[routePath];
				if (domainRoutes.hasOwnProperty(routePath) && req.url.match(route.path).length > 0) {
					let filename = getFilename(req.url);
					let file = path.join(route.localPath, filename);

					console.log('send', file);
					
					fs.readFile(file, { encoding: 'utf-8' }, (err,data) => {
						if (!err) {
							resp.string = data;
						} else {
							console.log(err);
						}
					});
				}
			}
		}
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
	let routes = routeContainer.get();

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
	
	routeContainer.add(newRoute);

	res.status(201).send({message:'Created'});
});

app.put('/routes/:id', function (req, res) {
	let newRoute = req.body;
	
	res.type('json');
	
	routeContainer.put(req.params.id, newRoute);

	res.status(200).send({message:'Ok'});
});

app.delete('/routes/:id', function (req, res) {
	let newRoute = req.body;
	
	res.type('json');
	
	routeContainer.delete(newRoute);

	res.status(201).send({message:'deleted'});
});

setupProxy();

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
