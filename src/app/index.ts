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
            ${Tweet.queries}
                    }

        type Mutation {
            ${Tweet.mutations}
            ${User.mutations}
        }
    `;

    const resolvers = {
        Query: {
         ...User.resolvers.queries,
         ...Tweet.resolvers.queries
        },
        Mutation:{
            ...Tweet.resolvers.mutations,
            ...User.resolvers.mutations
        },
        ...Tweet.resolvers.extraResolvers,
        ...User.resolvers.extraResolvers
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
