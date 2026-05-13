import { Button } from "../ui/button"

const Icon = ({children,...props})=>{

    return <Button {...props} className={" h-9 w-9 cursor-pointer rounded-full hover:bg-palette-action-hover"} variant="ghost">{children}</Button>
}

export default Icon