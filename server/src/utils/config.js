import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT ? process.env.PORT : 3001
const MONGODB_URI = process.env.MONGODB_URI
const CLIENT_URL = process.env.CLIENT_URL
const AI_URL = process.env.AI_URL

export { PORT, MONGODB_URI, CLIENT_URL, AI_URL }
