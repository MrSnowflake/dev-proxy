"use strict"

exports['test RouteContainer#add'] = function(beforeExit, assert) {
	let routeContainer = require('../route-container.js')();

    assert.eql(false, routeContainer.hasRoute(0));

    routeContainer.add({
    	path: '/js/*',
    	localPath: 'local/path/',
    	domain: 'google.com'
    });

    assert.ok(routeContainer.hasRoute(0));
};

exports['test RouteContainer#put'] = function(beforeExit, assert) {
	let routeContainer = require('../route-container.js')();

    assert.eql(false, routeContainer.hasRoute(0));

    routeContainer.add({
    	path: '/js/*',
    	localPath: 'local/path/',
    	domain: 'google.com'
    });

    assert.eql(true, routeContainer.hasRoute(0));

    routeContainer.put(0, {
    	path: '/css/*',
    	localPath: 'local/path/',
    	domain: 'google.com'
    });
    
    assert.ok(routeContainer.hasRoute(0));
};

exports['test RouteContainer#get'] = function(beforeExit, assert) {
	let routeContainer = require('../route-container.js')();

    assert.eql(false, routeContainer.hasRoute(0));

    routeContainer.add({
    	path: '/js/*',
    	localPath: 'local/path/',
    	domain: 'google.com'
    });

    let route = routeContainer.get(0);

    assert.eql('google.com', route.domain);

    assert.eql(true, routeContainer.hasRoute(0));

    routeContainer.put(0, {
    	path: '/css/*',
    	localPath: 'local/path/',
    	domain: 'google.be'
    });
	
	route = routeContainer.get(0);

    assert.eql('google.be', route.domain);
    
    assert.ok(routeContainer.hasRoute(0));
};

exports['test RouteContainer#get multiple'] = function(beforeExit, assert) {
	let routeContainer = require('../route-container.js')();

    assert.eql(false, routeContainer.hasRoute(0));

    routeContainer.add({
    	path: '/js/*',
    	localPath: 'local/path/',
    	domain: 'google.com'
    });

    assert.throws(() => {
	    routeContainer.add({
	    	path: '/js/*',
	    	localPath: 'local/path/',
	    	domain: 'google.com'
	    });
    });
    assert.eql(false, routeContainer.hasRoute(1));

    let route = routeContainer.get(0);

    assert.eql('google.com', route.domain);

    assert.eql(true, routeContainer.hasRoute(0));

    routeContainer.put(0, {
    	path: '/css/*',
    	localPath: 'local/path/',
    	domain: 'google.be'
    });
	
	route = routeContainer.get(0);

    assert.eql('google.be', route.domain);
    
    assert.ok(routeContainer.hasRoute(0));
};

exports['test RouteContainer#delete'] = function(beforeExit, assert) {
    let routeContainer = require('../route-container.js')();

  	assert.eql(false, routeContainer.hasRoute(0));

	routeContainer.add({
    	path: '/js/*',
    	localPath: 'local/path/',
    	domain: 'google.com'
    });

	routeContainer.add({
    	path: '/css/*',
    	localPath: 'local/path/',
    	domain: 'google.com'
    });

    assert.eql(true, routeContainer.hasRoute(0));

    routeContainer.delete(0);

	assert.ok(!routeContainer.hasRoute(0));
};
