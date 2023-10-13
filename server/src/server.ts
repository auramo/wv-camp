import dotenv from 'dotenv'
dotenv.config()
import express, { Express, Request, Response } from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import { initSession } from './sessionInitializer'
import { initLogin } from './loginHandler'
import runMigrations from './migrationRunner'
import { getVentilationStatus } from './weconnect'
import {
  findVwCredentialsByLogin,
  getCarStatusInfo,
  storeVentilationSchedule,
} from './CarRepository'
import { startBackgroundJob } from './backgroundJob'
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

app.get('/behindlogin', (req: Request, res: Response) => {
  res.send('Dummy page behind login')
})

app.get('/api/hello', (req: Request, res: Response) => {
  res.send('{"a": 1}')
})

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

app.post('/api/schedule', async (req: Request, res: Response) => {
  await storeVentilationSchedule(req.session.login!, req.body.hours)
  res.set('Cache-control', `no-store`)
  res.status(200).json({})
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

startBackgroundJob()
