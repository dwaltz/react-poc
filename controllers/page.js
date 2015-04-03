'use strict';

var _      = require( 'underscore' );

module.exports = function( server, passport ) {

	server.get( '/', function( req, res ){
		res.render( 'index', {title: 'Tech Demo'});
	});

};