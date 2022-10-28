import { useEffect, useState } from "react"
import DiffecultySelection from "./DiffecultySelection"
import JoinRoomModal from "./JoinRoomModal"
import MainMenu from "./MainMenu"

const Menu = ({
  showMenu,
  setShowMenu,
  result,
  setGame,
  socket,
  setLastMove,
}) => {
  const [showJoinRoom, setShowJoinRoom] = useState(false)
  const [showDiffecultySelection, setShowDiffecultySelection] = useState(false)

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setShowMenu(true)
    }
  })

  const startGame = async (roomId) => {
    const prevRoomId = window.sessionStorage.getItem("roomId")
    await socket.emit("leave", prevRoomId)
    window.sessionStorage.setItem("roomId", roomId || socket.id)
    await socket.emit("join", roomId || socket.id, (role, game) => {
      setLastMove()
      window.sessionStorage.setItem("role", role)
      window.sessionStorage.setItem("gameId", game._id)
      setGame(game)
    })
  }

  useEffect(() => {
    if (result) {
      setShowDiffecultySelection(false)
      setShowJoinRoom(false)
      setShowMenu(true)
    }
  }, [result])
  return showMenu ? (
    showJoinRoom ? (
      <JoinRoomModal
        startGame={startGame}
        setGame={setGame}
        setShowMenu={setShowMenu}
        setShowJoinRoom={setShowJoinRoom}
      />
    ) : showDiffecultySelection ? (
      <DiffecultySelection
        startGame={startGame}
        setGame={setGame}
        setShowMenu={setShowMenu}
        setShowDiffecultySelection={setShowDiffecultySelection}
        socket={socket}
      />
    ) : (
      <MainMenu
        result={result}
        startGame={startGame}
        setGame={setGame}
        setShowMenu={setShowMenu}
        setShowJoinRoom={setShowJoinRoom}
        setShowDiffecultySelection={setShowDiffecultySelection}
      />
    )
  ) : (
    <></>
  )
}
export default Menu
