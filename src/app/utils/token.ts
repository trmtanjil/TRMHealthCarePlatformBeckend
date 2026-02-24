import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVars } from "../config/env";
import { Response } from "express";
import ms from "ms"
import { cookieUtils } from "./cookie";

const getAccesToken =(payload: JwtPayload)=>{
    const accesstoken = jwtUtils.createToken(payload, envVars.ACCESS_TOKEN_SECRET,{expiresIn:envVars.ACCESS_TOKEN_EXPIRES_IN} as SignOptions
    )

    return accesstoken
}

const getRefreshToken =(payload: JwtPayload)=>{
    const refreshtoken = jwtUtils.createToken(payload, envVars.REFRESH_TOKEN_SECRET,{expiresIn:envVars.REFRESH_TOKEN_EXPIRES_IN} as SignOptions
    )

    return refreshtoken
}

const setAccessTokenCookie = (res:Response, token:string)=>{
    const maxAge = ms(Number(envVars.ACCESS_TOKEN_EXPIRES_IN))
     
    cookieUtils.setCookie(res,'accessToken',token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        path:'/',
        maxAge:Number(maxAge)
    })

}
const setRefreshTokenCookie = (res:Response, token:string)=>{
    const maxAge = ms(Number(envVars.REFRESH_TOKEN_EXPIRES_IN))
     
    cookieUtils.setCookie(res,'accessToken',token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        path:'/',
        maxAge:Number(maxAge)
    })

}
const setBetterAuthSessionCookie = (res:Response, token:string)=>{
    const maxAge = ms(Number(envVars.REFRESH_TOKEN_EXPIRES_IN))
     
    cookieUtils.setCookie(res,'better-auth.serssion_token',token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        path:'/',
        maxAge:Number(maxAge)
    })

}



export const tokenUtils = {
    getAccesToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthSessionCookie
}