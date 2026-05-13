import mongoose from 'mongoose';
import Student from '../models/Student.js';

export const getStudentsService = async (filter={classId, search}, paginationOptions={pageSize, pageIndex}) => {
  const {classId, search} = filter
  const {pageSize, pageIndex} = paginationOptions
  
  const classMatch = {}
  const studentMatch = {}
  
  try {
      if(classId) classMatch.classId = new mongoose.Types.ObjectId(classId)
      if(search) studentMatch.studentName = { $regex: search ||"", $options: 'i' } 
    const students = await Student.aggregate([
      {
        $match: studentMatch
      },
      {
        $lookup:{
          from:"enrollments",
          let:{ studentId:"$_id"},
          pipeline:[
            {$match:{
                ...classMatch,
                $expr:{$eq:["$studentId","$$studentId"]}
              }
            },
            { $project: { classId: 1, _id: 0 } }
          ],
          as:"enrollmentsInfo"
          
        },
      },
      {
        $unwind:"$enrollmentsInfo"
      },
      {
        $sort:{createdAt:-1}
      },
      {
        $facet:{
          metadata: [ { $count: "total" } ],
          data: [
            { $skip: (pageIndex - 1) * pageSize },
            { $limit: pageSize }
          ]
        }
      }
      
    ])
    return {
      total:students[0].metadata[0]?students[0].metadata[0].total:0,
      data: students[0].data
    }
  } catch (error) {
    throw error;
  }
};

export const getStudentByIdService = async (id) => {
  try {
    return await Student.findById(id);
  } catch (error) {
    throw error;
  }
};
export const getUnclassifiedStudentsService = async () => {
  try {
    const students = await Student.aggregate([
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'studentId',
          as: 'enrollments'
        }
      },
      {
        $match: {
          'enrollments.0': { $exists: false }
        }
      },
      {
        $project: {
          "enrollments": 0
        }
      }
      
    ]);
    return students
  } catch (error) {
    throw error;
  }
}

export const createStudentService = async (studentData) => {
  try {
    const newStudent = new Student(studentData);
    return await newStudent.save();
  } catch (error) {
    throw error;
  }
};

export const updateStudentService = async (id, updateData) => {
  try {
    return await Student.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  } catch (error) {
    throw error;
  }
};

export const deleteStudentService = async (id) => {
  try {
    return await Student.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};

export const deleteAllStudentsService = async () => {
  try {
    return await Student.deleteMany({});
  } catch (error) {
    throw error;
  }
};


export const mockDatastudentsService = async () => {
  try {
    return await Student.insertMany([
      { studentName: "Nguyễn Văn A" },
      { studentName: "Nguyễn Văn B" },
      { studentName: "Nguyễn Văn C" },
      { studentName: "Nguyễn Văn D" },
      { studentName: "Nguyễn Văn E" },
      { studentName: "Nguyễn Văn F" },
      { studentName: "Nguyễn Văn G" },
      { studentName: "Nguyễn Văn H" },
      { studentName: "Nguyễn Văn I" },
      { studentName: "Nguyễn Văn J" }
    ]);
  } catch (error) {
    throw error;
  }
};
