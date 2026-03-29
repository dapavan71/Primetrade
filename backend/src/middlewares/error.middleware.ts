import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: (err as any).errors || (err as any).issues,
    });
  }

  // Handle Prisma structural or validation errors if any (simplified)
  if (err.code === 'P2002') {
    return res.status(409).json({
      status: 'error',
      message: 'Unique constraint failed, record already exists',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    message,
  });
};
