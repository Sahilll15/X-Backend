import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import bodyParser from 'body-parser';
import { prismaclient } from '../clients/db';
import { User } from './user';



export async function initServer() {
    const app = express();
    app.use(bodyParser.json());

    const typeDefs = `
      ${User.types}

        type Query {
            ${User.queries}
        }
    `;

    const resolvers = {
        Query: {
         ...User.resolvers.queries
        }
    };

    const graphQLServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await graphQLServer.start();
    app.use('/graphql', expressMiddleware(graphQLServer));

    return app;
}
