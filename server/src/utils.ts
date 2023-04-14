import jwt from 'jsonwebtoken'
// import { readFileSync } from 'fs'
import { JWT_SECRET } from './config'
import { jwtPayload } from './types'
import { ApolloServer } from '@apollo/server'
import resolvers from './graphql/resolvers'
import typeDefs from './graphql/schema'

// export const typeDefs = 
//   readFileSync('./src/graphql/schema/index.graphql', { encoding: 'utf-8' })

export const createTestServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers
  })
}

export const checkToken = (req: any) => {
  try {
    if (req.cookies.id) {
      const verification = 
        jwt.verify(req.cookies.id, JWT_SECRET as string) as jwtPayload
      return verification.userId
    }
    return false
  } catch(err) {
    console.log(err)
    return false
  }
}

