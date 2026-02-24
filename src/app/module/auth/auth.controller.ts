import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authServices } from "./auth.services";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";

const registerPatient = catchAsync(
    async (req:Request, res:Response) => {
        const payload = req.body;

        const result = await authServices.registerPatient(payload);

      
  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken); // ⭐ THIS LINE
  tokenUtils.setBetterAuthSessionCookie(res, token as string);


         sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Patient registered successfully",
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest
            }
        })
})


const loginUser = catchAsync(
    async (req:Request, res:Response) => {
        const payload = req.body;
        
 
        const result = await authServices.loginUser(payload); 
        
        const {accessToken, refreshToken, token, ...rest}= result;

        tokenUtils.setAccessTokenCookie(res,accessToken);
        tokenUtils.setRefreshTokenCookie(res,refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res,token)


        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User logged in successfully",
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest
            }
        })
})

export const authController = {
    registerPatient,
    loginUser
}