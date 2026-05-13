import { dateFormats, formatDate } from "@/helper/dateTimeHelper";
import api from "@/lib/axios";

const attendanceService = {
  getByClassId: async (classId, month, year) => {
    try {
      const result = await api.post(`/attendances/class/${classId}`, {
        data: { month: month, year: year },
      });

      return result.data;
    } catch (error) {
      console.log(error);
    }
  },

  getPresentStudents: async (classId, day, month, year) => {
    try {
      const result = await api.get(
        `/attendances/class/${classId}?date=${year}/${month}/${day}`,
      );

      return result.data;
    } catch (error) {
      console.log(error);
    }
  },

  updatePresent: async (studentIds = [], classId, date) => {
    try {
      
      const result = await api.post(`/attendances/bulk-dates`, {
        classId,
        studentIds,
        date:formatDate(date, dateFormats.ISO8601),
      });

      return result.data;
    } catch (error) {
      const msg = error.response?.data.errors || "Có lỗi xảy ra";
      console.log(">>error",msg);
    }
  },

  updateAttendance: async (classId, studentIds, date)=>{
    try {
      const result = await api.patch(`/attendances`, {
        classId, studentIds:studentIds, date
      })

      return result
    } catch (error) {
      console.log(error)
          }
  }
};

export default attendanceService;
