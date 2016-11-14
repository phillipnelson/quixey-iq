/*var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');

connect().use(serveStatic("./static")).listen(8080, function(){
    console.log('Server running on 8080...');
});

connect().use(serveStatic("./static")).listen(9090, function(){
    console.log('Server running on 9090...');
});

*/

var http = require("http"),
	https = require('https'),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    querystring = require('querystring');
    port = process.argv[2] || 8080;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd() + "/static", uri);

   if(uri == "/remote-request") {
   		var getArguments = url.parse(request.url).query;
   		if(typeof getArguments == "string") {
   			getArguments = querystring.parse(getArguments)
   		}
   		var serverResponse = response;
   		if("url" in getArguments) {
   			console.log("Requesting: " + getArguments["url"]);
   			try {
   			    https.get(getArguments["url"], function(response) {
			        var body = '';
			        response.on('data', function(d) {
			            body += d;
			        });
			        response.on('end', function() {
			        	serverResponse.writeHead(200);
		      			serverResponse.write(body);
		      			serverResponse.end();
			        });
			    });
   			}
   			catch(err) {
   				console.log("Failure: " + getArguments["url"]);
   			    response.writeHead(500, {"Content-Type": "text/plain"});
		        response.write(err + "\n");
		        response.end();
		        return;
   			}
			
		} else {
		  response.writeHead(404, {"Content-Type": "text/plain"});
	      response.write("404 Not Found\n");
	      response.end();
	      return;
		}
   } else {

	  fs.exists(filename, function(exists) {
	    if(!exists) {
	      response.writeHead(404, {"Content-Type": "text/plain"});
	      response.write("404 Not Found\n");
	      response.end();
	      return;
	    }

	    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

	    fs.readFile(filename, "binary", function(err, file) {
	      if(err) {        
	        response.writeHead(500, {"Content-Type": "text/plain"});
	        response.write(err + "\n");
	        response.end();
	        return;
	      }

	      response.writeHead(200);
	      response.write(file, "binary");
	      response.end();
	    });
	  });
	}
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");