import cors from "cors"
import express from "express"
import { io } from "socket.io-client"
import { startGame } from "./app.js"
import { SERVER_URL } from "./utils/config.js"

const app = express()

const PORT = process.env.PORT || 3002

app.use(cors())

const socket = io.connect(SERVER_URL)

app.get("/:roomId/:prevRoomId/:diffeculty", async (req, res) => {
  try {
    const prevRoomId = req.params.prevRoomId
    const roomId = req.params.roomId
    const diffeculty = req.params.diffeculty
    socket.removeAllListeners()
    await startGame(socket, roomId, prevRoomId, diffeculty)
    res.sendStatus(200)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

app.listen(PORT, () => {
  console.log(`service is up on https:/chess2-0-ai.herokuapp.com`)
})
