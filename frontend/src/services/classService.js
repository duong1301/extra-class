import api from "@/lib/axios"
import axios from "axios"

const classService = {
    createClass: async ({ className, tuitionFee, schedule = [] }) => {
        console.log(schedule)
        const res = await api.post("/classes", { className, tuitionFee, weeklySchedule: schedule })

        return res.data
    },

    getClassListPagination: async ({ pageSize=1, pageIndex=1, search="" }) => {

        const res = await api.get("/classes/list", { params: { pageSize, pageIndex, search } })
        return res.data
    },

    getClassById: async (classId) => {
        const res = await api.get(`/classes/${classId}`)
        return res.data
    },

    getClasses: async () => {
        const res = await api.get("/classes")
        return res.data
    },

    updateClass: async ({classId, payload})=>{
        try {
            const updatedResult = await api.patch(`/classes/${classId}`,{
                ...payload
            })
            return updatedResult
        } catch (error) {
            console.error(error.response)
            throw error.response
        }
    },


    deleteClass: async (classId) => {
        const res = await api.delete(`/classes/${classId}`)
        return res.data
    }
}

export default classService