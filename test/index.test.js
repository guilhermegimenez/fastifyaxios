'use strict'

const t = require('tap')
const { test } = t
const Fastify = require('fastify')
const fastifyAxios = require('../index')

const axios = require('axios')

test('register axios API to plugins', (t) => {
  t.plan(3)

  const fastify = Fastify()
  t.teardown(() => fastify.close())

  const options = {}

  fastify.register(fastifyAxios, options).ready(async (err) => {
    t.error(err)
    t.ok(fastify.axios)

    const response = await fastify.axios({
      method: 'get',
      url: 'http://bit.ly/2mTM3nY',
      responseType: 'stream'
    })
    t.ok(response)
  })
})

test('register axios instance from options configs to plugins', (t) => {
  t.plan(3)

  const fastify = Fastify()
  t.teardown(() => fastify.close())

  const options = {
    name: 'test',
    config: {
      baseURL: 'https://api.publicapis.org'
    }
  }

  fastify.register(fastifyAxios, options).ready(async (err) => {
    t.error(err)
    t.ok(fastify.axios)

    const response = await fastify.axios.test.get('/categories')

    t.ok(response, JSON.stringify(response.data))
  })
})

test('register axios multiples instances from options configs to plugins', (t) => {
  t.plan(6)

  const fastify = Fastify()
  t.teardown(() => fastify.close())

  const options1 = {
    name: 'foo',
    config: {
      baseURL: 'http://bit.ly',
      responseType: 'stream'
    }
  }
  const options2 = {
    name: 'bar',
    config: {
      baseURL: 'https://api.publicapis.org'
    }
  }

  fastify
    .register(fastifyAxios, options1)
    .register(fastifyAxios, options2)
    .ready(async (err) => {
      t.error(err)
      t.ok(fastify.axios)
      t.ok(fastify.axios.foo)
      t.ok(fastify.axios.bar)
      const responseFoo = await fastify.axios.foo.get('/2mTM3nY')
      const responseBar = await fastify.axios.bar.get('/categories')

      t.ok(responseFoo)
      t.ok(responseBar)
    })
})

test('register axios instance from existing axios instance to plugins', (t) => {
  t.plan(4)

  const fastify = Fastify()
  t.teardown(() => fastify.close())

  const options = {
    name: 'testExist',
    client: axios.create({
      baseURL: 'https://api.publicapis.org'
    })
  }

  fastify.register(fastifyAxios, options).ready(async (err) => {
    t.error(err)
    t.ok(fastify.axios)
    t.ok(fastify.axios.testExist)

    const response = await fastify.axios.testExist.get('/categories')

    t.ok(response)
  })
})

test('register axios multiples instances from existing axios instances to plugins', (t) => {
  t.plan(6)

  const fastify = Fastify()
  t.teardown(() => fastify.close())

  const options1 = {
    name: 'ping',
    client: axios.create({
      baseURL: 'https://catfact.ninja'
    })
  }

  const options2 = {
    name: 'pong',
    client: axios.create({
      baseURL: 'https://api.publicapis.org'
    })
  }

  fastify
    .register(fastifyAxios, options1)
    .register(fastifyAxios, options2)
    .ready(async (err) => {
      t.error(err)
      t.ok(fastify.axios)
      t.ok(fastify.axios.ping)
      t.ok(fastify.axios.pong)

      const responsePing = await fastify.axios.ping.get('/fact')
      const responsePong = await fastify.axios.pong.get('/categories')

      t.ok(responsePing)
      t.ok(responsePong)
    })
})

// test('register axios with duplicate name to plugins', (t) => {
//   t.plan(2)

//   const fastify = Fastify()
//   t.teardown(() => fastify.close())

//   const name = 'test'
//   const options = {
//     name,
//     config: {
//       baseURL: 'https://api.publicapis.org'
//     }
//   }

//   fastify.register(fastifyAxios, options).ready(async (err) => {
//     t.ok(err)
//     t.equal(err.message, 'Axios client name already registered: ' + name)
//   })
// })
