import piecesIcons from "../../utils/assets/PieceIcons"

const Block = (props) => {
  const index = props.Yindex * 7 + props.Xindex

  const isMove = () => {
    if (props.moves) {
      for (const move of props.moves) {
        if (move.y === props.Yindex && move.x === props.Xindex) {
          return true
        }
      }
    }
    return false
  }
  const isLastMove = () => {
    if (
      props.lastMove?.position?.y === props.Yindex &&
      props.lastMove?.position?.x === props.Xindex
    ) {
      return true
    }
    if (
      props.lastMove?.oldPosition?.y === props.Yindex &&
      props.lastMove?.oldPosition?.x === props.Xindex
    ) {
      return true
    }
    return false
  }
  if (isMove()) {
    return (
      <div
        onClick={props.playTurn}
        className={`lg:w-16 md:w-14 w-11 h-full m-0 bg-green-300 border border-black  ${
          window.sessionStorage.getItem("role") === "White" ? "" : "rotate-180"
        }`}
      >
        {piecesIcons[props.color + props.kind]}
      </div>
    )
  } else if (isLastMove()) {
    return (
      <div
        onClick={props.getAvailableMoves}
        className={`lg:w-16 md:w-14 w-11 h-full m-0 bg-yellow-700 border border-white 
          ${
            window.sessionStorage.getItem("role") === "White"
              ? ""
              : "rotate-180"
          } `}
      >
        {piecesIcons[props.color + props.kind]}
      </div>
    )
  } else {
    if (index % 2 === 0) {
      return (
        <div
          onClick={props.getAvailableMoves}
          className={`lg:w-16 md:w-14 w-11 h-full m-0 bg-amber-100 
              ${
                window.sessionStorage.getItem("role") === "White"
                  ? ""
                  : "rotate-180"
              } `}
        >
          {piecesIcons[props.color + props.kind]}
        </div>
      )
    } else {
      return (
        <div
          onClick={props.getAvailableMoves}
          className={`lg:w-16 md:w-14 w-11 h-full m-0  bg-boardGreen  ${
            window.sessionStorage.getItem("role") === "White"
              ? ""
              : "rotate-180"
          }`}
        >
          {piecesIcons[props.color + props.kind]}
        </div>
      )
    }
  }
}
export default Block
