'use strict';

const {assert} = require('chai');
const td = require('testdouble');

describe('lib/allow-methods', () => {
	let allowMethods;
	let error405;
	let httpError;

	beforeEach(() => {
		httpError = td.replace('http-errors', td.func());
		error405 = {status: 405};
		td.when(httpError(), {ignoreExtraArgs: true}).thenReturn(error405);
		allowMethods = require('../../../lib/allow-methods');
	});

	it('is a function', () => {
		assert.isFunction(allowMethods);
	});

	describe('allowMethods(methods)', () => {

		it('returns a function', () => {
			assert.isFunction(allowMethods());
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
						assert.isUndefined(error);
						done();
					});
				});

				it('ignores case in the allowed methods', done => {
					request.method = 'BAR';
					allowMethods(['FOO', 'bar'])(request, response, error => {
						assert.isUndefined(error);
						done();
					});
				});

				it('ignores case in the request method', done => {
					request.method = 'foo';
					allowMethods(['FOO', 'bar'])(request, response, error => {
						assert.isUndefined(error);
						done();
					});
				});

			});

			describe('when request method is not allowed', () => {

				it('calls back with a 405 error', done => {
					request.method = 'BAZ';
					allowMethods(['FOO', 'bar'])(request, response, error => {
						assert.strictEqual(error, error405);
						td.verify(httpError(405, 'Method Not Allowed'), {times: 1});
						done();
					});
				});

				it('calls back with a 405 error with a custom message if specified', done => {
					request.method = 'BAZ';
					allowMethods(['FOO', 'bar'], 'mock message')(request, response, error => {
						assert.strictEqual(error, error405);
						td.verify(httpError(405, 'mock message'), {times: 1});
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
						assert.strictEqual(error, error405);
						td.verify(httpError(405, 'Method Not Allowed'), {times: 1});
						done();
					});
				});

			});

		});

	});


});
