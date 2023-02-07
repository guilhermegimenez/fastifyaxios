import type { FastifyPluginAsync } from 'fastify'
import { AxiosInstance, AxiosRequestConfig } from 'axios'

declare module 'fastify' {
  interface FastifyInstance {
    axios: fastifyAxios.FastifyAxiosObject & fastifyAxios.FastifyAxiosNestedObject
  }
}

type FastifyAxios = FastifyPluginAsync<fastifyAxios.FastifyAxiosOptions>

declare namespace fastifyAxios {

  export interface FastifyAxiosObject extends AxiosInstance {
  }

  export interface FastifyAxiosNestedObject {
    [name: string]: FastifyAxiosObject
  }

  export interface FastifyAxiosOptions {
    name?: string
    client?: AxiosInstance
    config?: AxiosRequestConfig
  }

  export const fastifyAxios: FastifyAxios
  export { fastifyAxios as default }
}

declare function fastifyAxios(...params: Parameters<FastifyAxios>): ReturnType<FastifyAxios>
export = fastifyAxios
