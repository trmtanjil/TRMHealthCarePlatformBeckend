import { Request, Response } from "express";
import status from "http-status";
 import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { IquearyParams } from "../../interfaces/QuieryBuilder.interface";
import { IRequestUser } from "../../interfaces/requestUser.interface";
 
const createMyDoctorSchedule = catchAsync( async (req : Request, res : Response) => {
    const payload = req.body;
    const user = req.user;
 
    const doctorSchedule = await DoctorScheduleService.createMyDoctorSchedule(user!  , payload  );
    sendResponse(res, {
        success: true,
        httpStatusCode: status.CREATED,
        message: 'Doctor schedule created successfully',
        data: doctorSchedule
    });
});

const getMyDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const query = req.query;
 
    const result = await DoctorScheduleService.getMyDoctorSchedules(user as IRequestUser ,query as IquearyParams );
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Doctor schedules retrieved successfully',
        data: result.data,
        meta: result.meta
    });
});

const getAllDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
     const result  = await DoctorScheduleService.getAllDoctorSchedules(query as IquearyParams);
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
    const payload = req.body;
    const user = req.user;
     
    const updatedDoctorSchedule = await DoctorScheduleService.updateMyDoctorSchedule( user!, payload );
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