import axios from "axios"
import {
  GiChessBishop,
  GiChessKing,
  GiChessKnight,
  GiChessPawn,
  GiChessQueen,
  GiChessRook,
} from "react-icons/gi"
const dir = {
  Pawn: <GiChessPawn className="text-6xl" />,
  Rook: <GiChessRook className="text-6xl" />,
  Bishop: <GiChessBishop className="text-6xl" />,
  Knight: <GiChessKnight className="text-6xl" />,
  King: <GiChessKing className="text-6xl" />,
  Queen: <GiChessQueen className="text-6xl" />,
}

const Block = (props) => {
  const index = props.Yindex * 7 + props.Xindex

  const isMove = () => {
    if (props.moves) {
      for (const move of props.moves) {
        if (move.y === props.Yindex && move.x === props.Xindex) {
          return true
        }
      }
    }
    return false
  }

  if (isMove()) {
    return (
      <div
        onClick={props.playTurn}
        className={
          props.color === "Black"
            ? "w-16 h-full m-0 bg-green-800 border text-black"
            : "w-16 h-full m-0 bg-green-800 border text-white"
        }
      >
        {dir[props.kind]}
      </div>
    )
  } else {
    if (index % 2 === 0) {
      return (
        <div
          onClick={props.getAvailableMoves}
          className={
            props.color === "Black"
              ? "w-16 h-full m-0 bg-gray-500 text-black"
              : "w-16 h-full m-0 bg-gray-500 text-white"
          }
        >
          {dir[props.kind]}
        </div>
      )
    } else {
      return (
        <div
          onClick={props.getAvailableMoves}
          className={
            props.color === "Black"
              ? "w-16 h-full m-0  bg-amber-900 text-black"
              : "w-16 h-full m-0  bg-amber-900 text-white "
          }
        >
          {dir[props.kind]}
        </div>
      )
    }
  }
}
export default Block
