import mongoose from 'mongoose';
import Enrollment from '../models/Enrollment.js';
import TuitionFee from '../models/TuitionFee.js';

export const initTuitionFeeService = async (tuitionFeeData) => {
  try {
    const { enrollmentId, tuitionFee } = tuitionFeeData

    const newTuitionFee = new TuitionFee({
      enrollmentId,
      tuitionFee,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    })

    return await newTuitionFee.save();
  } catch (error) {
    throw error;
  }
};

export const getAllTuitionFeesService = async (
  paginationOption={
    pageSize:1,
    pageIndex: 1
  }, 
  filter={
    month:1,
    year:1,
    status:"all",
    classId:null,
    search:""
  }
) => {
  console.log(paginationOption)
  console.log(filter)

  try {
  const {month, year, status=null, classId, search} = filter;
  const {pageSize, pageIndex} = paginationOption;
  
  const classMatch = {}
    if(classId) classMatch.classId = new mongoose.Types.ObjectId(classId);
  
  const studentNameMatch = { }
    if(!!search) studentNameMatch.studentName={
      $regex:search,
      $options:"i"
    }

  const monthMatch = {
    year,
    month
  }
  const statusMatch = {
    
  }
  if(status) statusMatch.status = status
    const result = TuitionFee.aggregate([
      {
        $match:{
          ...monthMatch,
          ...statusMatch
        }
      },
      {
        $lookup: {
          from: 'enrollments',
          localField: 'enrollmentId',
          foreignField: '_id',
          as: 'enrollmentData',
          pipeline:[

            {$match:{
              ...classMatch
            }}
          ]
          
        }
      },
      {
        $lookup: {
          from: "attendances",
          localField: "enrollmentData._id",
          foreignField: "enrollmentId",
          as: "attendancesData",
          let: {
            year: "$year",
            month: "$month"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$year", "$$year"] },
                    { $eq: ["$month", "$$month"] }
                  ]
                }
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "classes",
          localField: "enrollmentData.classId",
          foreignField: "_id",
          as: "classData"
        }
      },
      {
        $lookup: {
          from: "students",
          localField: "enrollmentData.studentId",
          foreignField: "_id",
          as: "studentData",
          pipeline:[
            {
              $match: {
                ...studentNameMatch
                // studentName:{
                //   $regex:search, 
                //   $options:"i"
                // }
              }
            }
          ]
        }
      },
      { $unwind: "$enrollmentData" },
      { $unwind: "$attendancesData" },
      { $unwind: "$classData" },
      { $unwind: "$studentData" },
      {
        $project: {
          _id: 1,
          status:1,
          enrollmentId: 1,
          studentName: "$studentData.studentName",
          studentId: "$studentData._id",
          className: "$classData.className",
          classId: "$classData._id",
          year: "$year",
          month: "$month",
          tuitionFee: 1,
          dates: "$attendancesData.dates",
          amount: { $multiply: ["$tuitionFee", { $size: "$attendancesData.dates" }] }
        }
      },
      {
        $facet:{
          total: [ { $count: "total" } ],
          data: [
            { $skip: (pageIndex - 1) * pageSize },
            { $limit: pageSize }
          ]
        }
      }
      
    ])
    return result
    
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const getTuitionFeeByIdService = async (tuitionFeeId) => {
  try {
    const tuitionFee = await TuitionFee.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(tuitionFeeId)
        }
      },
      {
        $lookup: {
          from: 'enrollments',
          localField: 'enrollmentId',
          foreignField: '_id',
          as: 'enrollmentData',
          pipeline: [
            {
              $project: {
                classId: 1,
                studentId: 1 
            }},
          ]
          
        }
      },
      {
        $unwind: "$enrollmentData"
      }
     
    ]);
    
    const {enrollmentId, month, year} = tuitionFee[0]
    const {studentId, classId} = tuitionFee[0].enrollmentData
    
    const studentAndClassData = await Promise.all([
      mongoose.model('Student').findById(studentId).select('studentName'),
      mongoose.model('Class').findById(classId).select('className'),
      mongoose.model('Attendance').findOne({ enrollmentId:new mongoose.Types.ObjectId(enrollmentId), month: parseInt(month),  year: parseInt(year) }).select('dates')
      
    ])
    const [studentData, classData, attendanceData] =  studentAndClassData
    console.log(">>>tuitionFee", tuitionFee[0])
    console.log(">>>studentData",studentData)
    console.log(">>>classData",classData)
    console.log(">>>attendanceData",attendanceData)
  

    const result = {  ...tuitionFee[0], studentName:studentData.studentName, className: classData.className, dates:attendanceData.dates }



    return result;
  } catch (error) {
    throw error;
  }
};

export const getTuitionFeeByClassService = async (classId, month, year)=>{
  try {
    console.log(classId, month, year)

    const tuitionFees = await Enrollment.aggregate([
      {
        $match: {
          classId: new mongoose.Types.ObjectId(classId),          
        }         
      },
      {$lookup: { 
          from: 'tuitionfees',
          localField: '_id',
          foreignField: 'enrollmentId',
          as: "tuitionFeeData",
          pipeline: [
            {
              $match: {
                year: parseInt(year),
                month: parseInt(month)
              }
            }
          ]  
        }  
      },
      {
        $lookup: {
          from: 'students',
          localField: 'studentId',
          foreignField: '_id',
          as: "studentData"
        } 
      },
      {
        $lookup: {
          from:"attendances", 
          localField: '_id',
          foreignField: 'enrollmentId',
          as: "attendanceData",
          pipeline:[
            {
              $match: {
                year: parseInt(year),
                month: parseInt(month)
              }
            }
          ]
        }
      },
      {
        $unwind:"$tuitionFeeData"
      },
      {
        $unwind:"$studentData"
      },
      {
        $unwind:"$attendanceData"
      },
      {
        $project: {
          enrollmentId: 1,
          tuitionFeeId: "$tuitionFeeData._id",
          studentId: 1,
          studentName: "$studentData.studentName",
          tuitionFee: "$tuitionFeeData.tuitionFee",
          dates: "$attendanceData.dates",
          amount: { $multiply: ["$tuitionFeeData.tuitionFee", { $size:          "$attendanceData.dates" }]},
          status: "$tuitionFeeData.status"
        }
      }
      
    ])

    console.log(tuitionFees)

    return tuitionFees
  } catch (error) {
    throw error;
  }
}

export const updateTuitionFeeStatusService = async (tuitionFeeId, status) => {
  try {
    const result = await TuitionFee.findByIdAndUpdate(tuitionFeeId, { status }, { new: true });   } catch (error) {
    throw error;
  }
};  