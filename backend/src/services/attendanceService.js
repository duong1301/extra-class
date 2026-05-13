import mongoose from 'mongoose';
import Attendance from '../models/Attendance.js';
import Enrollment from '../models/Enrollment.js';


export const initAttendanceService = async (enrollmentId) => {
  try {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const newAttendance = new Attendance({ enrollmentId, year, month });
    return await newAttendance.save();
  } catch (error) {
    throw error;
  }
};


// lấy danh sách điểm danh của lớp theo ngày chỉ định
export const getDateAttendanceByClassService = async (classId, date)=>{
  const _date = new Date(date)
  const dayOfMonth = _date.getDate()
  const month = _date.getMonth() + 1;
  const year = _date.getFullYear();


  const attendances = await Enrollment.aggregate([
    {
        $match:{
          classId: new mongoose.Types.ObjectId(classId)
        }
    },
    {
      $lookup:{
        from:"attendances",
        localField:"_id",
        foreignField:"enrollmentId",
        as:"attendance",
        pipeline:[
          {
            $match:{month:month, year:year,dates:{$in:[dayOfMonth]} }
          }
        ]
        
      }
    },
    {
      $lookup:{
        from: "students",
        localField:"studentId",
        foreignField:"_id",
        as:"student"
      }
    },
    {
      $unwind:"$attendance"
    },
    {
      $unwind:"$student"
    },
    {
      $project:{
        
        studentId:"$studentId",
        studentname:"$student.studentName"
        
      }
    }
    
  ])

  const result = {
    classId,
    date:`${year}/${month}/${dayOfMonth}`,
    present : attendances.map(item=>item.studentId)
  }

  return result
}

//cập nhật danh sách điểm danh của lớp theo ngày chỉ định
export const updateDateAttendanceByClassService = async (classId, date, studentIds=[])=>{
  try {
    const enrollments = await Enrollment.find({
      classId:classId
    },{studentId:1})

    const enrollmentsAttendance = [...enrollments].reduce((prev, cur, index, arr)=>{
      const textId= cur.studentId.toString();
      if(studentIds.includes(textId)){
        return {...prev, present:[...prev.present, cur._id]}
      }
      return {...prev, absent:[...prev.absent, cur._id]}
    },{present:[], absent:[]})

    const presentResult = await addDateAttendance(enrollmentsAttendance.present, date)
    const absentResult = await removeDateAttendance(enrollmentsAttendance.absent, date)
    return {presentResult, absentResult}
  } catch (error) {
    throw new Error(error)
  }
}

//Thêm điểm danh
const addDateAttendance = async (enrollmentIds, date)=>{
  const [year, month, day] = date.split("-")
  const result = await Attendance.updateMany(
    {
      enrollmentId:{$in:enrollmentIds},
      month:month,
      year:year
    },
    { $addToSet: { dates: day } }
  )
  
  return result

}

//huỷ điểm danh
const removeDateAttendance = async (enrollmentIds, date)=>{
  const [year, month, day] = date.split("-")
  const result = await Attendance.updateMany(
    {
      enrollmentId:{$in:enrollmentIds},
      month:month,
      year:year
    },
    { $pull: { dates: day } }
  )
  
  return result
}
