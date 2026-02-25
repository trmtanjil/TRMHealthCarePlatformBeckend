import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVars } from "../config/env";
import { Response } from "express";
// import ms, { StringValue } from "ms"
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
    // const maxAge = ms(envVars.ACCESS_TOKEN_EXPIRES_IN as StringValue)
     
    cookieUtils.setCookie(res,'accessToken',token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        path:'/',
        maxAge: 60 * 60 * 24 * 1000
    })

}
const setRefreshTokenCookie = (res:Response, token:string)=>{
    // const maxAge = ms(envVars.REFRESH_TOKEN_EXPIRES_IN as StringValue)
     
    cookieUtils.setCookie(res,'refreshToken',token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        path:'/',
         maxAge:60 * 60 * 24 * 1000 * 7 
    })

}
const setBetterAuthSessionCookie = (res:Response, token:string)=>{
    // const maxAge = ms(envVars.REFRESH_TOKEN_EXPIRES_IN as StringValue)
     
    cookieUtils.setCookie(res,'better-auth.session_token',token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        path:'/',
        maxAge:  60 * 60 * 24 * 1000
    })

}



export const tokenUtils = {
    getAccesToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthSessionCookie
}