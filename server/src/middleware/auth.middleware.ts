import type { Request, Response, NextFunction } from "express";
import { auth } from "../auth/index.js";
import { ApiError } from "../utils/index.js";
import { fromNodeHeaders } from "better-auth/node";


interface AuthUser {
  id: string;
  name: string;
  image?: string | null;
  username?: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const requiredAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session?.user) {
    return next(new ApiError(401, "Unauthorized"));
  }
  req.user = session.user
  next();
};
