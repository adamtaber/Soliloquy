import * as dotenv from 'dotenv'
dotenv.config()
import { isProduction } from './utils'

export const port = process.env.PORT || 3000
export const DB_HOST = isProduction() ? process.env.DB_HOST : process.env.DB_HOST_DEV
export const DB_USER = isProduction() ? process.env.DB_USER : process.env.DB_USER_DEV
export const DB_PASSWORD = isProduction() ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_DEV
export const DB_DATABASE = isProduction() ? process.env.DB_NAME : process.env.DB_NAME_DEV
export const DB_PORT = parseInt(process.env.DB_PORT || "5432")

