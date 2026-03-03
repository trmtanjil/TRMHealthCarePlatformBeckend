import { Request, Response } from "express";
import status from "http-status";
 import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
import { IquearyParams } from "../../interfaces/QuieryBuilder.interface";
 
const createSchedule = catchAsync( async (req : Request, res : Response) => {
    const payload = req.body

     const schedule = await ScheduleService.createSchedule(payload );



    sendResponse(res, {
        success: true,
        httpStatusCode: status.CREATED,
        message: 'Schedule created successfully',
        data: schedule
    });
});

const getAllSchedules = catchAsync( async (req : Request, res : Response) => {
    const query = req.query
    const result = await ScheduleService.getAllSchedules(query as IquearyParams);

     sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedules retrieved successfully',
          data: result.data,
        meta: result.meta
    });
});

const getScheduleById = catchAsync( async (req : Request, res : Response) => {
const {id}=req.params;

    const schedule = await ScheduleService.getScheduleById(id as string);

      sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule retrieved successfully',
        data: schedule
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