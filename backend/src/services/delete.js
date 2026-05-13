import Attendance from "../models/Attendance.js";
import Class from "../models/Class.js";
import Enrollment from "../models/Enrollment.js";
import Student from "../models/Student.js";
import TuitionFee from "../models/TuitionFee.js";


const deleteAllDataService = async () => {
    try {
        await Enrollment.deleteMany({});
        await Attendance.deleteMany({});
        await TuitionFee.deleteMany({});
        await Class.deleteMany({});
        await Student.deleteMany({});
        return true;
    } catch (error) {
        throw error;
    }
}

export default deleteAllDataService;