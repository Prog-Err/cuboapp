import type { CuboEntity } from '@cuboapp/api'

export type CuboModel = {
  users: CuboEntity<{
    name: string
    phone: string
    email: string
    password: string
  }>
}
