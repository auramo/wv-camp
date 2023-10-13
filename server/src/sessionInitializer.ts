import express, { Express } from 'express'
import session, { SessionOptions } from 'express-session'
import genFunc from 'connect-pg-simple'
import { pool } from './Database'

const PostgresqlStore = genFunc(session)
const sessionStore = new PostgresqlStore({
  conString: '<insert-connection-string-here>',
})

const sessionOptions: SessionOptions = {
  secret: process.env.COOKIE_SECRET!,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false },
  store: new PostgresqlStore({
    pool: pool,
    tableName: 'user_sessions',
  }),
}

declare module 'express-session' {
  interface SessionData {
    login: string | null
    password: string | null
    vin: string | null
  }
}

export const initSession = (app: Express) => app.use(session(sessionOptions))
