import { getAuth } from "@clerk/express";
 
// Use this on any route that needs a signed-in user.
// clerkMiddleware() (applied globally in app.js) must run first -
// it's what attaches the auth state that getAuth() reads here.
export function requireAuth(req, res, next) {
  const auth = getAuth(req);
 
  if (!auth.isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
 
  // stash it so controllers don't need to call getAuth() again
  req.userId = auth.userId;
  next();
}