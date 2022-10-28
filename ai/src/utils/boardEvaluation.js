import { getKingPosition, getPlayerPieces } from "./chessUtils.js"
import { getPieceEndGameEval, getPieceEval } from "./pieceEvaluation.js"

export const boardEvaluation = (board) => {
  const whitePieces = getPlayerPieces(board, "White")
  const blackPieces = getPlayerPieces(board, "Black")

  let whiteValue = 0
  let blackValue = 0

  for (const piece of whitePieces) {
    whiteValue = whiteValue + getPieceEval(piece)
  }
  for (const piece of blackPieces) {
    if (whitePieces.length > 7) {
      blackValue = blackValue + getPieceEval(piece)
    } else {
      const kingPosition = getKingPosition(board, "White")
      blackValue = blackValue + getPieceEndGameEval(piece, kingPosition)
    }
  }
  const boardValue = whiteValue - blackValue

  return boardValue
}
