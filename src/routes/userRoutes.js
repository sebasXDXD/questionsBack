import { Router } from "express";
import {
    createUserController,
    loginController
} from "../controllers/user_controller.js";

const router = Router();

router.post("/createUser", createUserController);
router.post("/login", loginController);
export default router;