import { dir } from "./assets/dir.js"

export const getPieceEval = (piece) => {
  const { kind, color, position } = piece

  const basicValue = dir.basicValue[kind]
  const pieceMulti =
    color === "White"
      ? dir[`${kind}PositionMulti`]
      : //reverse the array if black
        dir[`${kind}PositionMulti`]
          .slice()
          .map((row) => row.slice().reverse())
          .reverse()

  const pieceValue = basicValue + pieceMulti[position.y][position.x]

  return pieceValue
}
export const getPieceEndGameEval = (piece, kingPosition) => {
  const { kind, position } = piece

  const kingPieceDistance = Math.abs(
    position.y - kingPosition.y + (position.x - kingPosition.x)
  )
  const basicValue = dir.basicValue[kind]
  const pieceMulti = -10 * kingPieceDistance

  const pieceValue = basicValue + pieceMulti

  return pieceValue
}
