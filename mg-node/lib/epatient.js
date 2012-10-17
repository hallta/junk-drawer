
var xml      = require('./xml2json.js');
var OAuth    = require('./oauth/oauth').OAuth;
var ePatient = exports.ePatient = {}; 

ePatient.OAuth = function() {

    var buildOa = function() {
        var o = new OAuth(
            "http://localhost:8001/oauth/example/request_token.php",
            "http://localhost:8001/oauth/example/access_token.php",
            "key",
            "secret",
            "1.0",
            null,
            "HMAC-SHA1"
        );

        return o;
    };
    
   return {
        requestToken : function() {
            buildOa().getOAuthRequestToken(
                function ( error, token, secret, results, data ) {
                    console.log( [ data, xml.xml2json.xml2json( xml.xml2json.parse('<e></e>') ) ] );
                    if ( ! token || ! secret || error ) {
                        ePatient.Response.errors.push("Error when requesting OAuth token");
                        console.log( error || 'No error object' );
                    }
                }
            );
        }
   };
}();

ePatient.Response = {
    errors : []
};

