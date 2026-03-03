import { Request, Response } from "express";
import status from "http-status";
 import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
 
const createSchedule = catchAsync( async (req : Request, res : Response) => {
     const schedule = await ScheduleService.createSchedule( );

     

    sendResponse(res, {
        success: true,
        httpStatusCode: status.CREATED,
        message: 'Schedule created successfully',
        data: schedule
    });
});

const getAllSchedules = catchAsync( async (req : Request, res : Response) => {


     sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedules retrieved successfully',
    
    });
});

const getScheduleById = catchAsync( async (req : Request, res : Response) => {
      sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule retrieved successfully',
     });
});

const updateSchedule = catchAsync( async (req : Request, res : Response) => {
 
    const updatedSchedule = await ScheduleService.updateSchedule( );
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule updated successfully',
        data: updatedSchedule
    });
});

const deleteSchedule = catchAsync( async (req : Request, res : Response) => {
     await ScheduleService.deleteSchedule( );
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule deleted successfully',
    });
}
);

export const ScheduleController = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule
}