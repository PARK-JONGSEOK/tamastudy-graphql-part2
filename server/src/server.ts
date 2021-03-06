import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';
import mongoose from './db/mongoose';
import { errorName } from './error/constants';
import getErrorCode from './error/getErrorCode';
import schema from './schema';
import env from './env';

const main = async () => {
  const app = express();

  const server = new ApolloServer({
    schema,
    formatError: (err) => {
      const error = getErrorCode(err.message as keyof typeof errorName);
      return { message: error.message, statusCode: error.statusCode };
    },
  });

  server.applyMiddleware({ app });

  app.listen({ port: env.PORT }, () => {
    console.log(`🚀 Server ready and listening at ==> http://localhost:${env.PORT}${server.graphqlPath}`);
  });
};

main()
  .then(() => {
    mongoose();
  })
  .catch((error) => {
    console.log(error, 'error!');
  });
