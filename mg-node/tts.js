
require('./trevor');

var http   = require('http');
var server = http.createServer( function( req, res ) {
        res.writeHead( 200, { 'Content-Type' : 'text/plain' } );

        res.write( trevor.say() );

        trevor.oauth();



        res.end();

        // Post-disconnect
        setTimeout( function() {
            console.log("Client has disconnected here");
        }, 1000 );

} ).listen(8000);
