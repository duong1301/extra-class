import MainLayout from "./components/layouts/MainLayout"
import { Route, Routes } from "react-router"
import StudentPage from "./components/pages/studentPage"
import ClassPage from "./components/pages/classPage"
import AttendancePage from "./components/pages/attendancePage"
import TuitionPage from "./components/pages/tuitionPage"
import { Toaster } from "sonner"
import ClassPageDetail from "./components/pages/classPageDetail"

function App() {
  return (
    <div>
      <Toaster position="top-center"/>
      <MainLayout>
        <Routes>
          <Route path="/student" element={<StudentPage />} />
          <Route path="/class">
            <Route path="" element={<ClassPage />}/>
            <Route path=":classId" element={<ClassPageDetail/>}/>
          </Route>
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/tuition" element={<TuitionPage />} />
        </Routes>
      </MainLayout>
    </div>
  )
}

export default App
