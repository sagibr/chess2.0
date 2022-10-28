import { dic } from "./assets/piecePositionValue.js"

export const getPieceEval = (piece) => {
  const { kind, color, position } = piece

  const basicValue = dic.basicValue[kind]
  const pieceMulti =
    color === "White"
      ? dic[`${kind}PositionMulti`]
      : //reverse the array if black
        dic[`${kind}PositionMulti`]
          .slice()
          .map((row) => row.slice().reverse())
          .reverse()

  const pieceValue = basicValue + pieceMulti[position.y][position.x]

  return pieceValue
}
export const getPieceEndGameEval = (piece, kingPosition) => {
  const { kind, position } = piece

  if (kingPosition) {
    const kingPieceDistance = Math.abs(
      position.y - kingPosition.y + (position.x - kingPosition.x)
    )
    const basicValue = dic.basicValue[kind]
    const pieceMulti = -10 * kingPieceDistance

    const pieceValue = basicValue + pieceMulti

    return pieceValue
  } else {
    getPieceEval(piece)
  }
}
