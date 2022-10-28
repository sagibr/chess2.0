import {
  GiChessBishop,
  GiChessKing,
  GiChessKnight,
  GiChessPawn,
  GiChessQueen,
  GiChessRook,
} from "react-icons/gi"

const piecesIcons = {
  Pawn: <GiChessPawn className={`text-6xl`} />,
  Rook: <GiChessRook className={`text-6xl`} />,
  Bishop: <GiChessBishop className={`text-6xl`} />,
  Knight: <GiChessKnight className={`text-6xl`} />,
  King: <GiChessKing className={`text-6xl`} />,
  Queen: <GiChessQueen className={`text-6xl`} />,
}
export default piecesIcons
