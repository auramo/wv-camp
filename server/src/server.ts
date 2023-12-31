import dotenv from 'dotenv'
dotenv.config()
import express, { Express, Request, Response } from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import { initSession } from './sessionInitializer'
import { initLogin } from './loginHandler'
import runMigrations from './migrationRunner'
import { getCarStatusInfo } from './statusChecker'
import { startBackgroundJob } from './backgroundJob'
import {
  startAirConditioning,
  stopAirConditioning,
} from './airConditioningController'
const app: Express = express()
const port = process.env.PORT || 8080

runMigrations()

app.use(
  cors({
    origin: '*',
  })
)

app.use(bodyParser.json({ limit: '5000kb' }))
initSession(app)
initLogin(app)

const clientAppHtml = (req: Request, res: Response) =>
  res.sendFile(path.resolve(`${__dirname}/../../client/dist/index.html`))
app.use('/login*', clientAppHtml)
app.use('/assets/', express.static(`${__dirname}/../../client/dist/assets`))
app.use('/', express.static(`${__dirname}/../../client/dist`))

app.get('/api/status', async (req: Request, res: Response) => {
  const carStatusInfo = await getCarStatusInfo(req.session.login!)
  if (!carStatusInfo) {
    res
      .status(500)
      .json({ error: `Could not find credentials with ${req.session.login}` })
  } else {
    res.status(200).json(carStatusInfo)
  }
})

app.post('/api/startAirConditioning', async (req: Request, res: Response) => {
  await startAirConditioning(req.session.login!, req.body.hours)
  res.set('Cache-control', `no-store`)
  res.status(200).json({})
})

app.post('/api/stopAirConditioning', async (req: Request, res: Response) => {
  await stopAirConditioning(req.session.login!)
  res.set('Cache-control', `no-store`)
  res.status(200).json({})
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

startBackgroundJob()
