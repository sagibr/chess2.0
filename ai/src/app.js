import { getGame, playTurn, promotePawn } from "./controllers/gameController.js"
import { boardEvaluation } from "./utils/boardEvaluation.js"
import {
  getPlayerPieces,
  getValidMoves,
  isKingUnderThreat,
} from "./utils/chessUtils.js"

const ai = async (socket, diffeculty) => {
  socket.on("respone", async (args) => {
    if (args.turn === "Black") {
      const gameId = args.gameId
      const game = await getGame(gameId)
      let path
      console.time("evalute: ")
      path = evaluateDeapth(diffeculty, game, "Black").path
      console.timeEnd("evalute: ")
      console.log(path.value)
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
      })
    }
  })
}

const evaluateDeapth = (deapth, game, turn) => {
  const { board } = game
  let path = {
    position: { y: null, x: null },
    newPosition: { y: null, x: null },
  }

  if (deapth === 0) {
    return { value: boardEvaluation(board), path }
  }

  const pieces = getPlayerPieces(board, turn)
  let movesSum = 0
  let bestEvalueation = -100000

  for (const piece of pieces) {
    const moves = getValidMoves(game, piece.position)
    movesSum += moves.length
    for (const move of moves) {
      const oldPiece = {
        kind: board[move.y][move.x].kind,
        color: board[move.y][move.x].color,
      }
      movePiece(board, piece.position, move)
      const evaluation = -evaluateDeapth(
        deapth - 1,
        game,
        turn === "White" ? "Black" : "White"
      ).value
      if (evaluation >= bestEvalueation) {
        path = { position: piece.position, newPosition: move }
        bestEvalueation = evaluation
      }

      unmovePiece(board, move, piece.position, oldPiece)
    }
  }
  if (movesSum === 0) {
    if (isKingUnderThreat(board, turn)) {
      return { value: -100000, path: path }
    }
    return { value: 0, path: path }
  }
  return { value: bestEvalueation, path: path }
}

const movePiece = (board, position, newPosition) => {
  board[newPosition.y][newPosition.x].kind = board[position.y][position.x].kind

  board[newPosition.y][newPosition.x].color =
    board[position.y][position.x].color

  board[position.y][position.x].color = null
  board[position.y][position.x].kind = null
}

const unmovePiece = (board, position, oldPosition, oldPiece) => {
  board[oldPosition.y][oldPosition.x].kind = board[position.y][position.x].kind

  board[oldPosition.y][oldPosition.x].color =
    board[position.y][position.x].color

  board[position.y][position.x].color = oldPiece.color
  board[position.y][position.x].kind = oldPiece.kind
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
