import {
  Client,
  middleware,
  JSONParseError,
  SignatureValidationFailed,
  ClientConfig,
  MiddlewareConfig
} from '@line/bot-sdk'
import express from 'express'
import { Express, Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import { getTasks } from 'node-cron'
import { GoogleSheet } from './sheet/config'
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// init Google Sheet
const googleSheet = new GoogleSheet()
const run = async () => {
  await googleSheet.init()
  // await googleSheet.getNotes()
}
run()

// import utils
import handleMsg from './utils/handleMsg'
// import pushMsg from './utils/PushMsg'

// create LINE SDK config from env variables
const config: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.CHANNEL_SECRET
}
const client: Client = new Client(config)
const app: Express = express()
// app.use(cors())

// view
app.get('/', (req: Request, res: Response) => {
  const time = new Date().toLocaleString()
  res.send(`Line Bot Pui !!!\n${time}`)
})

// register a webhook handler with middleware
app.post('/webhook', middleware(config as MiddlewareConfig), async (req: Request, res: Response) => {
  console.log('req.body.events!!!', req.body.events)
  const event = req.body.events[0]
  try {
    await handleMsg.reply(client, event, googleSheet)
  } catch (err) {
    console.log('[ERROR ROUTE]', err)
    res.status(500).end()
  }
})

// error handling
app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature)
    return
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw)
    return
  }
  next(err) // will throw default 500
})

// listen on port
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`line bot pui is listening on http://localhost:${port}`)
})
