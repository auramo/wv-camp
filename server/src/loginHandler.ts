import express, { Express, NextFunction, Request, Response } from 'express'
import { getAirConditioningStatus } from './weconnect'
import { storeVwCredentials } from './CarRepository'

const loginRequiredPaths = [/^\/api\//]

const errorResponse = (res: Response, err: any) => {
  console.error(err)
  res.status(500).json({ error: 'Server error', err })
}

const loginCheck = (req: Request, res: Response, next: NextFunction) => {
  console.info('loginCheck, is there a user?', req.session.login)
  console.info(req.session.login)
  if (!req.session.login) {
    res.status(401).json({ message: 'Not logged in' })
  } else {
    next()
  }
}

export const initLogin = (app: Express) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (
      loginRequiredPaths.some((requiredRegex) => req.path.match(requiredRegex))
    ) {
      loginCheck(req, res, next)
    } else {
      next()
    }
  })

  app.get('/auth/logout', (req, res) => {
    console.log('logout')
    req.session.login = null
    req.session.password = null
    req.session.vin = null
  })

  app.post('/auth/login', async (req, res) => {
    const { login, password, vin } = req.body
    try {
      const ventilationStatus = await getAirConditioningStatus(
        login,
        password,
        vin
      )
      await storeVwCredentials(login, password, vin)
      req.session.login = login
      res.status(200).json({ ventilationStatus })
    } catch (e) {
      console.error(getErrorMessage(e))
      res.status(401).json({ message: `login failed ${getErrorMessage(e)}` })
    }
  })

  app.post('/auth/loginStatus', async (req, res) => {
    res.status(200).json({ loggedIn: !!req.session.login })
  })
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}
