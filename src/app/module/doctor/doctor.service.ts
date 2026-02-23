/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

const updateDoctor = async (id: string, payload: any): Promise<any> => {
    const { specialties, docotor, password, ...doctorData } = payload;

    const finalDoctorData = docotor ? { ...docotor, ...doctorData } : doctorData;

    return await prisma.$transaction(async (tx) => {
        // ১. ডক্টর ডাটা আপডেট করুন
        const updatedDoctor = await tx.doctor.update({
            where: { id },
            data: finalDoctorData,
        });

        // ২. যদি ডক্টর অবজেক্টের ভেতর 'name' বা 'email' থাকে, তবে ইউজার টেবিলও আপডেট করুন
        if (finalDoctorData.name || finalDoctorData.email) {
            await tx.user.update({
                where: { id: updatedDoctor.userId },
                data: {
                    name: finalDoctorData.name,
                    email: finalDoctorData.email,
                },
            });
        }

        // ৩. স্পেশালিটি আপডেট (আগের মতোই)
        if (specialties && specialties.length > 0) {
            await tx.doctorSpecialty.deleteMany({ where: { doctorId: id } });
            await tx.doctorSpecialty.createMany({
                data: specialties.map((sId: string) => ({ doctorId: id, specialtyId: sId }))
            });
        }

        return updatedDoctor;
    });
};

export const doctorService = {
    getAllDoctors,
    getDoctorById,
    updateDoctor
}