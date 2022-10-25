import axios from "axios"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { getValidMoves } from "../../utils/chessUtils"
import Menu from "../menu/Menu"
import Block from "./Block"
import PromotionChoiceBlock from "./PromotionChoiceBlock"
const Board = () => {
  const [game, setGame] = useState()
  const [moves, setMoves] = useState()
  const [pieceLocation, setPieceLocation] = useState()
  const [showPromotionChoice, setShowPromotionChoice] = useState(false)
  const [showMenu, setShowMenu] = useState(true)

  const socket = io.connect("http://localhost:3001")

  socket.on("respone", () => {
    console.log("bbbb")
    getGame()
  })

  const getGame = async () => {
    const gameId = window.sessionStorage.getItem("gameId")
    const res = await axios.get(`http://localhost:3001/game/${gameId}`)
    setGame(res.data)
  }

  const getAvailableMoves = (position) => {
    if (
      game.board[position.y][position.x].color ===
      window.sessionStorage.getItem("role")
    ) {
      setMoves(getValidMoves(game, position))
      setPieceLocation(position)
    }
  }

  const playTurn = async (Yindex, Xindex) => {
    const gameId = window.sessionStorage.getItem("gameId")
    const res = await axios.patch(`http://localhost:3001/game/play/${gameId}`, {
      position: pieceLocation,
      newPosition: { y: Yindex, x: Xindex },
    })
    setGame(res.data)
    setMoves()
    socket.emit("played", "1")
  }

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

  if (game?.result) {
    return <h1>{game?.result}</h1>
  } else {
    return (
      <>
        <Menu
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          result={game?.result}
          setGame={setGame}
          socket={socket}
        />
        <div
          className={` w-full h-full pt-6 ${
            window.sessionStorage.getItem("role") === "White"
              ? ""
              : "rotate-180 pt-0 pb-6"
          }`}
        >
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
      </>
    )
  }
}
export default Board
