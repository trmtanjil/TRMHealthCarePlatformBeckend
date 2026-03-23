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