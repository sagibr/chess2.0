import { createNewGame, getGameById, updateGame } from "../db/DBController.js"
import { getValidMoves, isGameOver } from "../utils/chessUtils.js"

export const initGame = async () => {
  const game = await createNewGame()
  return game
}

export const getGame = async (id) => {
  const game = await getGameById(id)
  return game
}

export const playTurn = async (game, position, newPosition) => {
  //get all piece available moves
  let moves = getValidMoves(game, position)

  //if it is not the piece turn all moves are not valid
  if (game.turn !== game.board[position.y][position.x].color) {
    moves = []
  }

  //check if new position is in available moves
  for (const move of moves) {
    if (newPosition.y === move.y && newPosition.x === move.x) {
      //if piece is king or rook mark as moved in DB for castling check
      if (game.board[position.y][position.x].kind === "King") {
        game.canCastle[game.board[position.y][position.x].color].king = false
      }
      if (game.board[position.y][position.x].kind === "Rook") {
        position.x === 0
          ? (game.canCastle[
              game.board[position.y][position.x].color
            ].leftRook = false)
          : (game.canCastle[
              game.board[position.y][position.x].color
            ].rightRook = false)
      }
      if (game.board[position.y][position.x].kind === "King") {
        //if piece is king and is moving 2 steps it is castling
        if (position.x - newPosition.x === 2) {
          game.board[position.y][0].kind = null
          game.board[position.y][0].color = null

          game.board[position.y][3].kind = "Rook"
          game.board[position.y][3].color =
            game.board[position.y][position.x].color

          game.canCastle[
            game.board[position.y][position.x].color
          ].leftRook = false
        }
        if (position.x - newPosition.x === -2) {
          game.board[position.y][7].kind = null
          game.board[position.y][7].color = null

          game.board[position.y][5].kind = "Rook"
          game.board[position.y][5].color =
            game.board[position.y][position.x].color

          game.canCastle[
            game.board[position.y][position.x].color
          ].rightRook = false
        }
      }
      //move piece from position to new position

      game.board[newPosition.y][newPosition.x].kind =
        game.board[position.y][position.x].kind

      game.board[newPosition.y][newPosition.x].color =
        game.board[position.y][position.x].color

      game.board[position.y][position.x].kind = null
      game.board[position.y][position.x].color = null
      //check for win
      const result = isGameOver(game, game.turn)
      if (result) {
        game.result = result
        console.log(result)
      }
      //toggle turn
      game.turn = game.turn === "White" ? "Black" : "White"
    }
  }

  const updatedGame = await updateGame(game)

  return updatedGame
}

export const promotePawn = async (game, promotion) => {
  const { board } = game
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x].kind === "Pawn") {
        if (
          (board[y][x].color === "White" && y === 0) ||
          (board[y][x].color === "Black" && y === 7)
        ) {
          game.board[y][x].kind = promotion
        }
      }
    }
  }

  const updatedGame = await updateGame(game)

  return updatedGame
}
