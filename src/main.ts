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
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// import utils
import handleMsg from './utils/handleMsg'
import pushMsg from './utils/PushMsg'

// create LINE SDK config from env variables
const config: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.CHANNEL_SECRET
}

// create LINE SDK client
const client: Client = new Client(config)
// express app
const app: Express = express()
// app.use(cors())

// register a webhook handler with middleware
app.post('/callback', middleware(config as MiddlewareConfig), async (req: Request, res: Response) => {
  console.log('req.body.events!!!', req.body.events)
  const event = req.body.events[0]
  try {
    // await handleMsg.reply(client, event)
    await handleMsg.link(client, event)
    await handleMsg.linked(client, event)
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
  console.log(`line bot is listening on http://localhost:${port}`)
})

// start interval
console.log('-------run interval-------')
pushMsg.cpblPlayerTrans(client)
