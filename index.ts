import type { Handler } from 'express';

export class MethodNotAllowedError extends Error {
	override name = 'MethodNotAllowedError';
	readonly status = 405;
	readonly statusCode = 405;
}

/**
 * Build an Express middleware that will error if the request HTTP method does not match one of the
 * allowed methods. The error will have `message` and `status` properties that you can use in your
 * error handling middleware.
 */
export function allowMethods(methods: string[] = [], message = 'Method Not Allowed'): Handler {
	const normalizedMethods = normalizeAllowedMethods(methods);
	return (request, response, next) => {
		if (!normalizedMethods.includes(request.method.toUpperCase())) {
			response.header('Allow', normalizedMethods.join(', '));
			return next(new MethodNotAllowedError(message));
		}
		next();
	};
}

function normalizeAllowedMethods(methods: string[]) {
	if (!Array.isArray(methods)) {
		return [];
	}
	return methods
		.filter((method) => typeof method === 'string')
		.map((method) => method.toUpperCase());
}
