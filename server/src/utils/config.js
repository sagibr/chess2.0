import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT ? process.env.PORT : 3001
const MONGODB_URI = process.env.MONGODB_URI

export { PORT, MONGODB_URI }
