import { Router} from "express"
import { petController } from "../controllers/pet.controller"
import { verifyToken } from "../middlewares/jwt.middleware"

const router = Router();

// middleware
router.use(verifyToken)

router.post("/", petController.createPet)

router.get("/", petController.getPets)

router.get("/:uid", petController.getPetById)

router.put("/:uid", petController.updatePet)

router.delete("/:uid", petController.deletePet)

export default router;