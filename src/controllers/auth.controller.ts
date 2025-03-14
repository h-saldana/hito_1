import { NextFunction, Request, Response } from "express"
import { authService } from "../services/auth.service";
import { authLoginSchema } from "../schemas/auth.schema";
import { HttpError } from "../utils/httpError.util";
// import { HttpError } from "../utils/httpError.util";



const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {error, value} = authLoginSchema.validate(req.body)
        
        if(error){
            throw new HttpError(error.message, 400)
        }
        const {email, password} = value;
        
        const token = await authService.loginWithEmailAndPassword(email, password)
        res.json({ token });
    } catch (error) {
       next(error)

    }

};

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password, name} = req.body
        const token = await authService.registerWithEmailAndPassword(email, password, name);
        res.status(201).json({token})
    } catch (error) {
       next(error)
    }

};

export const authController = {
    login,
    register,
}