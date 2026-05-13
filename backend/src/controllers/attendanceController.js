import { getDateAttendanceByClassService, updateDateAttendanceByClassService } from "../services/attendanceService.js"

export const getClassAttendance = async(req, res)=>{
    try {
        const {classId} = req.params
        const date = req.query.date

        const attendance = await getDateAttendanceByClassService(classId, date)


        return res.status(200).json({message:"Lấy điểm danh thành công", data: attendance})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:error.message})
    }
}

export const updateClassAttendance = async(req, res)=>{
    try {
        
        const {classId, date, studentIds} = req.body
        const result = await updateDateAttendanceByClassService(classId, date, studentIds)
        return res.status(200).json({message:"Cập nhật thành công", data: result})
    } catch (error) {
        return res.status(500).json({message:error.message})    
    }

    
}