import { Link } from "react-router"
import { Item } from "../ui/item"

const Sidebar = () => {
    return (
        <div className="w-[300px] bg-green-200 fixed top-0 left-0 bottom-0 z-50">
            <div className="h-16">Logo</div>
            <NavMenu>

                 <NavItem to="/class">
                    Classes
                </NavItem>
                <NavItem to="/student">
                    Students
                </NavItem>
               
                <NavItem to="/attendance">
                    Attendance
                </NavItem>
                <NavItem to="/tuition">
                    Tuition
                </NavItem>
            </NavMenu>
        </div>
    )
}

export default Sidebar

const NavMenu = ({ children }) => {
    return (
        <nav className="bg-red-500 h-full flex flex-col gap-y-2">
            {children}
        </nav>

    )
}

const NavItem = ({ children, to = "#" }) => {
    return (
        <Link to={to} className="text-2xl">
            <Item className="bg-amber-200">
                {children}
            </Item>
        </Link >
    )
}
