import axios from "axios"

export const getGame = async (id) => {
  const res = await axios.get(
    `https://chess2-0-server.herokuapp.com/game/${id}`
  )
  return res.data
}
export const playTurn = async (position, newPosition, id) => {
  const res = await axios.patch(
    `https://chess2-0-server.herokuapp.com/game/play/${id}`,
    {
      position: position,
      newPosition: newPosition,
    }
  )
  return res.data
}
export const promotePawn = async (promotion, id) => {
  const res = await axios.patch(
    `https://chess2-0-server.herokuapp.com/game/promote/${id}`,
    {
      promotion: promotion,
    }
  )
  return res.data
}
