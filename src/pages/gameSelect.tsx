import { useGameContext } from "../context/GameContext"
import { useUIContext } from "../context/UIContext"

export default function GameSelector() {
    const {games} = useGameContext()
    const {openModal} = useUIContext()
  return( 
  <>
  <div className="title">Games</div>
  <button onClick={() => openModal('newGame')}>Create New Game</button>
  {Object.entries(games).map(([key, game]) => (
    <button key={key}>{game.gameName}</button>
  ))}
  </>)
}
