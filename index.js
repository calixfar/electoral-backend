import {resolvers} from './data.js/resolvers'
import {ApolloServer} from 'apollo-server-express';
import {typeDefs} from './data.js/schema'
import express from 'express'
import dotenv from 'dotenv'
dotenv.config({path: 'variables.env'})
import jwt from 'jsonwebtoken';
const app = express();

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context : async ({req}) => {
        const token = req.headers['authorization'];
        if(token !== 'null'){
            try {
                //verificar el token del cliente
                const usuarioActual = await jwt.verify(token, process.env.SECRETO)
                req.usuarioActual = usuarioActual;
                return {usuarioActual}
            } catch (error) {
                console.log(error)
            }
        }
    }

    });

server.applyMiddleware({app})
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen({port},{host}, () => console.log(`Servidor corriendo en http://localhost:4000${server.graphqlPath}`))