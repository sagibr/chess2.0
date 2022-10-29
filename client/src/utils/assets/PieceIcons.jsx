import {
  GiChessBishop,
  GiChessKing,
  GiChessKnight,
  GiChessPawn,
  GiChessQueen,
  GiChessRook,
} from "react-icons/gi"

const piecesIcons = {
  Pawn: <GiChessPawn className={`lg:text-6xl  m-auto text-5xl`} />,
  Rook: <GiChessRook className={`lg:text-6xl m-auto text-5xl`} />,
  Bishop: <GiChessBishop className={`lg:text-6xl m-auto text-5xl`} />,
  Knight: <GiChessKnight className={`lg:text-6xl m-auto text-5xl`} />,
  King: <GiChessKing className={`lg:text-6xl m-auto text-5xl`} />,
  Queen: <GiChessQueen className={`lg:text-6xl m-auto text-5xl`} />,
}
export default piecesIcons
