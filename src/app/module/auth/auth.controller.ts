import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authServices } from "./auth.services";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import AppError from "../../errorHelpers/AppError";
import { cookieUtils } from "../../utils/cookie";

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

const getMe = catchAsync(
    async(req:Request, res:Response)=>{
        const user = req.user as IRequestUser ;
        const result = await authServices.getMe(user);

            sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User get me  successfully",
            data:result
        })
    }
)

const getNewToken = catchAsync(
    async (req:Request, res:Response)=>{
        const refreshToken = req.cookies.refreshToken;
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];

        if(!refreshToken){
            throw new AppError(status.UNAUTHORIZED,"refresh token is missing ")
        }
        const result = await authServices.getNewToken(refreshToken,betterAuthSessionToken)

        const {accessToken, refreshToken:newRefreshToken , sessionToken}= result

        tokenUtils.setAccessTokenCookie(res,accessToken);
        tokenUtils.setRefreshTokenCookie(res,refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res,sessionToken);

        sendResponse(res,{
            httpStatusCode:status.OK,
            success:true,
            message:"new access token generate succesfully",
            data:{
                accessToken,
                refreshToken:newRefreshToken,
                sessionToken,
            }
        })
        
    }
)


const changePassword = catchAsync(
    async (req:Request, res:Response)=>{
        const payload = req.body;
        const betterAuthSessionToken = req.cookies["better-auth.session_token"]
         const result = await authServices.changePassword(payload, betterAuthSessionToken)

           const { accessToken, refreshToken, token } = result

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string);

         sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "password change  successfully",
            data:result
        })
    }
)

const logOutUser = catchAsync(
    async (req:Request,res:Response)=>{
         const betterAuthSessionToken = req.cookies["better-auth.session_token"]
         const result = await authServices.logOutUser(betterAuthSessionToken)

          cookieUtils.clearCookie(res, 'accessToken', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        cookieUtils.clearCookie(res, 'refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        cookieUtils.clearCookie(res, 'better-auth.session_token', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User logg out successfully",
            data: result,
        });
    }
)

const verifyEmail = catchAsync(
    async(req:Request,res:Response)=>{
        const {email, otp}=req.body
        await authServices.verifyEmail(email,otp)

          sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "email verify successfully",
             
        });
    }
)


const forgetPassword = catchAsync(
    async (req: Request, res: Response) => {
        const { email } = req.body;
        await authServices.forgetPassword(email);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Password reset OTP sent to email successfully",
        });
    }
)

const resetPassword = catchAsync(
    async (req: Request, res: Response) => {
        const { email, otp, newPassword } = req.body;
        await authServices.resetPassword(email, otp, newPassword);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Password reset successfully",
        });
    }
)


export const authController = {
    registerPatient,
    loginUser,
    getNewToken,
    getMe,
    changePassword,
    logOutUser,
    verifyEmail,
    forgetPassword,
    resetPassword
}