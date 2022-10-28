const MainMenu = ({
  setShowMenu,
  setShowJoinRoom,
  setShowDiffecultySelection,
  result,
}) => {
  return (
    <div className="h-screen w-screen bg-black bg-opacity-70 absolute z-10">
      <div className="flex flex-col absolute top-1/4 w-full items-center">
        <h1 className="text-blue-600 font-bold text-6xl mb-8">{result}</h1>

        <button
          className="bg-blue-500 w-1/6 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={async () => {
            setShowDiffecultySelection(true)
          }}
        >
          Play Againts AI
        </button>
        <button
          className="bg-blue-500 w-1/6 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={() => {
            setShowJoinRoom(true)
          }}
        >
          Play Online
        </button>
        <button
          className="bg-gray-400 w-1/6 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={async () => {
            setShowMenu(false)
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
export default MainMenu
