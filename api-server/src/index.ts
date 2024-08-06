import { config } from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { Application } from './app'

config({
  path: dirname(dirname(fileURLToPath(import.meta.url))) + '/.env'
})

const app = new Application({
  auth_token: process.env.CUBO_TOKEN as string,

  webserver_port: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : undefined,
  webserver_host: process.env.SERVER_HOST
})

app.init()
