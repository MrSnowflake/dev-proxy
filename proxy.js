var fs = require('fs');
var path = require('path');
var hoxy = require('hoxy');
var proxy = new hoxy.Proxy().listen(8080);

var filePath = '/Users/maarten.krijn/amplexor/Projects/GEA/';

console.log('starting');

proxy.intercept({
		phase: 'response',
		fullUrl: 'http://preview-gea.dev.amplexor.com/js/*',
		as: 'string'
	}, function(req, response, done) {
		var file = path.join(filePath, req.url);
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
);