
/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { Role, UserStatus } from "../../generated/prisma/enums";


interface DecodedUser {
      userId : string,
        role :Role,
        name:string,
        email:string,
        status:UserStatus,
        isDelate:boolean,
        emailVarified:boolean 
} 

const createToken = (payload: JwtPayload, secret: string, { expiresIn }: SignOptions) => {
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
}

const verifyToken = (token: string, secret: string) => {
    try {
        const decoded = jwt.verify(token, secret) as DecodedUser;
        return {
            success: true,
            data: decoded
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
            error
        }
    }
}

const decodeToken = (token: string) => {
    const decoded = jwt.decode(token) as DecodedUser;
    return decoded;
}


export const jwtUtils = {
    createToken,
    verifyToken,
    decodeToken,
}