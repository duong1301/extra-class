import api from "@/lib/axios";

const studentService = {
  getStudents: async (
    paginationOption = { pageSize, pageIndex },
    filter = { classId, search },
  ) => {
    const { pageSize, pageIndex } = paginationOption;
    const { classId, search } = filter;
    try {
      const res = await api.get("/students", {
        params: {
          classId,
          search,
          pageSize,
          pageIndex,
        },
      });
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  getUnClassifiedStudents: async () => {
    try {
      const response = await api.get("/students/unclassified");
      return response.data;
    } catch (error) {
      console.eerror(
        "Error fetching unclassified students:",
        error.response?.data || error.message,
      );
    }
  },

  createStudent: async ({ studentName, classId }) => {
    try {
      const res = await api.post("/students", { studentName, classId });
      return res.data;
    } catch (error) {
      console.log(error.response);
      throw error;
    }
  },

  deleteStudent: async (studentId) => {
    const res = await api.delete(`/students/${studentId}`);
    return res.data;
  },
};

export default studentService;
