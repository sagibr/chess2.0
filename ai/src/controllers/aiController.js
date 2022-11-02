import { dic } from "../utils/assets/piecePositionValue.js"
import { boardEvaluation } from "../utils/boardEvaluation.js"
import {
  getPlayerPieces,
  getValidMoves,
  isKingUnderThreat,
} from "../utils/chessUtils.js"

export let POSITIONS_SEARCHED = 0
export const resetPositionsSearched = () => {
  POSITIONS_SEARCHED = 0
}
export let CHECKMATES_FOUND = 0
export const resetCheckmatesFound = () => {
  CHECKMATES_FOUND = 0
}

export const evaluateDeapth = (
  deapth,
  game,
  turn,
  alpha = -100000,
  beta = 100000
) => {
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

  for (const piece of pieces) {
    const moves = getValidMoves(game, piece.position)
    movesSum += moves.length
    for (const move of moves) {
      POSITIONS_SEARCHED++
      const moveScoreGuess = guessMoveScore(game, move, piece.position, turn)
      let evaluation
      if (moveScoreGuess === 0) {
        const oldPiece = {
          kind: board[move.y][move.x].kind,
          color: board[move.y][move.x].color,
        }
        movePiece(board, piece.position, move)
        evaluation = -evaluateDeapth(
          deapth - 1,
          game,
          turn === "White" ? "Black" : "White",
          -beta,
          -alpha
        ).value
        unmovePiece(board, move, piece.position, oldPiece)
      } else {
        evaluation = -boardEvaluation(board) + moveScoreGuess
      }
      if (evaluation >= beta) {
        return { value: beta, path: path }
      }

      if (evaluation > alpha) {
        alpha = evaluation
        path = { position: piece.position, newPosition: move }
      }
    }
  }
  if (movesSum === 0) {
    if (isKingUnderThreat(board, turn)) {
      CHECKMATES_FOUND++
      return { value: -99999, path: path }
    }
    return { value: 0, path: path }
  }
  return { value: alpha, path: path }
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

const guessMoveScore = (game, move, piecePosition, playerColor) => {
  const { board } = game

  const enemyColor = playerColor === "White" ? "Black" : "White"
  const enemyPieces = getPlayerPieces(board, enemyColor)
  const enemyPawns = enemyPieces.filter((piece) => piece.kind === "Pawn")
  const enemyPawnsMoves = []
  for (const pawn of enemyPawns) {
    enemyPawnsMoves.push(...getValidMoves(game, pawn.position))
  }

  const position = piecePosition
  const newPosition = move

  const captureBlock = board[newPosition.y][newPosition.x]
  const originBlock = board[position.y][position.x]

  let moveScore = 0

  if (captureBlock.color === enemyColor) {
    moveScore =
      dic.basicValue[captureBlock.kind] - dic.basicValue[originBlock.kind]
  }
  if (playerColor === "Black") {
    if (newPosition.y === 7 && originBlock.kind === "Pawn") {
      moveScore += 800
    }
  } else {
    if (newPosition.y === 0 && originBlock.kind === "Pawn") {
      moveScore += 800
    }
  }
  for (const enemyPawnMove of enemyPawnsMoves) {
    if (
      newPosition.y === enemyPawnMove.y &&
      newPosition.x === enemyPawnMove.x
    ) {
      moveScore -= dic.basicValue[originBlock.kind]
    }
  }

  if (moveScore > 200) {
    return moveScore
  } else {
    return 0
  }
}
