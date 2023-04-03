import express from 'express'
import http from 'http'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { port } from './config'
import { connectToDB } from './db/config'
import { resolvers } from './graphql-test/resolvers'
import { typeDefs } from './graphql-test/schema'

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

  app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
  })
}

startServer()


