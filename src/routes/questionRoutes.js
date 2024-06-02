import { Router } from "express";
import { authenticateToken } from "../auth/index.js";
import {
    questionCreateController,
     questionShowController,
     questionConsultController,
     adminQuestionsController,
     solveQuestionController
    // resolvedQuestionsController
} from "../controllers/question_controller.js";
 
const router = Router();
router.post("/questions", authenticateToken, questionCreateController);
router.get("/questions", authenticateToken, questionShowController);
router.get("/question/:id", authenticateToken, questionConsultController);
router.get("/admin/questions", authenticateToken, adminQuestionsController);
router.post("/questionUser", authenticateToken, solveQuestionController);
// router.get("/admin/questions/:id", authenticateToken, resolvedQuestionsController);

export default router;
