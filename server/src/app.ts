import express from 'express'
// import process from 'process'
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
import { seedContent } from './db/seed'

const app = express()
const httpServer = http.createServer(app)
const schema = makeExecutableSchema({ typeDefs, resolvers })

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/'
})

const serverCleanup = useServer(
  { 
    schema,
    context: async (ctx, msg, args) => {
      const pubsub = new PubSub()
      return {ctx, msg, args, pubsub }
    }
  }, 
  wsServer)

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
      origin: isProduction() 
        // ? false 
        ? [
          'https://main--moonlit-crumble-e0d8c0.netlify.app',
          'https://sandbox.embed.apollographql.com', 
          'http://172.20.0.4:4173',
          'http://localhost:4173'
          ]
        : [
          'https://main--moonlit-crumble-e0d8c0.netlify.app',
          'https://sandbox.embed.apollographql.com', 
          'http://localhost:4173',
          'http://172.20.0.4:4173',
          ],
      credentials: true
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }: any) => { 
        const authorizedId = checkToken(req)
        return {
          res,
          authorizedId
        }
      }
    })
  )

  httpServer.listen(PORT, () =>
    console.log(`Server is listening on port ${PORT}`)
  )

  // console.log(process.memoryUsage())

  // setInterval(logMemoryUsage, 5000);

  // function logMemoryUsage() {
  //   const formatMemoryUsage = (data: any) => `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;
  //   const memoryData = process.memoryUsage();
  //   console.log({
  //     rss: `${formatMemoryUsage(memoryData.rss)}`,
  //     heapTotal: `${formatMemoryUsage(memoryData.heapTotal)}`,
  //     heapUsed: `${formatMemoryUsage(memoryData.heapUsed)}`,
  //     external: `${formatMemoryUsage(memoryData.external)}`,
  //   });
  // }

    // httpServer.listen(Number(PORT), '0.0.0.0', () => 
    //   console.log(`Server is listening on port ${PORT}`)
    // )
  }

startServer()

seedContent()

