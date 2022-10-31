import {
  bishopOffset,
  blackPawnOffset,
  kingOffset,
  knightOffset,
  queenOffset,
  rookOffset,
  whitePawnOffset,
} from "./assets/offsets.js"

export const getValidMoves = (game, position) => {
  const { board } = game
  const { y, x } = position

  const color = board[y][x].color
  const kind = board[y][x].kind
  if (color === game.turn) {
    const moves = getAvailableMoves(board, position)

    const canCastle = canPlayerCastle(board, color, game.canCastle)

    if (kind === "King") {
      if (canCastle.right) {
        color === "White"
          ? moves.push({ y: 7, x: 6 })
          : moves.push({ y: 0, x: 6 })
      }
      if (canCastle.left) {
        color === "White"
          ? moves.push({ y: 7, x: 2 })
          : moves.push({ y: 0, x: 2 })
      }
    }
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i]
      const saveColor = board[move.y][move.x].color
      const saveKind = board[move.y][move.x].kind
      board[move.y][move.x].color = color
      board[move.y][move.x].kind = kind
      board[y][x].color = null
      board[y][x].kind = null
      if (isKingUnderThreat(board, color)) {
        moves.splice(i, 1)
        i--
      }

      board[move.y][move.x].color = saveColor
      board[move.y][move.x].kind = saveKind
      board[y][x].color = color
      board[y][x].kind = kind
    }

    return moves
  } else {
    return []
  }
}

export const isGameOver = (game, turn) => {
  const { board } = game

  const enemyMoves = []

  const enemyTurn = turn === "White" ? "Black" : "White"

  const enemyPieces = getPlayerPieces(board, enemyTurn)

  for (const piece of enemyPieces) {
    const moves = getValidMoves(game, piece.position)
    enemyMoves.push(...moves)
  }

  if (enemyMoves.length === 0) {
    if (isKingUnderThreat(board, enemyTurn)) {
      return `${turn} won`
    } else {
      return "Draw"
    }
  }
  return undefined
}

const isInBoard = (position) => {
  const { y, x } = position
  if (y >= 0 && y <= 7 && x >= 0 && x <= 7) {
    return true
  }
  return false
}

const getOffset = (kind, color, y) => {
  let offsets = []

  //set offsets based on the kind of the piece
  switch (kind) {
    case "King":
      offsets = kingOffset
      break
    case "Queen":
      offsets = queenOffset
      break
    case "Bishop":
      offsets = bishopOffset
      break
    case "Knight":
      offsets = knightOffset
      break
    case "Rook":
      offsets = rookOffset
      break
    case "Pawn":
      color === "Black"
        ? (offsets = blackPawnOffset)
        : (offsets = whitePawnOffset)
      break
    default:
      offsets = [[]]
  }

  //add another step to pawn if its his first step
  if (kind === "Pawn") {
    if (color === "White" && y === 6) {
      offsets = [
        [-1, 0],
        [-2, 0],
      ]
    }
    if (color === "Black" && y === 1) {
      offsets = [
        [1, 0],
        [2, 0],
      ]
    }
  }

  return offsets
}

const getPlayerPieces = (board, color) => {
  const piecesPosition = []
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x].color === color) {
        const position = {
          y: y,
          x: x,
        }
        piecesPosition.push({
          position: position,
          kind: board[y][x].kind,
          color: color,
        })
      }
    }
  }
  return piecesPosition
}

const getKingPosition = (board, color) => {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x].kind === "King" && board[y][x].color === color) {
        return { y: y, x: x }
      }
    }
  }
}

const isKingUnderThreat = (board, color) => {
  const KingPosition = getKingPosition(board, color)

  const enemyPieces = getPlayerPieces(
    board,
    color === "White" ? "Black" : "White"
  )
  for (const piece of enemyPieces) {
    const moves = getAvailableMoves(board, piece.position)
    for (const move of moves) {
      if (move.y === KingPosition.y && move.x === KingPosition.x) {
        return true
      }
    }
  }
  return false
}

// pick either canCastle OR canPlayerCastle
// const canCastle = (board, canCastleDB) => {
//   const { white, black } = canCastleDB

//   const result = {
//     white: { left: true, right: true },
//     black: { left: true, right: true },
//   }

//   if (!white.king) {
//     if (!white.rightRook) {
//       //check if the blocks between the king and the rook are empty
//       if (board[7][5].kind === null && board[7][6].kind === null) {
//         //check if the blocks between the king and the rook are threatend by enemy
//         const blackPieces = getPlayerPieces(board, "Black")
//         for (const piece of blackPieces) {
//           const moves = getAvailableMoves(board, piece.position)
//           for (const move of moves) {
//             if (move.y === 7 && (move.x === 5 || move.x === 6)) {
//               result.white.right = false
//             }
//           }
//         }
//       }
//     } else {
//       result.white.right = false
//     }
//     if (!white.leftRook) {
//       //check if the blocks between the king and the rook are empty
//       if (
//         board[7][1].kind === null &&
//         board[7][2].kind === null &&
//         board[7][3].kind === null
//       ) {
//         //check if the blocks between the king and the rook are threatend by enemy
//         const blackPieces = getPlayerPieces(board, "Black")
//         for (const piece of blackPieces) {
//           const moves = getAvailableMoves(board, piece.position)
//           for (const move of moves) {
//             if (
//               move.y === 7 &&
//               (move.x === 1 || move.x === 2 || move.x === 3)
//             ) {
//               result.white.left = false
//             }
//           }
//         }
//       }
//     } else {
//       result.white.left = false
//     }
//   } else {
//     result.white.left = false
//     result.white.right = false
//   }

//   if (!black.king) {
//     if (!black.rightRook) {
//       //check if the blocks between the king and the rook are empty
//       if (board[0][5].kind === null && board[0][6].kind === null) {
//         //check if the blocks between the king and the rook are threatend by enemy
//         const blackPieces = getPlayerPieces(board, "White")
//         for (const piece of blackPieces) {
//           const moves = getAvailableMoves(board, piece.position)
//           for (const move of moves) {
//             if (move.y === 0 && (move.x === 5 || move.x === 6)) {
//               result.black.right = false
//             }
//           }
//         }
//       }
//     } else {
//       result.black.right = false
//     }
//     if (!black.leftRook) {
//       //check if the blocks between the king and the rook are empty
//       if (
//         board[0][1].kind === null &&
//         board[0][2].kind === null &&
//         board[0][3].kind === null
//       ) {
//         //check if the blocks between the king and the rook are threatend by enemy
//         const blackPieces = getPlayerPieces(board, "White")
//         for (const piece of blackPieces) {
//           const moves = getAvailableMoves(board, piece.position)
//           for (const move of moves) {
//             if (
//               move.y === 0 &&
//               (move.x === 1 || move.x === 2 || move.x === 3)
//             ) {
//               result.black.left = false
//             }
//           }
//         }
//       }
//     } else {
//       result.black.left = false
//     }
//   } else {
//     result.black.left = false
//     result.black.right = false
//   }
// }

const canPlayerCastle = (board, color, canCastle) => {
  const castleParams = canCastle[color]
  const enemyColor = color === "White" ? "Black" : "White"
  const result = {
    left: true,
    right: true,
  }
  if (isKingUnderThreat(board, color)) {
    result.left = false
    result.right = false
  } else {
    if (castleParams.king) {
      const kingPosition = getKingPosition(board, color)

      if (castleParams.rightRook) {
        //check if the blocks between the king and the rook are empty
        if (
          board[kingPosition?.y][5].kind === null &&
          board[kingPosition?.y][6].kind === null
        ) {
          //check if the blocks between the king and the rook are threatend by enemy
          const enemyPieces = getPlayerPieces(board, enemyColor)
          for (const piece of enemyPieces) {
            const moves = getAvailableMoves(board, piece.position)
            for (const move of moves) {
              if (move.y === kingPosition.y && (move.x === 5 || move.x === 6)) {
                result.right = false
              }
            }
          }
        } else {
          result.right = false
        }
      } else {
        result.right = false
      }
      if (castleParams.leftRook) {
        //check if the blocks between the king and the rook are empty
        if (
          board[kingPosition?.y][1].kind === null &&
          board[kingPosition?.y][2].kind === null &&
          board[kingPosition?.y][3].kind === null
        ) {
          //check if the blocks between the king and the rook are threatend by enemy
          const enemyPieces = getPlayerPieces(board, enemyColor)
          for (const piece of enemyPieces) {
            const moves = getAvailableMoves(board, piece.position)
            for (const move of moves) {
              if (
                move.y === kingPosition.y &&
                (move.x === 1 || move.x === 2 || move.x === 3)
              ) {
                result.left = false
              }
            }
          }
        } else {
          result.left = false
        }
      } else {
        result.left = false
      }
    } else {
      result.left = false
      result.right = false
    }
  }

  return result
}

const getAvailableMoves = (board, position) => {
  const availableMovements = []

  const { y, x } = position

  const color = board[y][x].color
  const kind = board[y][x].kind

  let offsets = getOffset(kind, color, y)

  //go over the offsets and push every available movement to the availableMovements array
  for (const offset of offsets) {
    for (let i = 1; i <= board.length; i++) {
      const newPossiblePosition = { y: y + i * offset[0], x: x + i * offset[1] }
      //check if the next step is in the board
      if (isInBoard(newPossiblePosition)) {
        //pawn has a different behavior then the rest of the pieces
        if (kind === "Pawn") {
          //check if the pawn can kill an enemy piece
          if (offsets.indexOf(offset) === 0) {
            if (isInBoard({ y: newPossiblePosition.y, x: x + 1 }))
              if (
                board[newPossiblePosition.y][x + 1].color !== color &&
                board[newPossiblePosition.y][x + 1].color !== null
              ) {
                availableMovements.push({ y: newPossiblePosition.y, x: x + 1 })
              }
            if (isInBoard({ y: newPossiblePosition.y, x: x - 1 }))
              if (
                board[newPossiblePosition.y][x - 1].color !== color &&
                board[newPossiblePosition.y][x - 1].color !== null
              ) {
                availableMovements.push({ y: newPossiblePosition.y, x: x - 1 })
              }
          }
        }
        //check if the next step is taken by an allay piece
        if (
          board[newPossiblePosition.y][newPossiblePosition.x].color !== color
        ) {
          //if is not taken by an allay piece and is empty mark as available step
          if (
            board[newPossiblePosition.y][newPossiblePosition.x].color === null
          ) {
            availableMovements.push({
              y: newPossiblePosition.y,
              x: newPossiblePosition.x,
            })
            //check if the piece is a one step only piece and break the loop accordingly
            if (kind === "King" || kind === "Pawn" || kind === "Knight") {
              break
            }
          }
          //if there is an enemy piece add to available steps and break the loop
          else {
            if (kind !== "Pawn") {
              availableMovements.push({
                y: newPossiblePosition.y,
                x: newPossiblePosition.x,
              })
            }
            break
          }
        } else {
          break
        }
      } else {
        break
      }
    }
  }
  //fixed a bug when the pawn can jump over a piece in its first step
  if (kind === "Pawn") {
    if (color === "White") {
      if (y === 6 && availableMovements[0]?.y !== 5) {
        availableMovements.pop()
      }
      if (
        y === 6 &&
        availableMovements.length === 2 &&
        availableMovements[0].x !== position.x
      ) {
        availableMovements.pop()
      }
    } else {
      if (y === 1 && availableMovements[0]?.y !== 2) {
        availableMovements.pop()
      }
      if (
        y === 1 &&
        availableMovements.length === 2 &&
        availableMovements[0].x !== position.x
      ) {
        availableMovements.pop()
      }
    }
  }

  return availableMovements
}
