import { IRequestUser } from "../../interfaces/requestUser.interface"
import { prisma } from "../../lib/prisma"
import { ICreateDoctorSchedulePayload } from "./doctorSchedule.interface"

const createMyDoctorSchedule = async (user:IRequestUser, payload:ICreateDoctorSchedulePayload ) => { 
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        },

    })
    const doctorScheduleData = payload.scheduleIds.map((scheduleId) =>  ({
        doctorId : doctorData.id,
        scheduleId
    }))
    const result = await prisma.doctorSchedules.createMany({
            data: doctorScheduleData
    })
    return result
    }


const getMyDoctorSchedules = async ( ) => {

}

const getAllDoctorSchedules = async ( ) => {
}

const getDoctorScheduleById = async ( ) => {
}


const updateMyDoctorSchedule = async ( ) => {
}

const deleteMyDoctorSchedule = async ( ) => {
}



export const DoctorScheduleService = {
    createMyDoctorSchedule,
    getAllDoctorSchedules,
    getDoctorScheduleById,
    updateMyDoctorSchedule,
    deleteMyDoctorSchedule,
    getMyDoctorSchedules
}