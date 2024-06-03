import {findQuestionById,getResolvedQuestions,createQuestionnaire,getQuestionnairesWithQuestions,getQuestionnaireWithQuestionsById, getQuestionsByUserId ,createQuestion,checkUserQuestionnaire, createUserQuestion } from "../services/questionService.js";

// Controlador para la creación de cuestionarios con preguntas
export const questionCreateController = async (req, res) => {
    try {
        const { theme, questions } = req.body;
        const user_created_id = req.userId;
        // Crear el cuestionario
        const newQuestionnaire = await createQuestionnaire(user_created_id, theme);

        // Crear las preguntas asociadas al cuestionario
        const questionPromises = questions.map(q => {
            const { question, answer1, answer2, answer3, answer4, correct_answer } = q;
            return createQuestion(newQuestionnaire.id, question, answer1, answer2, answer3, answer4, correct_answer);
        });

        const createdQuestions = await Promise.all(questionPromises);

        return res.status(201).json({ 
            message: 'Cuestionario y preguntas creados correctamente', 
            questionnaire: newQuestionnaire, 
            questions: createdQuestions 
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear cuestionario', error: error.message });
    }
};
export const questionShowController = async (req, res) => {
    try {
        const questionnaires = await getQuestionnairesWithQuestions();
        return res.status(200).json({ questionnaires });
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los cuestionarios', error: error.message });
    }
};

export const questionConsultController = async (req, res) => {
    try {
        const { id } = req.params;
        const questionnaire = await getQuestionnaireWithQuestionsById(id);

        if (!questionnaire) {
            return res.status(404).json({ message: 'Cuestionario no encontrado' });
        }

        return res.status(200).json({ questionnaire });
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener el cuestionario', error: error.message });
    }
};

export const adminQuestionsController = async (req, res) => {
    try {
        const userId = req.userId;

        // Obtener preguntas creadas por el admin con el userId
        const questions = await getQuestionsByUserId(userId);

        if (!questions || questions.length === 0) {
            return res.status(404).json({ message: 'No se encontraron preguntas para este usuario' });
        }

        return res.status(200).json({ questions });
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las preguntas del administrador', error: error.message });
    }
};

export const solveQuestionController = async (req, res) => {
    try {
        const userId = req.userId; // Obtener el userId del token JWT        
        const { idQuestionnaire } = req.body;
        const { answers } = req.body;

        // Comprobar si el usuario ya respondió a este cuestionario
        const existingUserQuestion = await checkUserQuestionnaire(idQuestionnaire, userId);

        if (existingUserQuestion) {
            return res.status(400).json({ message: 'El usuario ya ha respondido a este cuestionario' });
        }

        for (const answer of answers) {
            const { question_id, user_answer } = answer;

            // Buscar la pregunta por su id
            const question = await findQuestionById(question_id);

            if (!question) {
                return res.status(404).json({ message: `Pregunta con ID ${question_id} no encontrada` });
            }

            // Guardar la respuesta del usuario en la tabla user_question
            await createUserQuestion(idQuestionnaire, userId, question_id, user_answer);
        }

        return res.status(200).json({ message: 'Respuestas guardadas correctamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al guardar las respuestas', error: error.message });
    }
};
export const resolvedQuestionsController = async (req, res) => {
    try {
        const resolvedQuestions = await getResolvedQuestions();
        return res.status(200).json(resolvedQuestions);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las respuestas de los usuarios', error: error.message });
    }
};