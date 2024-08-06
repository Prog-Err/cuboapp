import {
  CuboBackendApi,
  CuboCrudAugmentationInstance,
  CuboCrudGetManyResponse,
  CuboCrudMethodOptions,
  CuboCrudQueryOptions,
  CuboCrudRequest
} from '@cuboapp/api'

import { CuboModel } from '@/cubo'

export class ApiUsers<T = CuboModel['users']> implements CuboCrudAugmentationInstance<T> {
  constructor(public api: CuboBackendApi<CuboModel>) {}

  async beforeGetOne(req: CuboCrudRequest, opts?: CuboCrudMethodOptions): Promise<CuboCrudQueryOptions> {
    const resultOptions: CuboCrudQueryOptions = {}

    if (req.query?.password) {
      resultOptions.extra = {
        password: req.query.password
      }

      delete req.query.password
    }

    return resultOptions
  }

  async beforeGetMany(req: CuboCrudRequest, opts?: CuboCrudMethodOptions): Promise<CuboCrudQueryOptions> {
    const augment: CuboCrudQueryOptions = {
      conditions: [],
      joins: [],
      replacements: {}
    }

    if (req.query?.search) {
      augment.conditions!.push('(t1.name ilike :search_like or t1.login ilike :search_like)')
      augment.replacements!.search_like = `%${req.query.search.trim()}%`

      delete req.query.search
    }

    return augment
  }

  async afterGetMany(result: CuboCrudGetManyResponse<T>, req: CuboCrudRequest, opts?: CuboCrudMethodOptions) {
    return {
      ...result,
      rows: result.rows.map((row) => ({
        ...row,
        password: undefined
      }))
    }
  }

  async afterGetOne(result: T, req: CuboCrudRequest, opts?: CuboCrudMethodOptions) {
    return {
      ...result,
      password: undefined
    }
  }
}
