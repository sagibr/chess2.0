import Block from "./Block"

const Board = ({ game, getAvailableMoves, playTurn, moves, lastMove }) => {
  return (
    <>
      {game?.board?.map((row, Yindex) => {
        return (
          <div
            key={Yindex}
            className="lg:h-16 md:h-14 h-12 w-fit m-auto flex bg-green-900"
          >
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
                  playTurn={() => playTurn({ y: Yindex, x: Xindex })}
                  lastMove={lastMove}
                ></Block>
              )
            })}
          </div>
        )
      })}
    </>
  )
}
export default Board
