import mongoose from "mongoose"
import initializeGame from "../utils/assets/initializeGame.js"
import { MONGODB_URI } from "../utils/config.js"
import { Game } from "./models/game.js"

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
  } catch (err) {
    console.error(err)
  }
}
export const createNewGame = async () => {
  const game = await Game.create(initializeGame)
  return game
}

export const getGameById = async (id) => {
  const game = await Game.findById(id)
  return game
}

export const updateGame = async (newGame) => {
  try {
    const game = await Game.findByIdAndUpdate(newGame._id, newGame, {
      new: true,
    })
    return game
  } catch (err) {
    return undefined
  }
}

// export const deleteAllGames = async () => {
//   try {
//     await Game.deleteMany()
//   } catch (err) {
//     return undefined
//   }
// }
