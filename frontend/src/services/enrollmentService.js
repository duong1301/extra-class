import api from "@/lib/axios";

const enrollmentService = {
  getEnrollmentByClass: async (classId) => {
    try {
      console.log(classId)
      const result = await api.get(`/enrollments/class/${classId}`);
      return result.data;
    } catch (error) {
        console.log(error)
    }
  },

  enrollStudentsToClass: async (studentIds, classId) => {
    try {
      const response = await api.post("/enrollments/multiple", { studentIds, classId });
      return response.data;
    } catch (error) {
        console.log(error)
    }}
};


export default enrollmentService