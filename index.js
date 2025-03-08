'use strict';

/**
 * @import { allowMethods } from '.'
 */

class MethodNotAllowedError extends Error {
	/** @override */
	name = 'MethodNotAllowedError';
	status = 405;
	statusCode = 405;
}

/**
 * @type {allowMethods}
 */
exports.allowMethods = function allowMethods(methods = [], message = 'Method Not Allowed') {
	const normalizedMethods = normalizeAllowedMethods(methods);
	return (request, response, next) => {
		if (!normalizedMethods.includes(request.method.toUpperCase())) {
			response.header('Allow', normalizedMethods.join(', '));
			return next(new MethodNotAllowedError(message));
		}
		next();
	};
};

/**
 * @param {string[]} methods
 * @returns {string[]}
 */
function normalizeAllowedMethods(methods) {
	if (!Array.isArray(methods)) {
		return [];
	}
	return methods
		.filter((method) => typeof method === 'string')
		.map((method) => method.toUpperCase());
}
