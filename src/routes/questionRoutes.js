import { Router } from "express";
import { authenticateToken } from "../auth/index.js";
import {
    questionCreateController,
     questionShowController,
     questionConsultController,
     adminQuestionsController,
     solveQuestionController,
     resolvedQuestionsController
} from "../controllers/question_controller.js";
 
const router = Router();
//creacion de cuestionario
router.post("/questions", authenticateToken, questionCreateController);
//mostrar todos los cuestionarios
router.get("/questions", authenticateToken, questionShowController);
//consultar un cuestionario
router.get("/question/:id", authenticateToken, questionConsultController);
//ver cuestionarios propios
router.get("/admin/questions", authenticateToken, adminQuestionsController);
//resolver cuestionario
router.post("/questionUser", authenticateToken, solveQuestionController);
//ver preguntas resueltas por el usuario
router.get("/admin/questionsResolved", authenticateToken, resolvedQuestionsController);

export default router;
