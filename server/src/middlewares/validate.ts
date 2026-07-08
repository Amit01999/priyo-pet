import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { BadRequest } from '../errors/httpErrors.js';

type Source = 'body' | 'query' | 'params';

/** Validates req[source] against `schema` and replaces req[source] with the parsed (and
 *  coerced/transformed) result. Never mutates req.query/req.params in place — builds a new
 *  object via zod instead, which sidesteps the getter-only req.query issue some Express/Node
 *  combinations have with libraries that reassign it directly. */
export function validate(schema: ZodSchema, source: Source = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
      next(BadRequest('Validation failed', fieldErrors));
      return;
    }
    (req as Record<Source, unknown>)[source] = result.data;
    next();
  };
}
