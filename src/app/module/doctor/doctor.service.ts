import { prisma } from "../../lib/prisma"

const getAllDoctors = async ()=>{
    const doctors = await prisma.doctor.findMany({
        include:{
            specialties:{
                include:{
                    specialty:true
                }
            }
        }
    })
    return doctors

}

const getDoctorById = async (id:string)=>{
    const doctor = await prisma.doctor.findUnique({
        where:{id},
        include:{
            specialties:{  
                include:{
                    specialty:true
                }
            }
        } 
    })  
    return doctor
}

export const doctorService = {
    getAllDoctors,
    getDoctorById
}