import assert from 'node:assert';
import { after, before, beforeEach, describe, it } from 'node:test';
import createTestApp from './fixture/create-test-express-app.ts';

describe('Express 4', () => {
	let app: Awaited<ReturnType<typeof createTestApp>>;

	before(async () => {
		app = await createTestApp('express4');
	});

	after(() => {
		app.stop();
	});

	describe('GET /get', () => {
		let response: Response;

		beforeEach(async () => {
			response = await app.get('/get');
		});

		it('responds with a 200 status', () => {
			assert.strictEqual(response.status, 200);
		});

		it('responds with no "Allow" header', () => {
			assert.strictEqual(response.headers.get('allow'), null);
		});
	});

	describe('POST /get', () => {
		let response: Response;

		beforeEach(async () => {
			response = await app.post('/get');
		});

		it('responds with a 405 status', () => {
			assert.strictEqual(response.status, 405);
		});

		it('responds with an "Allow" header outlining allowed HTTP methods', () => {
			assert.strictEqual(response.headers.get('allow'), 'GET');
		});
	});

	describe('POST /post', () => {
		let response: Response;

		beforeEach(async () => {
			response = await app.post('/post');
		});

		it('responds with a 200 status', () => {
			assert.strictEqual(response.status, 200);
		});

		it('responds with no "Allow" header', () => {
			assert.strictEqual(response.headers.get('allow'), null);
		});
	});

	describe('GET /post', () => {
		let response: Response;

		beforeEach(async () => {
			response = await app.get('/post');
		});

		it('responds with a 405 status', () => {
			assert.strictEqual(response.status, 405);
		});

		it('responds with an "Allow" header outlining allowed HTTP methods', () => {
			assert.strictEqual(response.headers.get('allow'), 'POST');
		});
	});
});
