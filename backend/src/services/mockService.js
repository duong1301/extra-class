import Class from "../models/Class.js";
import Student from "../models/Student.js";
import Enrollment from "../models/Enrollment.js";
import { createEnrollmentService } from "./enrollmentService.js";

export const mock_createClassService = async () => {
    try {
        const mockData = [
      {
        className: "Văn nâng cao",
        tuitionFee: 600000,
        weeklySchedule: [
          {
            dayOfWeek: "Thứ 3",
            startTime: [18, 59],
            duration: 120
          }
        ]
      },
      {
        className: " Toán nâng cao",
        tuitionFee: 700000,
        weeklySchedule: [
          {
            dayOfWeek: "Thứ 4",
            startTime: [19, 0],
            duration: 120
          }
        ]
      },
      {
        className: "Tiếng anh nâng cao",
        tuitionFee: 800000,
        weeklySchedule: [
          {
            dayOfWeek: "Thứ 5",
            startTime: [19, 0],
            duration: 120
          }
        ]
      }
    ]
        return await Class.insertMany(mockData);
    } catch (error) {
        throw error;
    }
}

export const mock_createStudentService = async () => {
    try {
        return await Student.insertMany([
            { studentName: "Student 1" },
            { studentName: "Student 2" },
            { studentName: "Student 3" },
            { studentName: "Student 4" },
            { studentName: "Student 5" }
        ]);
    } catch (error) {
        throw error;
    }
}

export const mock_createEnrollmentService = async () => {
    try {
        const classes = await Class.find();
        const students = await Student.find();
        console.log(">>>here")

        for (let i = 0; i < students.length; ++i) {
            const enrollment = {
                studentId: students[i]._id,
                classId: classes[i % classes.length]._id
            }
            await createEnrollmentService(enrollment)
        }
        return Enrollment.find({})
    } catch (error) {
        throw error;
    }
}