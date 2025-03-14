import { Router } from "express"; 
import {userController} from "../controllers/user.controller"
import { verifyToken}  from "../middlewares/jwt.middleware"


const router = Router(); 

router.use(verifyToken)
// path: http:localhost:3000 /api/vl/users

router.get('/', userController.getUsers)

router.get('/:id', userController.getUser)

router.post('/', userController.createUser)

router.delete('/:uid', userController.deleteUser);

router.put('/:uid', userController.updateUserController);

 
export default router;