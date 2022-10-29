import { enableAi } from "../../controllers/gameController"

const DiffecultySelection = ({
  startGame,
  setShowMenu,
  setShowDiffecultySelection,
  socket,
}) => {
  return (
    <div className="h-screen w-screen bg-black bg-opacity-70 absolute z-10">
      <div className="flex flex-col absolute top-1/3 w-full items-center">
        <button
          className="bg-blue-400 lg:w-1/6 md:w-1/3 sm:w-1/2 w-1/2 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={async () => {
            const prevRoomId = window.sessionStorage.getItem("roomId")
            await startGame()
            const roomId = socket.id
            setShowMenu(false)
            setShowDiffecultySelection(false)
            await enableAi(roomId, prevRoomId, 1)
          }}
        >
          Easy
        </button>
        <button
          className="bg-blue-600 lg:w-1/6 md:w-1/3 sm:w-1/2 w-1/2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={async () => {
            const prevRoomId = window.sessionStorage.getItem("roomId")
            await startGame()
            const roomId = socket.id
            setShowMenu(false)
            setShowDiffecultySelection(false)
            await enableAi(roomId, prevRoomId, 2)
          }}
        >
          Medium
        </button>
        <button
          className="bg-blue-800 lg:w-1/6 md:w-1/3 sm:w-1/2 w-1/2 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={async () => {
            const prevRoomId = window.sessionStorage.getItem("roomId")
            await startGame()
            const roomId = socket.id
            setShowMenu(false)
            setShowDiffecultySelection(false)
            await enableAi(roomId, prevRoomId, 3)
          }}
        >
          Hard
        </button>
        <button
          className="bg-gray-400 lg:w-1/6 md:w-1/3 sm:w-1/2 w-1/2 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={async () => {
            setShowDiffecultySelection(false)
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
export default DiffecultySelection
