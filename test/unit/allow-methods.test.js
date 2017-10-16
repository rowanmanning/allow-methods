'use strict';

const assert = require('proclaim');
const mockery = require('mockery');
const sinon = require('sinon');

describe('allow-methods', () => {
	let allowMethods;
	let error405;
	let httpError;

	beforeEach(() => {
		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false,
			warnOnReplace: false
		});
		error405 = {status: 405};
		httpError = sinon.stub().returns(error405);
		mockery.registerMock('http-errors', httpError);
		allowMethods = require('../../lib/allow-methods');
	});

	afterEach(() => {
		mockery.deregisterAll();
		mockery.disable();
	});

	it('should be a function', () => {
		assert.isFunction(allowMethods);
	});

	it('should return a function', () => {
		assert.isFunction(allowMethods());
	});

	describe('returned function', () => {
		let request;
		let response;

		beforeEach(() => {
			request = {
				method: 'foo'
			};
			response = {
				header: sinon.spy()
			};
		});

		describe('when request method is allowed', () => {

			it('should not pass an error', done => {
				request.method = 'FOO';
				allowMethods(['FOO', 'bar'])(request, response, error => {
					assert.isUndefined(error);
					done();
				});
			});

			it('should ignore case in the allowed methods', done => {
				request.method = 'BAR';
				allowMethods(['FOO', 'bar'])(request, response, error => {
					assert.isUndefined(error);
					done();
				});
			});

			it('should ignore case in the request method', done => {
				request.method = 'foo';
				allowMethods(['FOO', 'bar'])(request, response, error => {
					assert.isUndefined(error);
					done();
				});
			});

		});

		describe('when request method is not allowed', () => {

			it('should pass a 405 error', done => {
				request.method = 'BAZ';
				allowMethods(['FOO', 'bar'])(request, response, error => {
					assert.strictEqual(error, error405);
					assert.strictEqual(httpError.withArgs(405, undefined).callCount, 1);
					done();
				});
			});

			it('should pass a 405 error with a custom message if specified', done => {
				request.method = 'BAZ';
				allowMethods(['FOO', 'bar'], 'foo')(request, response, error => {
					assert.strictEqual(error, error405);
					assert.strictEqual(httpError.withArgs(405, 'foo').callCount, 1);
					done();
				});
			});

			it('should set the response `Allow` header to the allowed methods if the request method is not allowed', done => {
				request.method = 'BAZ';
				allowMethods(['FOO', 'bar'])(request, response, () => {
					assert.strictEqual(response.header.withArgs('Allow', 'FOO, BAR').callCount, 1);
					done();
				});
			});

		});

	});

});
