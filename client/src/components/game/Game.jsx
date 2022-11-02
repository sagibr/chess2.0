import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { getGame, playTurn } from "../../controllers/gameController"
import { getValidMoves } from "../../utils/chessUtils"
import Loading from "../menu/Loading"
import Menu from "../menu/Menu"
import Board from "./Board"
import PromotionChoiceBlock from "./PromotionChoiceBlock"

const socket = io.connect(process.env.REACT_APP_SERVER_URL)
const Game = () => {
  const [game, setGame] = useState()
  const [moves, setMoves] = useState()
  const [pieceLocation, setPieceLocation] = useState()
  const [showPromotionChoice, setShowPromotionChoice] = useState(false)
  const [showMenu, setShowMenu] = useState(true)
  const [lastMove, setLastMove] = useState({})
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ positionSearched: 0, checkmatsFound: 0 })
  const role = window.sessionStorage.getItem("role")
  const roomId = window.sessionStorage.getItem("roomId")

  useEffect(() => {
    socket.on("respone", async (args) => {
      let res = await getGame()
      //retry game fetching if game havent changed
      if (res.data.board[args.position?.y][args.position?.x].kind !== null) {
        res = await getGame()
      }
      setLastMove({ position: args.newPosition, oldPosition: args.position })
      setGame(res.data)
      setStats({
        positionSearched: args.positionSearched,
        checkmatsFound: args.checkmatsFound,
      })
    })
    // eslint-disable-next-line
  }, [socket])

  useEffect(() => {
    const board = game?.board
    for (let y = 0; y < board?.length; y++) {
      for (let x = 0; x < board[y]?.length; x++) {
        const piece = board[y][x]
        if (piece.kind === "Pawn") {
          if (role === "White")
            if (piece.color === "White" && y === 0) {
              setShowPromotionChoice(true)
            }
          if (role === "Black")
            if (piece.color === "Black" && y === 7) {
              setShowPromotionChoice(true)
            }
        }
      }
    }
    if (game?.result) {
      setShowMenu(true)
    }
    // eslint-disable-next-line
  }, [game])

  const play = async (newPosition) => {
    setLastMove({ position: newPosition, oldPosition: pieceLocation })
    setMoves()

    const newGame = game
    newGame.board[newPosition.y][newPosition.x].color =
      newGame.board[pieceLocation.y][pieceLocation.x].color
    newGame.board[newPosition.y][newPosition.x].kind =
      newGame.board[pieceLocation.y][pieceLocation.x].kind
    newGame.board[pieceLocation.y][pieceLocation.x].kind = null
    newGame.board[pieceLocation.y][pieceLocation.x].color = null
    newGame.turn = newGame.turn === "White" ? "Black" : "White"
    setGame({ ...newGame, turn: newGame.turn })
    const res = await playTurn(pieceLocation, newPosition)
    setGame(res.data)
    if (
      (game.board[newPosition.y][newPosition.x].kind === "Pawn" &&
        game.board[newPosition.y][newPosition.x].color === "White" &&
        newPosition.y === 0) ||
      (game.board[newPosition.y][newPosition.x].kind === "Pawn" &&
        game.board[newPosition.y][newPosition.x].color === "Black" &&
        newPosition.y === 7)
    ) {
    } else {
      socket.emit("played", {
        roomId: roomId,
        position: pieceLocation,
        newPosition: newPosition,
        turn: newGame.turn,
        gameId: newGame._id,
        positionSearched: stats.positionSearched,
        checkmatsFound: stats.checkmatsFound,
      })
    }
  }

  const getAvailableMoves = (position) => {
    if (game.board[position.y][position.x].color === role) {
      setMoves(getValidMoves(game, position))
      setPieceLocation(position)
    }
  }
  return loading ? (
    <Loading />
  ) : (
    <>
      <Menu
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        result={game?.result}
        setGame={setGame}
        socket={socket}
        setLastMove={setLastMove}
        loading={loading}
        setLoading={setLoading}
      />
      <div
        className={` w-full lg:h-full lg:pt-10 md:pt-20 sm:pt-32 pt-32 h-screen bg-background  ${
          window.sessionStorage.getItem("role") === "White"
            ? ""
            : "rotate-180 lg:pt-0 md:pt-0 sm:pt-0 pt-0 lg:pb-10 md:pb-20 sm:pb-32 pb-48"
        }`}
      >
        {stats.positionSearched && (
          <>
            <h1 className="lg:absolute left-7 top-32 text-white font-bold text-4xl">
              Stats:
            </h1>
            <h1 className="lg:absolute left-7 top-48 text-white font-bold text-xl">
              Positions Searched: {stats.positionSearched}
            </h1>
            <h1 className="lg:absolute left-7 top-56 text-white font-bold text-xl mb-10 ">
              Checkmats Found: {stats.checkmatsFound}
            </h1>
          </>
        )}

        <Board
          game={game}
          getAvailableMoves={getAvailableMoves}
          moves={moves}
          playTurn={play}
          lastMove={lastMove}
        />
        {
          <PromotionChoiceBlock
            roomId={roomId}
            socket={socket}
            showPromotionChoice={showPromotionChoice}
            setShowPromotionChoice={setShowPromotionChoice}
            setGame={setGame}
            game={game}
            pieceLocation={pieceLocation}
          />
        }
      </div>
    </>
  )
}
export default Game
