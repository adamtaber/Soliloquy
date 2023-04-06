import express from 'express'
import http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { PORT } from './config'
import { connectToDB } from './db/config'
import { resolvers } from './graphql-test/resolvers'
// import { typeDefs } from './graphql-test/schema'
import { readFileSync } from 'fs'
import { checkToken, isProduction } from './utils'
const typeDefs = readFileSync('./src/graphql-test/schema.graphql', { encoding: 'utf-8' })

const app = express()
const httpServer = http.createServer(app)
connectToDB()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

const startServer = async () => {
  await server.start()

  app.use(
    '/',
    cookieParser(),
    cors({
      origin: isProduction() ? false : 'https://sandbox.embed.apollographql.com',
      credentials: true
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }: any) => { 
        const userId = checkToken(req)
        
        return {
          res,
          userId
        }
      }
    })
  )

  httpServer.listen(PORT, () =>
    console.log(`Server is listening on port ${PORT}`)
  )
}

startServer()

