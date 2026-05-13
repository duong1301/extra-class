import {
  createClassService,
  updateClassService,
  deleteClassService,
  getClassesService,
  getClassByIdService,
  deleteAllClassesService,
  getClassListService,
  getClassListPaginationService
} from '../services/classService.js';

// @desc    Get all classes
// @route   GET /api/classes
// @access  Public
export const getClasses = async (req, res) => {
  try {
    const classes = await getClassesService();
    res.status(200).json({ success: true, count: classes.length, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClassListController = async (req, res) => {
  try {
    const classList = await getClassListService();
    res.status(200).json({ success: true, data: classList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClassListPaginationController = async (req, res)=>{
  try {
    const {pageSize, pageIndex, search} = req.query
    const paginationOptions = {
      pageSize: parseInt(pageSize)||1,
      pageIndex: parseInt(pageIndex)||1,
      search: search?.trim() || ''
    }
    const classList = await getClassListPaginationService(paginationOptions);

    res.status(200).json({...paginationOptions, ...classList});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Create a class
// @route   POST /api/classes
// @access  Public
export const createClass = async (req, res) => {
  try {
    const { className, tuitionFee, weeklySchedule } = req.body;

    const savedClass = await createClassService({
      className,
      tuitionFee,
      weeklySchedule,
    });

    res.status(201).json({
      success: true,
      data: savedClass,
      message: 'Class created successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single class
// @route   GET /api/classes/:id
// @access  Public
export const getClassById = async (req, res) => {
  try {
    const classData = await getClassByIdService(req.params.id);
    if (!classData) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    res.status(200).json({ success: true, data: classData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a class
// @route   PUT /api/classes/:id
// @access  Public
export const updateClass = async (req, res) => {
  try {
    const updatedClass = await updateClassService(req.params.id, req.body);
    if (!updatedClass) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    res.status(200).json({ success: true, data: updatedClass, message: 'Class updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateClassById = async(req, res) =>{
  try {

    const classId = req.params.id
    const payload = req.body
    const classInfo = await getClassByIdService(classId)
    if(!classInfo){
      return res.status(400).json({success:false, message:"Lớp không tồn tại"})
    }
    
    console.log(payload)

    const allowedFields = [
      "className",
      "tuitionFee",
      "weeklySchedule"
    ]

    const updateData = {}
    allowedFields.forEach(field=>{
      if(payload[field] !== undefined){
        updateData[field] = payload[field];
      }
    }) 

    const updatedClass = await updateClassService(classId, updateData)

    return res.status(200).json({success:true, data:updatedClass})
  } catch (error) {
    console.log(error)
    return res.status(500).json({success:false, message:error.message})
  }
}



// @desc    Delete a class
// @route   DELETE /api/classes/:id
// @access  Public
export const deleteClass = async (req, res) => {
  try {
    const deletedClass = await deleteClassService(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    res.status(200).json({ success: true, message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete all classes
// @route   DELETE /api/classes
// @access  Public
export const deleteAllClasses = async (req, res) => {
  try {
    const result = await deleteAllClassesService();
    res.status(200).json({ success: true, message: `Successfully deleted ${result.deletedCount} classes` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
