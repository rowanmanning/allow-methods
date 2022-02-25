'use strict';

const httpRequest = require('axios');
const allowMethods = require('../../..');

module.exports = async function createTestExpressApp(expressModule) {
	const express = require(expressModule);

	// Create an Express app
	const app = express();

	// Add a route which only allows GET
	app.all('/get', allowMethods(['GET']), (request, response) => {
		response.status(200);
		response.send('OK');
	});

	// Add a route which only allows POST
	app.all('/post', allowMethods(['POST']), (request, response) => {
		response.status(200);
		response.send('OK');
	});

	// eslint-disable-next-line no-unused-vars
	app.use((error, request, response, next) => {
		response.status(error.status || 500);
		response.send(error.message);
	});

	// Start the server and get the application address
	const server = await start(app);
	const address = `http://localhost:${server.address().port}`;

	// Method to stop the application, required by tests
	function stop() {
		server.close();
	}

	// Method to make a request to the test application
	function makeAppRequest(method, requestPath) {
		return httpRequest({
			url: `${address}${requestPath}`,
			method,
			validateStatus() {
				return true;
			}
		});
	}

	// Method to make a GET request to the test application,
	// required by tests
	function get(requestPath) {
		return makeAppRequest('GET', requestPath);
	}

	// Method to make a POST request to the test application,
	// required by tests
	function post(requestPath) {
		return makeAppRequest('POST', requestPath);
	}

	// Return the methods that we need
	return {
		get,
		post,
		stop
	};
};

// Promisified `app.listen`
function start(app) {
	return new Promise((resolve, reject) => {
		const server = app.listen(undefined, error => {
			if (error) {
				return reject(error);
			}
			resolve(server);
		});
	});
}
