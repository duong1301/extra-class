import express from 'express';
import { getClasses, createClass, getClassById, updateClass, deleteClass, deleteAllClasses, getClassListController, getClassListPaginationController, updateClassById } from '../controllers/classController.js';
import { validateCreateClass, validateUpdateClass } from '../validators/classValidator.js';
import { validateId } from '../validators/idValidator.js';
import { mockDataclassesService } from '../services/classService.js';


const router = express.Router();

router.route('/')
    .get(getClasses)
    .post(validateCreateClass, createClass)
    .delete(deleteAllClasses);

router.get('/list', getClassListPaginationController);

router.route('/:id')
    .get(validateId, getClassById)
    .put(validateId, validateUpdateClass, updateClass)
    .patch(updateClassById)
    .delete(validateId, deleteClass);



export default router;
