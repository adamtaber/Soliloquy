import express from 'express'
import http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import resolvers from './graphql/resolvers'
import typeDefs from './graphql/schema'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { PubSub } from 'graphql-subscriptions'
import { PORT, isProduction } from './config'
import { checkToken } from './utils'

const app = express()
const httpServer = http.createServer(app)
const schema = makeExecutableSchema({ typeDefs, resolvers })

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/'
})

const serverCleanup = useServer({ schema }, wsServer)

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose()
          }
        }
      }
    }
  ]
})

const startServer = async () => {
  await server.start()

  app.use(
    '/',
    cookieParser(),
    cors({
      origin: isProduction() ? false : ['https://sandbox.embed.apollographql.com', 'http://localhost:5173'],
      credentials: true
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }: any) => { 
        const authorizedId = checkToken(req)
        const pubsub = new PubSub()
        return {
          res,
          authorizedId,
          pubsub
        }
      }
    })
  )

  httpServer.listen(PORT, () =>
    console.log(`Server is listening on port ${PORT}`)
  )
}

startServer()

