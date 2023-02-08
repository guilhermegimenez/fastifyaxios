# fastifyaxios

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)
[![npm type definitions](https://img.shields.io/static/v1?label=lang&message=typescript_support&color=blue)](https://www.typescriptlang.org)

Fastify Axios instance plugin; with this you can share many Axios instances in every part of your server.

This plugin supports typescript.

Under the hood the official [Axios](https://github.com/axios/axios) lib is used,
the options that you pass to `register` will be passed to the Axios client.
The `axios` is v1.3.2

You can provide in the options:

- **config**: axios request configuration - the prop name declare in the option is _required_
- **client**: a axios instance created by your self - the prop name declare in the option is _required_
- **nothing**

By default when `register` this plugin atomatically creates a `axios` client default in `Fastify Instance`.

## Install

```
npm i fastifyaxios
```

## Usage

Add it to your project with `register` and you are done!

```js
const fastify = require('fastify')()

fastify.register(require('fastifyaxios'), {})

fastify.get('/fact', async function (req, reply) {
  const response = await this.axios({
    method: 'get',
    url: 'https://catfact.ninja/fact'
  })

  return response.data
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err
})
```

You may also supply config and name in options to `register` instance of `axios` in your fastify server:

```js
const fastify = require('fastify')()

fastify.register(require('fastifyaxios'), {
  name: 'ninja',
  config: {
    baseURL: 'https://catfact.ninja'
  }
})

fastify.get('/fact', async function (req, reply) {
  const response = await this.axios.ninja.get('/fact')
  return response.data
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err
})
```

You may also supply a pre-started instance of `axios`:

```js
const fastify = require('fastify')()
const axios = require('axios')

fastify.register(require('fastifyaxios'), {
  name: 'ninja',
  client: axios.create({
    baseURL: 'https://catfact.ninja'
  })
})

fastify.get('/fact', async function (req, reply) {
  const response = await this.axios.ninja.get('/fact')
  return response.data
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err
})
```

Notes:

- option `name` is **required** to supply a pre-started instance or axios cofig (as the code examples above. It set name like 'ninja')

## Reference

This plugin decorates the `fastify` instance with a `axios` API. See more about [Axios API](https://axios-http.com/docs/intro).

The plugin options has the following properties:

- `name` is the name of axios intance
- `client` is the [`AxiosInstance`](https://axios-http.com/docs/instance)
- `config` is the [`AxiosRequestConfig`](https://axios-http.com/docs/req_config)

The `client` can also be directly supply from a existent `axios` client.

A `name` option can be used in order to create multiple `axios` instances.

```js
const fastify = require('fastify')()
const axios = require('axios')

fastify
  .register(require('fastifyaxios'), {
    name: 'ninja',
    client: axios.create({
      baseURL: 'https://catfact.ninja'
    })
  })
  .register(require('fastifyaxios'), {
    name: 'public',
    client: axios.create({
      baseURL: 'https://api.publicapis.org'
    })
  })

fastify.get('/', async function (req, reply) {
  const [response1, response2] = await Promise.all([
    fastify.axios.ninja.get('/fact'),
    fastify.axios.public.get('/categories')
  ])

  return {
    response1: response1.data,
    response2: response2.data
  }
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err
})
```

You can separate in different files to organize your project with multiple axios clients to set interceptors handlers and any other configuration more complex that you application need.

## License

Licensed under [MIT](./LICENSE).
