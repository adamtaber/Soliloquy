import express from 'express'
import http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import resolvers from './graphql/resolvers'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { PORT, isProduction } from './config'
import { typeDefs, checkToken } from './utils'

const app = express()
const httpServer = http.createServer(app)

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
}

startServer()

