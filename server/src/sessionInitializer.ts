import express, { Express } from "express";
import session, { SessionOptions } from "express-session";

const sessionOptions: SessionOptions = {
  secret: process.env.COOKIE_SECRET!,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false },
};

declare module "express-session" {
  interface SessionData {
    user: string | null;
    desiredUrlAfterLogin: string | null;
  }
}

export const initSession = (app: Express) => app.use(session(sessionOptions));
