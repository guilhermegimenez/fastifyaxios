import { AxiosResponse } from 'axios';
import { fastifyAxios } from './index.d';
import fastify from 'fastify';
import { expectType } from 'tsd';

const app = fastify();

app
  .register(fastifyAxios, {
      name: 'testAxios',
      config: {
        baseURL: 'https://api.publicapis.org'
      }
  })
  .after(async (err) => {
    const result = await app.axios.testAxios.get('/entries');
    expectType<AxiosResponse>(result);
  });
