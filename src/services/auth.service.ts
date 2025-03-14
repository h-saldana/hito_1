import { userService } from "./user.service";
import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken" 
import {generateAccessToken} from "../utils/auth.util"
import { HttpError } from "../utils/httpError.util";



const loginWithEmailAndPassword = async (email: string, password: string) => {
    const user = await userService.getUserByEmail(email)
    
    if (!user) {
        throw new HttpError("User not found", 400)
    }    
   
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
        throw new HttpError("Password incorrect", 400)
    }

   
    const token = generateAccessToken(user.email, user.uid, user.name)
    

    return token;
};

const registerWithEmailAndPassword = async(email: string, password: string, name: string) =>{
    
    const newUser = await userService.createUserWithEmailAndPassword(email, password, name);
    const token = generateAccessToken(newUser.email, newUser.uid , newUser.name)
    return token;
}
export const authService = {
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
}