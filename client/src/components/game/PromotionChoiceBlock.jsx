import axios from "axios"
import { useState } from "react"
import {
  GiChessBishop,
  GiChessKnight,
  GiChessQueen,
  GiChessRook,
} from "react-icons/gi"

const PromotionChoiceBlock = ({ color, setShowPromotionChoice, setGame }) => {
  const promotePawn = async (promotionKind) => {
    const res = await axios.patch(
      "http://localhost:3001/game/promote/6354dfe8dc2e2e07284aaa58",
      {
        promotion: promotionKind,
      }
    )
    setGame(res.data)
  }

  return (
    <div className=" absolute w-1/3 left-0 right-0 text-center m-auto top-1/3">
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
            color === "White"
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
            color === "White"
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
            color === "White"
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
            color === "White"
              ? "w-1/4 h-1/5 m-0 bg-green-800 border text-8xl text-black"
              : "w-1/4 h-1/5 m-0 bg-green-800 border text-8xl text-white"
          }
        >
          <GiChessRook />
        </div>
      </div>
    </div>
  )
}

export default PromotionChoiceBlock
