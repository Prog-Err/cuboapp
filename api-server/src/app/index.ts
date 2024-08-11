import { CuboBackendApi } from '@cuboapp/api'
import fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import cors from '@fastify/cors'
import path from 'path'

import { CuboModel } from '../cubo'
import { methodRest, methodLogin, methodLogout, methodMe, methodCreateUser } from '../methods'
import { authenticate } from '../middleware';

export type ApplicationProps = {
  auth_token: string

  webserver_port?: number
  webserver_host?: string
}

export class Application {
  constructor(
    private opts: ApplicationProps,
    public api = new CuboBackendApi<CuboModel>(opts.auth_token),
    public server = fastify({
      logger: false
    })
  ) {
    // Настройка CORS
    this.server.register(cors, {
      origin: 'http://localhost:5173',
      methods: ['POST', 'OPTIONS', 'GET', 'PUT', 'DELETE'], // Разрешенные методы
      allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
    })

    // auth request
    this.server.all('/login', async (req, res) => {
      try {
        const response = await methodLogin(this, req, res)

        return response
      } catch (e) {
        console.log(e)

        res.code(500).send('Server error')
      }
    })
    this.server.all('/logout', async (req, res) => {
      try {
        const response = await methodLogout(this, req, res)

        return response
      } catch (e) {
        console.log(e)

        res.code(500).send('Server error')
      }
    })
    this.server.all('/me', { preHandler: authenticate }, async (req, res) => {
      try {
        const response = await methodMe(this, req, res);
        return response;
      } catch (e) {
        console.error(e);
        res.code(500).send('Server error');
      }
    })

    this.server.all('/createDemoUser', async (req, res) => {
      try {
        const response = await methodCreateUser(this, req, res);
        return response;
      } catch (e) {
        console.error(e);
        res.code(500).send('Server error');
      }
    });

    // rest request
    this.server.all('/rest/:entity/:id?', async (req, res) => {
      try {
        const response = await methodRest(this, req, res)

        return response
      } catch (e) {
        console.log(e)
        res.code(500).send('Server error')
      }
    })
    //Обслуживание статистических файлов (Vue 3 build)
    this.server.register(fastifyStatic, {
      root: path.join(__dirname, '../../static'),
      prefix: '/'
    })
    // this.server.get('/*', async (req, res) => {
    //   try {
    //     return res.sendFile('index.html')
    //   } catch (e) {
    //     console.log(e)
    //     res.code(500).send('Server error')
    //   }
    // })

  }

  async init() {
    await this.api.init()

    this.server.listen({ port: this.opts.webserver_port || 80, host: this.opts.webserver_host || '0.0.0.0' }, (err, address) => {
      this.server.log.level = 'info'

      if (err) {
        console.log('error', err)

        process.exit(1)
      }

      console.log(`Webserver is now listening on ${address}`)
    })
  }
}
