import axios from "axios"
import {
  GiChessBishop,
  GiChessKnight,
  GiChessQueen,
  GiChessRook,
} from "react-icons/gi"

const PromotionChoiceBlock = (props) => {
  const { color, setShowPromotionChoice, setGame } = props
  const role = window.sessionStorage.getItem("role")
  const promotePawn = async (promotionKind) => {
    const gameId = window.sessionStorage.getItem("gameId")
    const res = await axios.patch(
      `http://localhost:3001/game/promote/${gameId}`,
      {
        promotion: promotionKind,
      }
    )
    setGame(res.data)
    props.socket.emit("played", {
      roomId: props.roomId,
    })
  }
  return (
    props.showPromotionChoice && (
      <div
        className={`absolute w-1/3 left-0 right-0 text-center m-auto top-1/3 ${
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
