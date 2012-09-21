
var OAuth = require('./oauth/oauth').OAuth;

var ePatient = exports.ePatient = {}; 

ePatient.Server = {

        start : function() {
            var http   = require('http');
            var server = http.createServer( function( req, res ) {
                    res.writeHead( 200, { 'Content-Type' : 'json/application' } );

                    // Work
                    
                    ePatient.OAuth.requestToken();


                    res.end();

                    setTimeout( function() {
                    }, 1000 );

            } ).listen(8000);
        }
};

ePatient.OAuth = function() {

    var buildOa = function() {
        return new OAuth(
            "http://www.bluecorral.com/oauth/example/request_token.php",
            "http://www.bluecorral.com/oauth/example/access_token.php",
            "key",
            "secret",
            "1.0",
            null,
            "HMAC-SHA1"
        );
    };
    
   return {
        requestToken : function() {
            buildOa().getOAuthRequestToken( function ( error, token, secret, results ) {
                if ( ! token || ! secret || error ) {
                    ePatient.Response.errors.push("Error when requesting OAuth token");
                    console.log( error || 'No error object' );
                }
            } );
        }
   };
}();

ePatient.Response = {
    errors : []
};
