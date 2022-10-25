import http from "http"
import mongoose from "mongoose"
import { Server } from "socket.io"
import app from "./app.js"
import { initGame } from "./controllers/gameController.js"
import { connectDB } from "./db/DBController.js"
import { PORT } from "./utils/config.js"
//start socket
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST", "PATCH"] },
})

//connect to DB
connectDB()

//socket events
let role = "White"
let playerCount = 0
let game

io.on("connection", (socket) => {
  console.log("a user connected")
  socket.on("join", async (roomId, callback) => {
    socket.join(roomId)
    console.log(`user ${socket.id} joined room ${roomId}`)
    if (playerCount % 2 === 0) {
      game = await initGame()
    }
    callback(role, game)
    role = role === "White" ? "Black" : "White"
    playerCount++
  })

  socket.on("played", (roomId) => {
    console.log("aaaa")
    socket.to(roomId).emit("respone")
  })

  socket.on("disconnect", () => {
    console.log("user disconnected")
  })
})

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB")
  server.listen(PORT, async () => {
    console.log(`server is up and running at http://localhost:${PORT}`)
  })
})
