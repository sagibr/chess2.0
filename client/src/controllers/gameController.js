import axios from "axios"

export const playTurn = async (position, newPosition) => {
  const gameId = window.sessionStorage.getItem("gameId")
  const res = await axios.patch(
    `${process.env.REACT_APP_SERVER_URL}/game/play/${gameId}`,
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
    `${process.env.REACT_APP_SERVER_URL}/game/${gameId}`
  )
  return res
}

export const enableAi = async (roomId, prevRoomId, diffeculty) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_AI_URL}/${roomId}/${prevRoomId}/${diffeculty}`
    )

    return res
  } catch (err) {
    return "error"
  }
}
