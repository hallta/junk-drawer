
var http   = require('http');
var server = http.createServer( function( req, res ) {

    console.log(req.headers);


    res.writeHead( 200, { 'Content-Type':'json/application' } );
    res.write(
        JSON.stringify(
            {
                foo : 'bar',
            },
            null,
            4
        )
    );
    res.end();

} ).listen(8001);
