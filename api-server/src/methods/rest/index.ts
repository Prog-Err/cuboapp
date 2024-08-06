import { FastifyReply, FastifyRequest } from 'fastify'
import { Application } from '@/app'

export async function methodRest({ api }: Application, req: FastifyRequest, res: FastifyReply) {
  try {
    const { entity, id } = req.params as any

    switch (req.method.toLowerCase()) {
      case 'get':
        if (id) {
          return api.getOne(entity, { query: { id, ...(req.query || {}) } })
        }
        return api.getMany(entity, { query: req.query || {} })
      case 'post':
        return api.createOne(entity, { query: req.query || {}, body: req.body })
      case 'patch':
        if (!id) {
          return res.status(400).send('Param "id" required')
        }

        return api.updateOne(entity, { query: { id, ...(req.query || {}) }, body: req.body })
      case 'delete':
        if (!id) {
          return res.status(400).send('Param "id" required')
        }

        return api.deleteOne(entity, { query: { id, ...(req.query || {}) } })
    }

    return {
      method: req.method
    }
  } catch (e) {
    console.error(e)

    return res.status(400).send('Bad request')
  }
}

