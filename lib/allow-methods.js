/**
 * @module allow-methods
 */
'use strict';

const httpError = require('http-errors');

/**
 * Create an Express middleware function which errors if an HTTP method is not allowed.
 *
 * @access public
 * @param {Array<string>} [methods=[]]
 *     The HTTP methods which will not throw 405 errors.
 * @param {string} [message]
 *     The error message text to use if a disallowed method is used.
 * @returns {import('express').Handler}
 *     Returns a middleware function.
 */
module.exports = function allowMethods(methods = [], message = 'Method Not Allowed') {
	const normalizedMethods = normalizeAllowedMethods(methods);
	return (request, response, next) => {
		if (!normalizedMethods.includes(request.method.toUpperCase())) {
			response.header('Allow', normalizedMethods.join(', '));
			return next(httpError(405, message));
		}
		next();
	};
};

/**
 * Normalise an array of HTTP methods.
 *
 * @access private
 * @param {Array<string>} methods
 *     The HTTP methods to normalise.
 * @returns {Array<string>}
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
