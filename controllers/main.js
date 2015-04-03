'use strict';

var pageController = require( './page' );
var errorController = require( './error' );
var restController = require( './error' );
//var authController = require( './auth' );

module.exports = function( server) {

	errorController(server); //must go first in express 4 due to use API
	pageController(server);
	restController(server);
	//authController(server, passport);

};
