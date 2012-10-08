#!/usr/bin/perl

use strict;
use warnings;

use Data::Dumper;
use Net::SMTP::SSL;
use MIME::QuotedPrint;
use WWW::Mechanize;
use DBI qw(:sql_types);
use YAML;

l('Starting ... ');

my ( $name ) = ( split( /\//, $0 ) )[-1] =~ /^(.*?)\.pl/;
my ( $type ) = ucfirst( ( split( /_/, $name ) )[-1] );
my $mech     = WWW::Mechanize->new();
my $body     = ''; 
my $config   = YAML::LoadFile("/home/trevor/conf/$name.yml");
my $personal = YAML::LoadFile('/home/trevor/conf/personal.yml');
my $found    = 0b0;
my $any      = 0b0;
my $this     = 0b1;

foreach my $site ( @{ YAML::LoadFile("/home/trevor/conf/$name.yml") } ) {
    $mech->get( $site->{'url'} );

    my $tmp_body  = '';
    $any         |= $this;

    foreach my $link ( $mech->links() ) {
        if ( my $pattern = $site->{'unless'} ) {
            next unless ( $link->url() =~ qr/$pattern/ );
        }

        if ( my $pattern = $site->{'lunless'} ) {
            next if ( $link->text() =~ qr/$pattern/ );
        }

        unless ( get( 'select * from links where link = ?', $link->url() ) ) {
            put( 'insert into links ( link, created ) values ( ?, datetime() )', $link->url() );
            my $url       =  $link->url();
            $url          =  "$site->{'base_url'}$url" if ( $site->{'base_url'} && $url !~ /^http/ );
            my ( $proto ) =  $url =~ /(^https?)/;
            $url          =~ s/https?:\/\///g;
            $url          =~ s/\/\//\//g;
            $url          =  "$proto://$url";

            $tmp_body .=  sprintf( " * %s (%s)\n", clean_title($link->text()), $url );
            $found    |=  $this;
        }
    }

    $body .= "$site->{'name'}\n=================\n\n$tmp_body\n\n" if ( $found & $this );
    $this <<= 0b1;
}

####################################
####################################
if ( $found & $any ) {

    my $boundary = '_000_7167D6699F93564CA0B7697FE0C2EF8B1F5D2ABDTK5EX14MBXC131r_';

    my $email = Net::SMTP::SSL->new(
        'smtp.gmail.com',
        'Port'  => 465,
        'Debug' => 0,
    );
    $email->auth( $personal->{'email'}, $personal->{'password'}) || die 'Auth failed: "' . $email->message() . '".';
    $email->mail($personal->{'email'});
    $email->to($personal->{'email'});

    my ( undef, undef, $hour, $day, $month, $year ) = localtime(time());
    $year += 1900;
    $month++;

    $email->data();
    $email->datasend("From: $personal->{'from'}\n");
    $email->datasend("To: $personal->{'email'}\n");
    $email->datasend( sprintf( "Subject: New %s for %4d-%02d-%02d (%02d)\n\n", $type, $year, $month, $day, $hour ) ); 
    $email->datasend("$body\n");
    $email->dataend();
    $email->quit();
}

# l( sprintf( qq/[0b%05b]/, $_ ) ) foreach( $found, ( $found & ANY ), ( $found & CRAIGSLIST ), ( $found & PERL_JOBS ) );
l('... Finished');

sub l {
    warn sprintf( "[%s] %s\n", scalar( localtime() ), join( ' ', @_ ) );
}

sub _ex {
    my ( $sql, @args ) = @_;

    my $sth = DBI->connect( $personal->{'dsn'}, '', '', {} )->prepare($sql);
    $sth->execute(@args);
    
    return $sth;
}

sub get {
    return _ex(@_)->fetchrow_array();
};

sub put {
    return _ex(@_);
}

sub clean_title {
    my ( $text ) = @_;
    $text ||= '';

    $text    =~ s/Craigslist\s*\.?(?:Org)?//gi;
    $text    =~ s/\s*-\s*$//g;
    $text    =~ s/[-=_\*~!\.\?\+]+/ /g;
    $text    =~ s/[^[:ascii:]]//g;
    $text    =~ s/\s+/ /g;
    $text    =  join(
        ' ',
        map {
            ( /[aeiouAEIOU]/ || length > 3 )
            ? ( /^\d+/ ) ? $_ : ucfirst(lc)
            : $_
        } split( ' ', $text )
    );  

    return $text;
}

