import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import bodyParser from 'body-parser';
import { prismaclient } from '../clients/db';
import { User } from './user';
import {Tweet} from './tweet'
import cors from 'cors'
import { GraphQLContext, JWTUSER } from '../interfaces';
import JWTSERVICE from '../services/jwt';


export async function initServer() {
    const app = express();
    app.use(bodyParser.json());
    app.use(cors())

    const typeDefs = `
      ${User.types}
      ${Tweet.types}

        type Query {
            ${User.queries}
                    }

        type Mutation {
            ${Tweet.mutations}
        }
    `;

    const resolvers = {
        Query: {
         ...User.resolvers.queries
        },
        Mutation:{
            ...Tweet.resolvers.mutations
        }
    };

    const graphQLServer = new ApolloServer<GraphQLContext>({
        typeDefs,
        resolvers,
    });

    await graphQLServer.start();
    app.use('/graphql', expressMiddleware(graphQLServer,{
        context:async({req,res})=>{
            return  {
                user:req.headers.authorization? JWTSERVICE.deCodeToken(req.headers.authorization.split("Bearer ")[1]) : undefined
            }
               
        }
    }));

    return app;
}
