import axios from "axios"

export const playTurn = async (position, newPosition) => {
  const gameId = window.sessionStorage.getItem("gameId")
  const res = await axios.patch(`http://localhost:3001/game/play/${gameId}`, {
    position: position,
    newPosition: newPosition,
  })
  return res
}

export const getGame = async () => {
  const gameId = window.sessionStorage.getItem("gameId")
  const res = await axios.get(`http://localhost:3001/game/${gameId}`)
  return res
}

export const enableAi = async (roomId, prevRoomId, diffeculty) => {
  const res = await axios.get(
    `http://localhost:3002/${roomId}/${prevRoomId}/${diffeculty}`
  )
  return res
}
