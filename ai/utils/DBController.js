import axios from "axios"

export const getGame = async (id) => {
  const res = await axios.get(`http://localhost:3001/game/${id}`)
  return res.data
}
export const playTurn = async (position, newPosition, id) => {
  const res = await axios.patch(`http://localhost:3001/game/play/${id}`, {
    position: position,
    newPosition: newPosition,
  })
  return res.data
}
