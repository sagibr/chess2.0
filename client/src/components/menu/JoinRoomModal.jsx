import { useState } from "react"

const JoinRoomModal = ({
  startGame,
  setGame,
  setFirstGame,
  setShowMenu,
  setShowJoinRoom,
}) => {
  const [roomId, setRoomId] = useState()

  return (
    <div className="h-screen w-screen bg-black bg-opacity-70 absolute z-10">
      <div className="flex flex-col absolute top-1/3 w-full items-center">
        <input
          className="bg-gray-200 text-center lg:w-1/6 md:w-1/3 sm:w-1/2 w-1/2 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mb-4"
          value={roomId}
          onChange={(e) => {
            setRoomId(e.target.value)
          }}
          placeholder="room id..."
        ></input>
        <button
          className="bg-blue-500 lg:w-1/6 md:w-1/3 sm:w-1/2 w-1/2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={async () => {
            window.sessionStorage.setItem("roomId", roomId)
            const game = await startGame(roomId)
            setGame(game)
            setShowMenu(false)
            setShowJoinRoom(false)
          }}
        >
          Join Room
        </button>
        <button
          className="bg-gray-400 lg:w-1/6 md:w-1/3 sm:w-1/2 w-1/2 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={async () => {
            setShowJoinRoom(false)
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
export default JoinRoomModal
