import { cn } from "@/lib/utils"

const PageTitle = ({children, className})=>{
    return <h1 className={cn("text-3xl font-semibold", className)}>{children}</h1>
}

export default PageTitle