import cors from "cors"
import express from "express"
import gameRouter from "./routers/gameRouter.js"

const app = express()

// Cross Origin Resource Sharing
app.use(cors())

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
app.use(express.json())

app.use("/game", gameRouter)

export default app
