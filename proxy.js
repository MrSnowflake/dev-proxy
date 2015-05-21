var fs = require('fs');
var path = require('path');
var hoxy = require('hoxy');
var proxy = new hoxy.Proxy().listen(8080);

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

function route(item) {
	proxy.intercept({
			phase: 'response',
			fullUrl: item.path,
			as: 'string'
		}, action(item)
	);
}

console.log('starting');
for (var index = 0; index < config.length; index++) {
	var configItem = config[index];
	
	route(configItem);
}
