"use strict"

var fs = require('fs');
var path = require('path');
let hoxy = require('hoxy');
let proxyServer = hoxy.createServer();

const VERSION = '0.1';
const BUILD = '0.1';

console.log('SnowProxy', 'V' + VERSION);

console.log('starting');

let routeContainer = require('./route-container.js')();

const getFilename = path => {
	let segments = path.split('/');
	let filename = segments[segments.length - 1];

	return filename.split('?')[0];
}

let setupProxy = () => {
	let proxy = proxyServer.listen(8888, () => {
	  console.log('Proxy listening on port 8888!');
	});
	proxy.intercept({
		phase: 'response'
	}, function(req, resp, cycle) {
		let domainRoutes = routeContainer.getForDomain(req.hostname);
		
		if (domainRoutes) {
			for (var routePath in domainRoutes) {
				var route = domainRoutes[routePath];
				if (domainRoutes.hasOwnProperty(routePath) && req.url.match(route.path).length > 0) {
					let filename = getFilename(req.url);
					let file = path.join(route.localPath, filename);

					try {
						fs.accessSync(file, fs.R_OK);

						return cycle.serve(file);
					} catch (e) {}
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
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
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

app.get('/routes/:id', function (req, res) {
	res.type('json');
	res.send(routeContainer.get(req.params.id));
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
	res.type('json');

	routeContainer.delete(req.params.id);

	res.status(201).send({message:'deleted'});
});

setupProxy();

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
