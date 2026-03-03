import { Request, Response } from "express";
import status from "http-status";
 import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
 
const createMyDoctorSchedule = catchAsync( async (req : Request, res : Response) => {
 
    const doctorSchedule = await DoctorScheduleService.createMyDoctorSchedule( );
    sendResponse(res, {
        success: true,
        httpStatusCode: status.CREATED,
        message: 'Doctor schedule created successfully',
        data: doctorSchedule
    });
});

const getMyDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
 
    const result = await DoctorScheduleService.getMyDoctorSchedules( );
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Doctor schedules retrieved successfully',
        data: result.data,
        meta: result.meta
    });
});

const getAllDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
     const result  = await DoctorScheduleService.getAllDoctorSchedules( );
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'All doctor schedules retrieved successfully',
        data: result.data,
        meta: result.meta
    });
});

const getDoctorScheduleById = catchAsync(async (req: Request, res: Response) => {
 
    const doctorSchedule = await DoctorScheduleService.getDoctorScheduleById( );
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Doctor schedule retrieved successfully',
        data: doctorSchedule
    });
});

const updateMyDoctorSchedule = catchAsync( async (req : Request, res : Response) => {
     
    const updatedDoctorSchedule = await DoctorScheduleService.updateMyDoctorSchedule( );
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,  
        message: 'Doctor schedule updated successfully',
        data: updatedDoctorSchedule
    });
});

const deleteMyDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
 
    await DoctorScheduleService.deleteMyDoctorSchedule( );
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Doctor schedule deleted successfully',
    });
});


export const DoctorScheduleController = {
    createMyDoctorSchedule,
    getMyDoctorSchedules,
    getAllDoctorSchedules,
    getDoctorScheduleById,
    updateMyDoctorSchedule,
    deleteMyDoctorSchedule
}