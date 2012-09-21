
var querystring = require('querystring');
var http        = require('http');

exports.OAuth = require("./node-oauth/oauth").OAuth;

trevor = {
    oauth : function() {
    },

    say : function() {   
        return 'Trevor says so!';
    },

    ping : function(data) {
        data = querystring.stringify(data);

        require('http').get(
            {
                host : 'localhost',
                port : 8000
            },
            function(res) {
                console.log(res.headers);
            }
        );
    },
};

/*
# sub _make_request {
#     my ( $self, $req ) = @_;
# 
#     $req = $self->_build_oauth( $req, ( ( $req->{'request_url'} eq '/app/auth' ) ? TOKEN : REQUEST ) );
#     $req->sign();
# 
#     my $res = $self->ua()->request( HTTP::Request->new( 'POST', my $url = $req->to_url() ) );
# 
#     if ( $res->is_success() ) {
#         return $self->_response( XMLin( $self->_raw_content( $res->content() ) ) );
#     }
#     else {
#         croak( $res->status_line() . ' @ ' . $req->{'request_url'} );
#     }
# }
# 
# sub _build_oauth {
#     my ( $self, $request, $type ) = @_;
# 
#     return Net::OAuth->request($type)->new(
#         %$request,
#         'consumer_key'     => $self->key(),
#         'consumer_secret'  => $self->secret(),
#         'request_method'   => 'POST',
#         'nonce'            => crypt( rand(), rand() ),
#         'request_url'      => $self->host() . $request->{'request_url'},
#         'signature_method' => 'HMAC-SHA1',
#         'timestamp'        => time,
#     );
# }
# 
*/
