import { useUIContext } from "../context/UIContext"

export default function NewGameModal() {
    const {closeModal} = useUIContext()
    return(
        <>
        <button onClick={() => closeModal('newGame')}>X</button>
        <div>New Form</div>
        </>
    )
}