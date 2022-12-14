import axios from "axios"
import {
  GiChessBishop,
  GiChessKnight,
  GiChessQueen,
  GiChessRook,
} from "react-icons/gi"

const PromotionChoiceBlock = (props) => {
  const { setShowPromotionChoice, setGame } = props
  const role = window.sessionStorage.getItem("role")
  const promotePawn = async (promotionKind) => {
    const gameId = window.sessionStorage.getItem("gameId")
    const res = await axios.patch(
      `${process.env.REACT_APP_SERVER_URL}/game/promote/${gameId}`,
      {
        promotion: promotionKind,
      }
    )
    setGame(res.data)
    let newPosition = { y: null, x: null }
    for (let i = 0; i < 8; i++) {
      if (
        props.game.board[0][i].kind === "Pawn" &&
        props.game.board[0][i].color === "White"
      ) {
        newPosition = { y: 0, x: i }
      }
      if (
        props.game.board[7][i].kind === "Pawn" &&
        props.game.board[7][i].color === "Black"
      ) {
        newPosition = { y: 7, x: i }
      }
    }
    props.socket.emit("played", {
      position: props.pieceLocation,
      newPosition: newPosition,
      turn: props.game.turn,
      roomId: props.roomId,
      gameId: gameId,
    })
  }
  return (
    props.showPromotionChoice && (
      <div
        className={`absolute lg:w-1/3 md:w-2/4 sm:w-1/2  left-0 right-0 text-center m-auto top-1/3 md:top-1/4 ${
          role === "White" ? "" : "rotate-180"
        }`}
      >
        <p className="text-center text-3xl font-bold mb-1 text-gray-200">
          Choose your pawn promotion
        </p>
        <div className="flex h-full w-full ">
          <div
            onClick={() => {
              promotePawn("Bishop")
              setShowPromotionChoice(false)
            }}
            className={
              role === "Black"
                ? "w-1/4 h-1/5 m-0 bg-green-800 border text-8xl text-black"
                : "w-1/4 h-1/5 m-0 bg-green-800 border text-8xl text-white"
            }
          >
            <GiChessBishop />
          </div>
          <div
            onClick={() => {
              promotePawn("Knight")
              setShowPromotionChoice(false)
            }}
            className={
              role === "Black"
                ? "w-1/4 h-1/5 m-0 bg-green-800 border text-8xl text-black"
                : "w-1/4 h-1/5 m-0 bg-green-800 border text-8xl text-white"
            }
          >
            <GiChessKnight />
          </div>
          <div
            onClick={() => {
              promotePawn("Queen")
              setShowPromotionChoice(false)
            }}
            className={
              role === "Black"
                ? "w-1/4 h-1/5 m-0 bg-green-800 border text-8xl text-black"
                : "w-1/4 h-1/5 m-0 bg-green-800 border text-8xl text-white"
            }
          >
            <GiChessQueen />
          </div>
          <div
            onClick={() => {
              promotePawn("Rook")
              setShowPromotionChoice(false)
            }}
            className={
              role === "Black"
                ? "w-1/4 h-1/5 m-0 bg-green-800 border text-8xl text-black"
                : "w-1/4 h-1/5 m-0 bg-green-800 border text-8xl text-white"
            }
          >
            <GiChessRook />
          </div>
        </div>
      </div>
    )
  )
}

export default PromotionChoiceBlock
