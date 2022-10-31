import { getGame, playTurn, promotePawn } from "./controllers/gameController.js"
import { boardEvaluation } from "./utils/boardEvaluation.js"
import { getPlayerPieces, getValidMoves } from "./utils/chessUtils.js"

const ai = async (socket, diffeculty) => {
  socket.on("respone", async (args) => {
    if (args.turn === "Black") {
      console.time("ai: ")
      const gameId = args.gameId
      console.log(gameId)
      console.time("game fetching from DB: ")
      const game = await getGame(gameId)
      console.timeEnd("game fetching from DB: ")
      let path
      console.log(diffeculty)
      console.time("evalute: ")
      path = evaluateDeapth(diffeculty, game, "Black")
      console.timeEnd("evalute: ")
      console.log(path.value)
      console.time("playing turn: ")
      await playTurn(path.position, path.newPosition, gameId)
      console.timeEnd("playing turn: ")
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
      console.timeEnd("ai: ")
    }
  })
}

const evaluateDeapth = (deapth, game, turn) => {
  const { board } = game

  let path = {
    value: null,
    position: { y: null, x: null },
    newPosition: { y: null, x: null },
  }

  const blackPieces = getPlayerPieces(board, "Black")
  const whitePieces = getPlayerPieces(board, "White")
  if (deapth === 0) {
    let lastStepPath

    lastStepPath = {
      value: boardEvaluation(board),
      position: { y: null, x: null },
      newPosition: { y: null, x: null },
    }
    return lastStepPath
  }
  if (turn === "Black") {
    let bestEvalueation = 100000

    for (const blackPiece of blackPieces) {
      const blackMoves = getValidMoves(game, blackPiece.position)
      for (const blackMove of blackMoves) {
        const oldPiece = {
          kind: board[blackMove.y][blackMove.x].kind,
          color: board[blackMove.y][blackMove.x].color,
        }
        movePiece(board, blackPiece.position, blackMove)
        const evaluation = evaluateDeapth(deapth - 1, game, "White").value
        if (evaluation <= bestEvalueation) {
          bestEvalueation = evaluation
          path = {
            position: blackPiece.position,
            newPosition: blackMove,
            value: bestEvalueation,
          }
        }
        unmovePiece(board, blackMove, blackPiece.position, oldPiece)
      }
    }
    path.value = bestEvalueation
  } else {
    let bestEvalueation = -100000

    for (const whitePiece of whitePieces) {
      const whiteMoves = getValidMoves(game, whitePiece.position)

      for (const whiteMove of whiteMoves) {
        const oldPiece = {
          kind: board[whiteMove.y][whiteMove.x].kind,
          color: board[whiteMove.y][whiteMove.x].color,
        }
        movePiece(board, whitePiece.position, whiteMove)
        const evaluation = evaluateDeapth(deapth - 1, game, "Black").value
        if (evaluation >= bestEvalueation) {
          bestEvalueation = evaluation
          path = {
            position: whitePiece.position,
            newPosition: whiteMove,
            value: bestEvalueation,
          }
        }
        unmovePiece(board, whiteMove, whitePiece.position, oldPiece)
      }
    }
    path.value = bestEvalueation
  }

  return path
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
