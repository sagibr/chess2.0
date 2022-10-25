import { io } from "socket.io-client"
import { boardEvaluation } from "./utils/boardEvaluation.js"
import { getPlayerPieces, getValidMoves } from "./utils/chessUtils.js"
import { getGame, playTurn } from "./utils/DBController.js"

const ai = async (game, socket) => {
  const gameId = game._id

  socket.on("respone", async () => {
    const game = await getGame(gameId)
    const whitePieces = getPlayerPieces(game.board, "White")
    const blackPieces = getPlayerPieces(game.board, "Black")
    let path
    // if (whitePieces.length + blackPieces.length < 20) {
    //   path = evaluateDeapth(4, game, "Black")
    // } else {
    path = evaluateDeapth(3, game, "Black")
    // }
    console.log(path.value)
    // await playAi(game)
    await playTurn(path.position, path.newPosition, gameId)
    socket.emit("played", "1")
  })
}

const playAi = async (game) => {
  const { board } = game
  const gameId = game._id

  const blackPieces = getPlayerPieces(board, "Black")
  const whitePieces = getPlayerPieces(board, "White")

  const paths = []

  for (const blackPiece of blackPieces) {
    const blackValidMoves = getValidMoves(game, blackPiece.position)
    for (const move of blackValidMoves) {
      const saveColor = board[move.y][move.x].color
      const saveKind = board[move.y][move.x].kind

      board[blackPiece.position.y][blackPiece.position.x].kind = null
      board[blackPiece.position.y][blackPiece.position.x].color = null
      board[move.y][move.x].kind = blackPiece.kind
      board[move.y][move.x].color = blackPiece.color

      let demoBoardValue = boardEvaluation(board)

      let secondStepValue = 0
      //loop over white pieces
      for (const whitePiece of whitePieces) {
        //get piece valid moves
        const whiteValidMoves = getValidMoves(game, whitePiece.position)
        for (const move of whiteValidMoves) {
          const saveColor = board[move.y][move.x].color
          const saveKind = board[move.y][move.x].kind
          //move piece in board
          board[whitePiece.position.y][whitePiece.position.x].kind = null
          board[whitePiece.position.y][whitePiece.position.x].color = null
          board[move.y][move.x].kind = whitePiece.kind
          board[move.y][move.x].color = whitePiece.color
          //evaluate board after movement
          let secondStepBoardValue = boardEvaluation(board)
          //if value is bigger then last value save it
          if (secondStepBoardValue > secondStepValue) {
            secondStepValue = secondStepBoardValue
          }
          //reset board
          board[whitePiece.position.y][whitePiece.position.x].kind =
            whitePiece.kind
          board[whitePiece.position.y][whitePiece.position.x].color =
            whitePiece.color
          board[move.y][move.x].kind = saveKind
          board[move.y][move.x].color = saveColor
        }
      }

      //demoBoardValue = demoBoardValue + secondStepValue
      demoBoardValue = demoBoardValue + secondStepValue

      paths.push({
        value: demoBoardValue,
        position: { y: blackPiece.position.y, x: blackPiece.position.x },
        newPosition: { y: move.y, x: move.x },
      })

      board[blackPiece.position.y][blackPiece.position.x].kind = blackPiece.kind
      board[blackPiece.position.y][blackPiece.position.x].color =
        blackPiece.color
      board[move.y][move.x].kind = saveKind
      board[move.y][move.x].color = saveColor

      demoBoardValue = 0
    }
  }
  let chosenPath = paths[0]
  for (const path of paths) {
    if (path.value < chosenPath.value) {
      chosenPath = path
    }
  }

  await playTurn(chosenPath.position, chosenPath.newPosition, gameId)
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
    const lastStepPath = {
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
        if (evaluation < bestEvalueation) {
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
        if (evaluation > bestEvalueation) {
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

const startGame = async (socket) => {
  socket.emit("join", "1", (role, game) => {
    ai(game, socket)
  })
}
const socket = io.connect("http://localhost:3001")

startGame(socket)
