import { Outlet } from "react-router"

import Header from "../common/Header"
import Sidebar from "../common/Sidebar"


const MainLayout = ({ children }) => {
    return (
        <div>
            <Sidebar />
            <div className="w-full pl-[300px]">
                <Header />
                <div className="w-full p-4 max-w-7xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default MainLayout