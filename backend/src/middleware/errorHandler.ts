/**
 * Node imports
 */

import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  req: Request,
  res: Response,
  err: Error,
  next: NextFunction,
) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
};
