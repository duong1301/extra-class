import { cva } from "class-variance-authority"
import { X } from "lucide-react"



const Chip = ({ children, onClick = () => {console.log("Clear") }, withCancel=false, variant="default" }) => {
    return (
        <span className="bg-palette-grey-300 rounded-lg px-3 py-1 flex gap-2 items-center ">{children} {withCancel && <span onClick={onClick} className="bg-palette-grey-600 rounded-full p-1 cursor-pointer hover:bg-palette-grey-700"><X strokeWidth={3} className="text-palette-common-white" size={9}  /></span>}
        </span>)
}

export default Chip