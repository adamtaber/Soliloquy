import * as dotenv from 'dotenv'
// dotenv.config({ path: `.env.${process.env.NODE_ENV}`})
dotenv.config()

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production'
}

export const isTest = (): boolean => {
  return process.env.NODE_ENV === 'test'
}

export const PORT = process.env.PORT || 3000
export const JWT_SECRET = process.env.JWT_SECRET
export const DB_PORT = parseInt(process.env.DB_PORT || "5432")
export const DB_HOST = process.env.DB_HOST
export const DB_USER = process.env.DB_USER
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_DATABASE = process.env.DB_NAME
export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
export const DATABASE_URL = process.env.DATABASE_URL


