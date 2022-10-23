import mongoose from "mongoose"
import app from "./app.js"
import { connectDB } from "./db/DBController.js"
import { PORT } from "./utils/config.js"

//connect to DB
connectDB()

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB")
  app.listen(PORT, async () => {
    console.log(`server is up and running at http://localhost:${PORT}`)
  })
})
