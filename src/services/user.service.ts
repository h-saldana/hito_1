// import { nanoid } from "nanoid";
import bcrypt from "bcryptjs"
// import { User} from "../interfaces/user.interface";
import { User } from "../models/user.model";
import { HttpError } from "../utils/httpError.util";


const getAllUsers = async () => {
    return await User.findAll();
}

const getUser = async (id: string) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw new HttpError("User not found", 404);

    } return user;
}

const getUserByEmail = async (email: string) => {
    const user = await User.findOne({ where: { email } })
    return user

}

const createUserWithEmailAndPassword = async (email: string, password: string, name: string) => {
    const user = await User.findOne({ where: { email } });

    if (user) {
        throw new HttpError("Email already exists", 400)
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHashed = await bcrypt.hash(password, salt)    
    const newUser = await User.create({ email, password: passwordHashed, name })
    console.log("Nuevo usuario creado: ", newUser);
    return newUser

}

const findUserById = async (uid: string) => {
    try {
        console.log(`looking for user with UID: ${uid}`); 
        const user = await User.findByPk(uid);
        if (user) {
            console.log(`User found: ${user.uid}`); 
        } else {
            console.log(`User with UID: ${uid} not found`); 
        }
        return user;
    } catch (error) {
        console.error(`Error searching for user: ${error}`);
        throw error;
    }
};

const deleteUserService = async(uid: string) => {
    try {
        const user = await User.findByPk(uid);
        if (user) {
            await user.destroy();
            return { message: 'User successfully deleted' };
        } else {
            throw new HttpError('User not found', 404);
        }
    } catch (error) {
        console.error(`Error deleting user: ${error}`);
        throw error;
    }
}







const updateUser = async (uid: string, email: string, password: string) => {
    try {
        const user = await User.findByPk(uid);

        if (user) {
            await user.update({ email, password });
            return user;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error updating user with ID ${uid}:`, error);
        throw new Error('Server error when updating the user');
    }
};








export const userService = {
    getAllUsers,
    getUser,
    createUserWithEmailAndPassword,
    getUserByEmail,
    findUserById,
    deleteUserService,
    updateUser,

}