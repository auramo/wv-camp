import dotenv from 'dotenv'
dotenv.config()
import express, { Express, Request, Response } from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import { initSession } from './sessionInitializer'
import runMigrations from './migrationRunner'
import { getVentilationStatus } from './weconnect'

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

app.get('/api/getVentilationStatus', async (req: Request, res: Response) => {
  const status = await getVentilationStatus('todo@todo.com', 'pass', 'vin')
  res.send(JSON.stringify({ status }))
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
