import jwt from 'jsonwebtoken'
import { CLOUDINARY_API_SECRET, JWT_SECRET } from './config'
import { jwtPayload } from './types'
import { ApolloServer } from '@apollo/server'
import resolvers from './graphql/resolvers'
import typeDefs from './graphql/schema'
import { PubSub } from 'graphql-subscriptions'
import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({
  secure: true
})

export const pubsub = new PubSub()

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

export const generateCloudinarySignature = () => {
  const timestamp = Math.round((new Date).getTime()/1000)
  if(!CLOUDINARY_API_SECRET) return false

  const signature = cloudinary.utils.api_sign_request(
    {timestamp: timestamp}, CLOUDINARY_API_SECRET)
  
  return { timestamp, signature }
}

