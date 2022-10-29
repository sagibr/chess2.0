import axios from "axios"
import { SERVER_URL } from "../utils/config.js"

export const getGame = async (id) => {
  const res = await axios.get(`${SERVER_URL}/game/${id}`)
  return res.data
}
export const playTurn = async (position, newPosition, id) => {
  const res = await axios.patch(`${SERVER_URL}/game/play/${id}`, {
    position: position,
    newPosition: newPosition,
  })
  return res.data
}
export const promotePawn = async (promotion, id) => {
  const res = await axios.patch(`${SERVER_URL}/game/promote/${id}`, {
    promotion: promotion,
  })
  return res.data
}
