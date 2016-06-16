//Lets require/import the HTTP module
var Q = require('q');
var http = require('http');
var Client = require('node-rest-client').Client;

var client = new Client();

function getHello() {
    var deferred = Q.defer();

    client.get("http://hello:8080", function(data, response) {
        deferred.resolve(data);
    });

    return deferred.promise;
}

function getWorld() {
    var deferred = Q.defer();

    client.get("http://world:8080", function(data, response) {
        deferred.resolve(data);
    });

    return deferred.promise;
}

//Lets define a port we want to listen to
const PORT = 8080;

//We need a function which handles requests and send response
function handleRequest(request, response) {
    var helloPromise = getHello();
    var worldPromise = getWorld();

    helloPromise
        .then(function(hData) {
            return worldPromise
                .then(function(wData) {
                    return hData + ' ' + wData;
                });
        })
        .then(function(data) {
            response.end(data);
        });
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function() {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
