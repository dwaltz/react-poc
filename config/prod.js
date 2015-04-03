//Application configuration
module.exports = {
	'port': 3000, //SITE SECURITY: important Don’t run as root!

	'redis': {
		port: 6379
	},

	'mongodb' : {
		'url': 'localhost',
		'name': 'react-poc-data'
	},

	'ssl' : {
		key: '/config/ssl/key',
		cert: '/config/ssl/cert'
	}
};