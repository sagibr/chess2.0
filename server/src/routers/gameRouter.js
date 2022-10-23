import express from "express"
import {
  getGame,
  initGame,
  playTurn,
  promotePawn,
} from "../controllers/gameController.js"

const router = express.Router()

router.get("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const game = await getGame(id)
    res.send(game)
  } catch (error) {
    res.sendStatus(500)
  }
})

router.post("/", async (req, res) => {
  try {
    const game = await initGame()
    res.send(game)
  } catch (error) {
    res.sendStatus(500)
  }
})

router.patch("/play/:id", async (req, res) => {
  const { id } = req.params
  const { position, newPosition } = req.body
  const game = await getGame(id)

  const updatedGame = await playTurn(game, position, newPosition)

  res.send(updatedGame)
})
router.patch("/promote/:id", async (req, res) => {
  const { id } = req.params
  const { promotion } = req.body
  const game = await getGame(id)

  const updatedGame = await promotePawn(game, promotion)

  res.send(updatedGame)
})

export default router
