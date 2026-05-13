import { Router } from "express";
import { getClassAttendance, updateClassAttendance } from "../controllers/attendanceController.js";

const router = Router();

router.route("/class/:classId")
    .get(getClassAttendance)

router.route("/")
    .patch(updateClassAttendance)

export default router