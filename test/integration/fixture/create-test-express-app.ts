import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { Application, ErrorRequestHandler, Express } from 'express';
import { allowMethods } from '../../../index.ts';

export default async function createTestExpressApp(expressModule: 'express4' | 'express5') {
	const { default: express } = await import(expressModule);

	// Create an Express app
	const app = express() as Express;

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

	const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
		response.status(error.status || 500);
		response.send(error.message);
	};
	app.use(errorHandler);

	// Start the server and get the application address
	const server = await start(app);
	const { port } = server.address() as AddressInfo;
	const address = `http://localhost:${port}`;

	/**
	 * Stop the application.
	 */
	function stop() {
		server.close();
	}

	/**
	 * Method to make a request to the test application.
	 */
	function makeAppRequest(method: string, requestPath: string) {
		const url = new URL(requestPath, address);
		return fetch(url, { method });
	}

	/**
	 * Method to make a GET request to the test application.
	 */
	function get(requestPath: string) {
		return makeAppRequest('GET', requestPath);
	}

	/**
	 * Method to make a POST request to the test application.
	 */
	function post(requestPath: string) {
		return makeAppRequest('POST', requestPath);
	}

	return {
		get,
		post,
		stop
	};
}

/**
 * Start the application
 */
function start(app: Application): Promise<Server> {
	return new Promise((resolve) => {
		const server = app.listen(() => {
			resolve(server);
		});
	});
}
