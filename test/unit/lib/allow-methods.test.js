'use strict';

const assert = require('node:assert');
const td = require('testdouble');

describe('lib/allow-methods', () => {
	let allowMethods;

	beforeEach(() => {
		allowMethods = require('../../../lib/allow-methods');
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
					header: td.func()
				};
			});

			describe('when request method is allowed', () => {

				it('does not callback with an error', done => {
					request.method = 'FOO';
					allowMethods(['FOO', 'bar'])(request, response, error => {
						assert.strictEqual(error, undefined);
						done();
					});
				});

				it('ignores case in the allowed methods', done => {
					request.method = 'BAR';
					allowMethods(['FOO', 'bar'])(request, response, error => {
						assert.strictEqual(error, undefined);
						done();
					});
				});

				it('ignores case in the request method', done => {
					request.method = 'foo';
					allowMethods(['FOO', 'bar'])(request, response, error => {
						assert.strictEqual(error, undefined);
						done();
					});
				});

			});

			describe('when request method is not allowed', () => {

				it('calls back with a 405 error', done => {
					request.method = 'BAZ';
					allowMethods(['FOO', 'bar'])(request, response, error => {
						assert.ok(error instanceof Error);
						assert.strictEqual(error.status, 405);
						assert.strictEqual(error.statusCode, 405);
						assert.strictEqual(error.message, 'Method Not Allowed');
						done();
					});
				});

				it('calls back with a 405 error with a custom message if specified', done => {
					request.method = 'BAZ';
					allowMethods(['FOO', 'bar'], 'mock message')(request, response, error => {
						assert.ok(error instanceof Error);
						assert.strictEqual(error.status, 405);
						assert.strictEqual(error.statusCode, 405);
						assert.strictEqual(error.message, 'mock message');
						done();
					});
				});

				it('sets the response `Allow` header to the allowed methods if the request method is not allowed', done => {
					request.method = 'BAZ';
					allowMethods(['FOO', 'bar'])(request, response, () => {
						td.verify(response.header('Allow', 'FOO, BAR'), {times: 1});
						done();
					});
				});

			});

			describe('when the allowed methods is not an array', () => {

				it('calls back with a 405 error', done => {
					request.method = 'FOO';
					allowMethods({})(request, response, error => {
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

	describe('.default', () => {
		it('aliases the module exports', () => {
			assert.strictEqual(allowMethods, allowMethods.default);
		});
	});

});
