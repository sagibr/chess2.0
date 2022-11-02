import {
  CHECKMATES_FOUND,
  evaluateDeapth,
  POSITIONS_SEARCHED,
  resetCheckmatesFound,
  resetPositionsSearched,
} from "./controllers/aiController.js"
import { getGame, playTurn, promotePawn } from "./controllers/gameController.js"

const ai = async (socket, diffeculty) => {
  socket.on("respone", async (args) => {
    if (args.turn === "Black") {
      const gameId = args.gameId
      const game = await getGame(gameId)

      console.time("evalute: ")
      const searchResult = evaluateDeapth(diffeculty, game, "Black")
      console.timeEnd("evalute: ")

      console.log(`positions searched: ${POSITIONS_SEARCHED}`)
      console.log(`checkmates found: ${CHECKMATES_FOUND}`)

      const path = searchResult.path

      await playTurn(path.position, path.newPosition, gameId)
      if (
        path.newPosition.y === 7 &&
        game.board[path.position.y][path.position.x].kind === "Pawn"
      ) {
        await promotePawn("Queen", gameId)
      }
      socket.emit("played", {
        roomId: args.roomId,
        position: path.position,
        newPosition: path.newPosition,
        turn: args.turn === "White" ? "Black" : "White",
        positionSearched: POSITIONS_SEARCHED,
        checkmatsFound: CHECKMATES_FOUND,
      })
      resetPositionsSearched()
      resetCheckmatesFound()
    }
  })
}

export const startGame = async (socket, roomId, prevRoomId, diffeculty) => {
  if (prevRoomId && prevRoomId !== "null") {
    console.log(`leaving room ${prevRoomId}`)
    socket.emit("leave", prevRoomId)
  }
  console.log(`joining room ${roomId}`)
  socket.emit("join", roomId, async () => {
    await ai(socket, diffeculty)
  })
}
