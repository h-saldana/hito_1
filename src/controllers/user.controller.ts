import { Request, Response } from "express"
import { userService } from "../services/user.service";


const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers()
        res.json({
            // email:req.email,
            users
        })
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            res.status(500).json({ error: error.message })
        } else res.status(500).json({ error: "Server Error" })

    }

};

const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        res.json({})
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            res.status(500).json({ error: error.message })
        } else res.status(500).json({ error: "Server Error" })

    }

};

const createUser = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body
        const newUser = await userService.createUserWithEmailAndPassword(email, password, name)
        res.json({ newUser });
        console.log(newUser);
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            res.status(500).json({ error: error.message })
        } else res.status(500).json({ error: "Server Error" })

    }

};


const deleteUser = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;
        const user = await userService.findUserById(uid);
        console.log(user)
        if (user) {
            await user.destroy();
            res.status(200).json({ message: 'User successfully deleted' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};



const updateUserController = async (req: Request, res: Response) => {
    try {
        const userId = req.params.uid;
        const { email, password} = req.body;
        const updatedUser = await userService.updateUser(userId, email, password);

        if (updatedUser) {
            res.json({ message: 'Updated User', user: updatedUser });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};




export const userController = {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUserController,
}