import mongoose from 'mongoose';
import Class from '../models/Class.js';
import Enrollment from '../models/Enrollment.js';

/**
 * Service to create a new class
 * @param {Object} classData - The data for the new class
 * @returns {Promise<Object>} The saved class document
 */
export const createClassService = async (classData) => {
  try {
    const newClass = new Class(classData);
    return await newClass.save();
  } catch (error) {
    throw error;
  }
};

export const getClassListService = async () => {
  try { 

    const classList = await Class.aggregate([
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "classId",
          as: "enrollments"
        }
      },
      {
        $addFields: {
          enrollmentCount: { $size: "$enrollments" }
        }
      },
      {
        $project: {
          enrollments: 0
        }
      }
    ]);

    return classList;
    
  } catch (error) {
    throw error;
  }
}

export const getClassListPaginationService = async ({pageSize, pageIndex, search}) => {
  
  try {
    const classList = await Class.aggregate([
       {
        $match: {
          className: { $regex: search ||"", $options: 'i' }
        }
      },
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "classId",
          as: "enrollments"
        }
      },
      {
        $addFields: {
          enrollmentCount: { $size: "$enrollments" }
        }
      },
      {
        $project: {
          enrollments: 0
        }
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
      total: classList[0].metadata[0] ? classList[0].metadata[0].total : 0,
      data: classList[0].data
    };

    return classList;
  } catch (error) {
    throw new Error("Error fetching paginated class list: " + error.message); 
  }

}

/**
 * Service to update an existing class
 * @param {String} id - The class ID
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object>} The updated class document
 */
export const updateClassService = async (classId, payload) => {
  try {
    // console.log("payload",payload)
    const id = new mongoose.Types.ObjectId(classId)
    return await Class.findByIdAndUpdate(
      id,
      {$set: payload}, 
      { returnDocument:`after`, runValidators: true }
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Service to delete a class
 * @param {String} id - The class ID
 * @returns {Promise<Object>} The deleted class document
 */
export const deleteClassService = async (id) => {
  try {
    return await Class.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};

/**
 * Service to delete all classes
 * @returns {Promise<Object>} The deletion result
 */
export const deleteAllClassesService = async () => {
  try {
    return await Class.deleteMany({});
  } catch (error) {
    throw error;
  }
};

/**
 * Service to get all classes
 * @returns {Promise<Array>} List of classes
 */
export const getClassesService = async () => {
  try {
    return await Class.find().sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

/**
 * Service to get a class by ID
 * @param {String} id - The class ID
 * @returns {Promise<Object>} The class document
 */
export const getClassByIdService = async (classId) => {
  try {
    const id = new mongoose.Types.ObjectId(classId)
    return await Class.findById(id);
  } catch (error) {
    throw error;
  }
};


export const mockDataclassesService = async () => {
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

    await Class.insertMany(mockData);
    return await Class.find();
  } catch (error) {
    throw error;
  }
};