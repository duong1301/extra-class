import { getAllTuitionFeesService, getTuitionFeeByClassService, getTuitionFeeByIdService, updateTuitionFeeStatusService } from '../services/tuitionFeeService.js';
import { getClassByIdService  } from "../services/classService.js";
import mongoose from 'mongoose';

export const getAllTuitionFeesHandler = async (req, res) => {
    try {
        
        const{pageSize, pageIndex, classId, month, year, status, search} = req.query

        const paginationOption = {
            pageSize: parseInt(pageSize)||1,
            pageIndex: parseInt(pageIndex)||1
        }

        const filter ={
            month: parseInt(month),
            year: parseInt(year),
            search: search?.trim(),
            classId,
            status: status?.trim()
        }



        const tuitionFees = await getAllTuitionFeesService(paginationOption, filter);
        res.json({ pagination:{pageSize, pageIndex, total:tuitionFees[0]?.total[0]?.total||0}, data: tuitionFees[0]?.data });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

export const getTuitionFeeByIdController = async (req, res) => {
    try {
        const { tuitionFeeId } = req.params;
        const tuitionFee = await getTuitionFeeByIdService(tuitionFeeId);
        return res.json({tuitionFeeData: tuitionFee});
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
};

export const getTuitionFeeByClassController = async(req, res)=>{
    try {
        const { classId } = req.params;
        const { month, year } = req.query;
        console.log(classId, month, year)

        const classInfo = await getClassByIdService(classId);
        if (!classInfo) {
          return res.status(404).json({ message: 'Class not found' });
        }

        const result = await getTuitionFeeByClassService(classId, month, year);

        return res.json({ count: result.length, classInfo:{classId: classInfo._id, className: classInfo.className},month, year, tuitionFees: result });
        // const tuitionFees = await getTuitionFeeByClassService(classId, month, year);
        // res.json({ count: tuitionFees.length, data: tuitionFees });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateTuitionFeeStatusController = async (req, res) => {
    try {
        const { tuitionFeeId } = req.params;
        const { status } = req.body;

        const result = await updateTuitionFeeStatusService(tuitionFeeId, status);
        return res.json({ message: "Update tuition fee status successfully", result });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}
