import type { Handler } from '@types/express';

export function allowMethods(methods?: string[], message?: string): Handler;
