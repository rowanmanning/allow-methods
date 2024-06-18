'use strict';

const allowMethods = require('../../..');

module.exports = async function createTestExpressApp(expressModule) {
	const express = require(expressModule);

	// Create an Express app
	const app = express();

	// Add a route which only allows GET
	app.all('/get', allowMethods(['GET']), (_request, response) => {
		response.status(200);
		response.send('OK');
	});

	// Add a route which only allows POST
	app.all('/post', allowMethods(['POST']), (_request, response) => {
		response.status(200);
		response.send('OK');
	});

	// eslint-disable-next-line no-unused-vars
	app.use((error, _request, response, _next) => {
		response.status(error.status || 500);
		response.send(error.message);
	});

	// Start the server and get the application address
	const server = await start(app);
	const address = `http://localhost:${server.address().port}`;

	/**
	 * Stop the application.
	 */
	function stop() {
		server.close();
	}

	/**
	 * Method to make a request to the test application.
	 *
	 * @param {string} method
	 *     The HTTP method to use.
	 * @param {string} requestPath
	 *     The path to make a request to.
	 * @returns {Response}
	 *     Returns an HTTP response object.
	 */
	function makeAppRequest(method, requestPath) {
		const url = new URL(requestPath, address);
		return fetch(url, { method });
	}

	/**
	 * Method to make a GET request to the test application.
	 *
	 * @param {string} requestPath
	 *     The path to make a request to.
	 * @returns {Response}
	 *     Returns an HTTP response object.
	 */
	function get(requestPath) {
		return makeAppRequest('GET', requestPath);
	}

	/**
	 * Method to make a POST request to the test application.
	 *
	 * @param {string} requestPath
	 *     The path to make a request to.
	 * @returns {Response}
	 *     Returns an HTTP response object.
	 */
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

/**
 * Start the application.
 *
 * @param {import('express').Application} app
 *     The Express application to start.
 * @returns {Promise<import('http').Server>}
 *     Returns the started HTTP server.
 */
function start(app) {
	return new Promise((resolve, reject) => {
		const server = app.listen(undefined, (error) => {
			if (error) {
				return reject(error);
			}
			resolve(server);
		});
	});
}
