

var ePatient = require("./lib/epatient").ePatient;

var http   = require('http');
var server = http.createServer( function( req, res ) {
        res.writeHead( 200, { 'Content-Type' : 'json/application' } );

        ePatient.OAuth.requestToken();

        res.end();

} ).listen(8000);
