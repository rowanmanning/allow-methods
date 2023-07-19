'use strict';

class MethodNotAllowedError extends Error {

	/** @type {string} */
	name = 'MethodNotAllowedError';

	/** @type {number} */
	status = 405;

	/** @type {number} */
	statusCode = 405;

}

/**
 * Create an Express middleware function which errors if an HTTP method is not allowed.
 *
 * @public
 * @param {string[]} [methods]
 *     The HTTP methods which will not throw 405 errors.
 * @param {string} [message]
 *     The error message text to use if a disallowed method is used.
 * @returns {import('express').Handler}
 *     Returns a middleware function.
 */
function allowMethods(methods = [], message = 'Method Not Allowed') {
	const normalizedMethods = normalizeAllowedMethods(methods);
	return (request, response, next) => {
		if (!normalizedMethods.includes(request.method.toUpperCase())) {
			response.header('Allow', normalizedMethods.join(', '));
			return next(new MethodNotAllowedError(message));
		}
		next();
	};
}

/**
 * Normalise an array of HTTP methods.
 *
 * @private
 * @param {string[]} methods
 *     The HTTP methods to normalise.
 * @returns {string[]}
 *     Returns an array of capitalised HTTP methods.
 */
function normalizeAllowedMethods(methods) {
	if (!Array.isArray(methods)) {
		return [];
	}
	return methods
		.filter(method => typeof method === 'string')
		.map(method => method.toUpperCase());
}

module.exports = allowMethods;
module.exports.default = module.exports;
