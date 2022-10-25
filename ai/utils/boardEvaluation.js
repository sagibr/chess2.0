import { getPlayerPieces } from "./chessUtils.js"
import { getGame } from "./DBController.js"
import { getPieceEval } from "./pieceEvaluation.js"

export const boardEvaluation = (board) => {
  const whitePieces = getPlayerPieces(board, "White")
  const blackPieces = getPlayerPieces(board, "Black")

  let whiteValue = 0
  let blackValue = 0

  for (const piece of whitePieces) {
    whiteValue = whiteValue + getPieceEval(piece)
  }
  for (const piece of blackPieces) {
    blackValue = blackValue + getPieceEval(piece)
  }
  const boardValue = whiteValue - blackValue

  return boardValue
}
