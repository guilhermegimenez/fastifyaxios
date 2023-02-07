'use strict'

const fp = require('fastify-plugin')
const axios = require('axios')

// client = {
//   name,
//   instance,
//   config,
// }

function decorateAxiosPlugin(fastify, client, name) {
  if (name) {
    if (!fastify.axios) {
      fastify.decorate('axios', axios)
    }
    if (fastify.axios[name]) {
      throw Error('Axios client name already registered: ' + name)
    }

    fastify.axios[name] = client
  }
}

async function fastifyAxios(fastify, options) {
  const { name, config, client } = options

  if (!fastify.axios) {
    fastify.decorate('axios', axios)
  }

  if (client) {
    if (!name) {
      throw Error('To set a exitent client option `name` is required')
    }
    decorateAxiosPlugin(fastify, client, name)
  } else if (config) {
    if (!name) {
      throw Error('To create a client option `name` is required')
    }
    const client = axios.create(config)
    decorateAxiosPlugin(fastify, client, name)
  }
}

module.exports = fp(fastifyAxios, {
  fastify: '4.x',
  name: 'fastifyaxios'
})

module.exports.default = fastifyAxios
module.exports.fastifyAxios = fastifyAxios
