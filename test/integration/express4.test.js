'use strict';

const assert = require('node:assert');
const createTestApp = require('./fixture/create-test-express-app');

describe('Express 4', () => {
	let app;

	before(async () => {
		app = await createTestApp('express4');
	});

	after(() => {
		app.stop();
	});

	describe('GET /get', () => {
		let response;

		beforeEach(async () => {
			response = await app.get('/get');
		});

		it('responds with a 200 status', () => {
			assert.strictEqual(response.status, 200);
		});

		it('responds with no "Allow" header', () => {
			assert.strictEqual(response.headers.allow, undefined);
		});

	});

	describe('POST /get', () => {
		let response;

		beforeEach(async () => {
			response = await app.post('/get');
		});

		it('responds with a 405 status', () => {
			assert.strictEqual(response.status, 405);
		});

		it('responds with an "Allow" outlining allowed HTTP methods', () => {
			assert.strictEqual(response.headers.allow, 'GET');
		});

	});

	describe('POST /post', () => {
		let response;

		beforeEach(async () => {
			response = await app.post('/post');
		});

		it('responds with a 200 status', () => {
			assert.strictEqual(response.status, 200);
		});

		it('responds with no "Allow" header', () => {
			assert.strictEqual(response.headers.allow, undefined);
		});

	});

	describe('GET /post', () => {
		let response;

		beforeEach(async () => {
			response = await app.get('/post');
		});

		it('responds with a 405 status', () => {
			assert.strictEqual(response.status, 405);
		});

		it('responds with an "Allow" outlining allowed HTTP methods', () => {
			assert.strictEqual(response.headers.allow, 'POST');
		});

	});

});
