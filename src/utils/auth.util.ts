import jwt from "jsonwebtoken"

const secret = process.env.JWT_SECRET || "secret";



export const generateAccessToken = (
    email: string,
    uid: string,
    name: string,
    expiresIn = "1h"

) => {
    const payload = {email, uid, name};
    return jwt.sign(payload, secret, {
        expiresIn,
    })
}


export const verifyAccessToken = (token : string) => {
    try { 
        const decodedToken = jwt.verify(token, secret) as jwt.JwtPayload;
        return decodedToken;
    } catch(error){
        throw new Error("Invalid token");
    }
}