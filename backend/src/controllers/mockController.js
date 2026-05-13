import {
    mock_createClassService,
    mock_createStudentService,
    mock_createEnrollmentService
} from "../services/mockService.js";

export const mock_createClassController = async (req, res) => {
    try {

        const result = await mock_createClassService();
        res.status(201).json({ success: true, message: 'Classes created successfully', result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const mock_createStudentController = async (req, res) => {
    try {
        const result = await mock_createStudentService();
        res.status(201).json({ success: true, message: 'Students created successfully', result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const mock_createEnrollmentController = async (req, res) => {
    try {

        const result = await mock_createEnrollmentService();
        res.status(201).json({ success: true, message: 'Enrollments created successfully', result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
