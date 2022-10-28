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
let playerCount = {}
let game = {}

io.on("connection", async (socket) => {
  console.log(`a user connected user  Id ${socket.id}`)
  socket.on("join", async (roomId, callback) => {
    socket.join(roomId)
    console.log(`user ${socket.id} joined room ${roomId}`)

    if (!playerCount[roomId]) {
      playerCount[roomId] = 0
      const newGame = await initGame()
      game[roomId] = newGame
      role = "White"
    } else if (playerCount[roomId] % 2 === 0) {
      role = "White"
      const newGame = await initGame()
      game[roomId] = newGame
    } else {
      role = "Black"
    }
    callback(role, game[roomId])
    playerCount[roomId]++
  })
  socket.on("leave", (roomId) => {
    socket.leave(roomId)
    console.log(`user ${socket.id} leaved room ${roomId}`)
  })

  socket.on("played", (args) => {
    io.to(args.roomId).emit("respone", args)
  })

  socket.on("disconnect", () => {
    console.log("user disconnected")
  })
})

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB")
  server.listen(PORT, async () => {
    console.log(`server is up and running at https://chess2-0-ai.herokuapp.com`)
  })
})
