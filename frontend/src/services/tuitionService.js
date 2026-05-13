import api from "@/lib/axios";

const tuitionService =  {
  getTuitionByClassId: async(classId, month, year)=> {
    
    return api.get(`/tuition/class/${classId}?month=${month}&year=${year}`);
  },

  getTuitionFeesByPagingAndFilter: async (pagination={pageSize, pageIndex}, filter={month, year, search, classId, status})=>{
    try {
      console.log(filter)
      const res = await api.get("/tuition",{
        params:{
          ...pagination,
          ...filter

        }
      })
      return res.data
    } catch (error) {
      throw error
    }
  },
  
  updateTuitionStatus:(tuitionId, status)=> {
    return api.patch(`/tuition/${tuitionId}/status`, { status });
  }
};

export default tuitionService;