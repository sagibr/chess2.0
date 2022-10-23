import axios from "axios"
import { useEffect, useState } from "react"
import { getValidMoves } from "../../utils/chessUtils"
import Block from "./Block"
import PromotionChoiceBlock from "./PromotionChoiceBlock"

const Board = () => {
  const [game, setGame] = useState()
  const [moves, setMoves] = useState()
  const [pieceLocation, setPieceLocation] = useState()
  const [showPromotionChoice, setShowPromotionChoice] = useState(false)

  const getGame = async () => {
    const res = await axios.get(
      `http://localhost:3001/game/6354dfe8dc2e2e07284aaa58`
    )
    setGame(res.data)
  }
  const getAvailableMoves = (position) => {
    setMoves(getValidMoves(game, position))
    setPieceLocation(position)
  }
  useEffect(() => {
    getGame()
  }, [])
  useEffect(() => {
    const board = game?.board
    for (let y = 0; y < board?.length; y++) {
      for (let x = 0; x < board[y]?.length; x++) {
        const piece = board[y][x]
        if (piece.kind === "Pawn") {
          if (piece.color === "White" && y === 0) {
            setShowPromotionChoice(true)
          }
          if (piece.color === "Black" && y === 7) {
            setShowPromotionChoice(true)
          }
        }
      }
    }
  }, [game])

  const playTurn = async (Yindex, Xindex) => {
    const res = await axios.patch(
      "http://localhost:3001/game/play/6354dfe8dc2e2e07284aaa58",
      {
        position: pieceLocation,
        newPosition: { y: Yindex, x: Xindex },
      }
    )
    setGame(res.data)
    setMoves()
  }
  if (game?.result) {
    return <h1>{game?.result}</h1>
  } else {
    return (
      <div className="w-full h-full pt-6">
        {game?.board?.map((row, Yindex) => {
          return (
            <div key={Yindex} className="h-16 w-fit m-auto flex    ">
              {row.map((block, Xindex) => {
                return (
                  <Block
                    key={Xindex}
                    kind={block.kind}
                    color={block.color}
                    Yindex={Yindex}
                    Xindex={Xindex}
                    getAvailableMoves={() =>
                      getAvailableMoves({ y: Yindex, x: Xindex })
                    }
                    moves={moves}
                    playTurn={() => playTurn(Yindex, Xindex)}
                  ></Block>
                )
              })}
            </div>
          )
        })}
        {showPromotionChoice && (
          <PromotionChoiceBlock
            color={game.turn}
            setShowPromotionChoice={setShowPromotionChoice}
            setGame={setGame}
          />
        )}
      </div>
    )
  }
}
export default Board
