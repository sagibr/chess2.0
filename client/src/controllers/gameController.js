import axios from "axios"

export const playTurn = async (position, newPosition) => {
  const gameId = window.sessionStorage.getItem("gameId")
  const res = await axios.patch(
    `https://chess2-0-server.herokuapp.com/game/play/${gameId}`,
    {
      position: position,
      newPosition: newPosition,
    }
  )
  return res
}

export const getGame = async () => {
  const gameId = window.sessionStorage.getItem("gameId")
  const res = await axios.get(
    `https://chess2-0-server.herokuapp.com//game/${gameId}`
  )
  return res
}

export const enableAi = async (roomId, prevRoomId, diffeculty) => {
  const res = await axios.get(
    `https://chess2-0-ai.herokuapp.com//${roomId}/${prevRoomId}/${diffeculty}`
  )
  return res
}
