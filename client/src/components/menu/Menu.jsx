import { useState } from "react"

const Menu = ({ showMenu, setShowMenu, result, setGame, socket }) => {
  const [firstGame, setFirstGame] = useState(true)

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setShowMenu(!showMenu)
      setFirstGame(false)
    }
  })

  const startGame = async () => {
    socket.emit("join", "1", (role, game) => {
      window.sessionStorage.setItem("role", role)
      window.sessionStorage.setItem("gameId", game._id)
      setGame(game)
    })
  }
  return showMenu ? (
    firstGame ? (
      <div className="h-screen w-screen bg-black bg-opacity-70 absolute">
        <div className="flex flex-col absolute top-1/3 w-full items-center">
          <button
            className="bg-blue-500 w-1/6 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            onClick={async () => {
              const game = await startGame()
              setGame(game)
              setFirstGame(false)
              setShowMenu(false)
            }}
          >
            Play
          </button>
        </div>
      </div>
    ) : (
      <div className="h-screen w-screen bg-black bg-opacity-70 absolute">
        <div className="flex flex-col absolute top-1/4 w-full items-center">
          <p className="text-center text-5xl font-bold mb-6 text-blue-600 ">
            {result}
          </p>
          <button
            className="bg-blue-500 w-1/6 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            onClick={() => {
              setShowMenu(false)
            }}
          >
            Play Again
          </button>
          <button
            className="bg-blue-500 w-1/6 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            onClick={() => setShowMenu(false)}
          >
            Spectate
          </button>
          <button className="bg-blue-500 w-1/6 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
            Quit
          </button>
        </div>
      </div>
    )
  ) : (
    <></>
  )
}
export default Menu
