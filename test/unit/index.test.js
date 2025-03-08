'use strict';

const { afterEach, beforeEach, describe, it, mock } = require('node:test');
const assert = require('node:assert');

describe('allow-methods', () => {
	let allowMethods;

	beforeEach(() => {
		allowMethods = require('../..').allowMethods;
	});

	afterEach(() => {
		mock.reset();
	});

	it('is a function', () => {
		assert.strictEqual(typeof allowMethods, 'function');
	});

	describe('allowMethods(methods)', () => {
		it('returns a function', () => {
			assert.strictEqual(typeof allowMethods(), 'function');
		});

		describe('middleware(request, response, next)', () => {
			let request;
			let response;

			beforeEach(() => {
				request = {
					method: 'foo'
				};
				response = {
					header: mock.fn()
				};
			});

			describe('when request method is allowed', () => {
				it('does not callback with an error', (_, done) => {
					request.method = 'FOO';
					allowMethods(['FOO', 'bar'])(request, response, (error) => {
						assert.strictEqual(error, undefined);
						done();
					});
				});

				it('ignores case in the allowed methods', (_, done) => {
					request.method = 'BAR';
					allowMethods(['FOO', 'bar'])(request, response, (error) => {
						assert.strictEqual(error, undefined);
						done();
					});
				});

				it('ignores case in the request method', (_, done) => {
					request.method = 'foo';
					allowMethods(['FOO', 'bar'])(request, response, (error) => {
						assert.strictEqual(error, undefined);
						done();
					});
				});
			});

			describe('when request method is not allowed', () => {
				it('calls back with a 405 error', (_, done) => {
					request.method = 'BAZ';
					allowMethods(['FOO', 'bar'])(request, response, (error) => {
						assert.ok(error instanceof Error);
						assert.strictEqual(error.status, 405);
						assert.strictEqual(error.statusCode, 405);
						assert.strictEqual(error.message, 'Method Not Allowed');
						done();
					});
				});

				it('calls back with a 405 error with a custom message if specified', (_, done) => {
					request.method = 'BAZ';
					allowMethods(['FOO', 'bar'], 'mock message')(request, response, (error) => {
						assert.ok(error instanceof Error);
						assert.strictEqual(error.status, 405);
						assert.strictEqual(error.statusCode, 405);
						assert.strictEqual(error.message, 'mock message');
						done();
					});
				});

				it('sets the response `Allow` header to the allowed methods if the request method is not allowed', (_, done) => {
					request.method = 'BAZ';
					allowMethods(['FOO', 'bar'])(request, response, () => {
						assert.strictEqual(response.header.mock.callCount(), 1);
						assert.deepEqual(response.header.mock.calls[0].arguments, [
							'Allow',
							'FOO, BAR'
						]);
						done();
					});
				});
			});

			describe('when the allowed methods is not an array', () => {
				it('calls back with a 405 error', (_, done) => {
					request.method = 'FOO';
					allowMethods({})(request, response, (error) => {
						assert.ok(error instanceof Error);
						assert.strictEqual(error.status, 405);
						assert.strictEqual(error.statusCode, 405);
						assert.strictEqual(error.message, 'Method Not Allowed');
						done();
					});
				});
			});
		});
	});
});
