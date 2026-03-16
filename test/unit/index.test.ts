// biome-ignore-all lint/suspicious/noExplicitAny: allowed in test mocks
import assert from 'node:assert';
import { beforeEach, describe, it, mock } from 'node:test';

const { allowMethods, MethodNotAllowedError } = await import('../../index.ts');

describe('allow-methods', () => {
	it('is a function', () => {
		assert.strictEqual(typeof allowMethods, 'function');
	});

	describe('allowMethods(methods)', () => {
		it('returns a function', () => {
			assert.strictEqual(typeof allowMethods(), 'function');
		});

		describe('middleware(request, response, next)', () => {
			let request: any;
			let response: any;

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
						assert.ok(error instanceof MethodNotAllowedError);
						assert.strictEqual(error.status, 405);
						assert.strictEqual(error.statusCode, 405);
						assert.strictEqual(error.message, 'Method Not Allowed');
						done();
					});
				});

				it('calls back with a 405 error with a custom message if specified', (_, done) => {
					request.method = 'BAZ';
					allowMethods(['FOO', 'bar'], 'mock message')(request, response, (error) => {
						assert.ok(error instanceof MethodNotAllowedError);
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
					// @ts-expect-error we're breaking the types to allow for runtime checks
					allowMethods({})(request, response, (error) => {
						assert.ok(error instanceof MethodNotAllowedError);
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
