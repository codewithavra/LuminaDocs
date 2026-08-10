import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import mongoose from "mongoose";
import type { Db } from "mongodb";

import { env } from "../config/index.js";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,

  database: mongodbAdapter(
    mongoose.connection.db as unknown as Db
  ),

  trustedOrigins: [
    env.CORS_ORIGIN,
    env.BETTER_AUTH_URL,
  ],

  advanced: {
    useSecureCookies: true,
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    username({
      minUsernameLength: 5,
      maxUsernameLength: 25,
      displayUsernameValidator: (displayUsername) =>
        /^[a-zA-Z0-9_-]+$/.test(displayUsername),
    }),
  ],

  socialProviders: {
  github: {
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
  },
},
});