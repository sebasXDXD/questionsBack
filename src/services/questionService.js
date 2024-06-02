import { pool } from "../db.js";
export const createQuestionnaire = async (user_created_id, theme) => {
    try {
        const [result] = await pool.query('INSERT INTO questionnaire (user_created_id, theme) VALUES (?, ?)', [user_created_id, theme]);
        return {
            id: result.insertId,
            user_created_id,
            theme
        };
    } catch (error) {
        throw error;
    }
};

export const createQuestion = async (id_questionnaire, question, answer1, answer2, answer3, answer4, correct_answer) => {
    try {
        const [result] = await pool.query('INSERT INTO questions (id_questionnaire, question, answer1, answer2, answer3, answer4, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)', [id_questionnaire, question, answer1, answer2, answer3, answer4, correct_answer]);
        return {
            id: result.insertId,
            id_questionnaire,
            question,
            answer1,
            answer2,
            answer3,
            answer4,
            correct_answer
        };
    } catch (error) {
        throw error;
    }
};
export const getQuestionnairesWithQuestions = async () => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                qn.id as questionnaire_id, 
                qn.theme, 
                qn.user_created_id, 
                qn.created_at as questionnaire_created_at,
                qs.id as question_id,
                qs.question, 
                qs.answer1, 
                qs.answer2, 
                qs.answer3, 
                qs.answer4, 
                qs.correct_answer,
                qs.created_at as question_created_at
            FROM 
                questionnaire qn
            LEFT JOIN 
                questions qs 
            ON 
                qn.id = qs.id_questionnaire
            ORDER BY 
                qn.id, qs.id
        `);

        const questionnaires = {};

        rows.forEach(row => {
            const questionnaireId = row.questionnaire_id;

            if (!questionnaires[questionnaireId]) {
                questionnaires[questionnaireId] = {
                    id: questionnaireId,
                    theme: row.theme,
                    user_created_id: row.user_created_id,
                    created_at: row.questionnaire_created_at,
                    questions: []
                };
            }

            if (row.question_id) {
                questionnaires[questionnaireId].questions.push({
                    id: row.question_id,
                    question: row.question,
                    answer1: row.answer1,
                    answer2: row.answer2,
                    answer3: row.answer3,
                    answer4: row.answer4,
                    correct_answer: row.correct_answer,
                    created_at: row.question_created_at
                });
            }
        });

        return Object.values(questionnaires);
    } catch (error) {
        throw error;
    }
};

export const getQuestionnaireWithQuestionsById = async (questionnaireId) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                qn.id as questionnaire_id, 
                qn.theme, 
                qn.user_created_id, 
                qn.created_at as questionnaire_created_at,
                qs.id as question_id,
                qs.question, 
                qs.answer1, 
                qs.answer2, 
                qs.answer3, 
                qs.answer4, 
                qs.correct_answer,
                qs.created_at as question_created_at
            FROM 
                questionnaire qn
            LEFT JOIN 
                questions qs 
            ON 
                qn.id = qs.id_questionnaire
            WHERE 
                qn.id = ?
            ORDER BY 
                qs.id
        `, [questionnaireId]);

        if (rows.length === 0) {
            return null;
        }

        const questionnaire = {
            id: rows[0].questionnaire_id,
            theme: rows[0].theme,
            user_created_id: rows[0].user_created_id,
            created_at: rows[0].questionnaire_created_at,
            questions: []
        };

        rows.forEach(row => {
            if (row.question_id) {
                questionnaire.questions.push({
                    id: row.question_id,
                    question: row.question,
                    answer1: row.answer1,
                    answer2: row.answer2,
                    answer3: row.answer3,
                    answer4: row.answer4,
                    correct_answer: row.correct_answer,
                    created_at: row.question_created_at
                });
            }
        });

        return questionnaire;
    } catch (error) {
        throw error;
    }
};
export const getQuestionsByUserId = async (userId) => {
    try {
        const [rows] = await pool.query('SELECT * FROM questions WHERE user_created_id = ?', [userId]);
        return rows;
    } catch (error) {
        throw error;
    }
};
export const findQuestionById = async (questionId) => {
    try {
        const [question] = await pool.query('SELECT * FROM questions WHERE id = ?', [questionId]);
        return question[0]; // Devuelve la primera pregunta encontrada
    } catch (error) {
        throw error;
    }
};
export const checkUserQuestionnaire = async (idQuestionnaire, userId) => {
    try {
        const [existingUserQuestion] = await pool.query('SELECT * FROM user_question WHERE id_questionnaire = ? AND user_id = ?', [idQuestionnaire, userId]);
        return existingUserQuestion[0];
    } catch (error) {
        throw error;
    }
};

export const createUserQuestion = async (idQuestionnaire, userId, questionId, userAnswer) => {
    try {
        const [result] = await pool.query(
            'INSERT INTO user_question (id_questionnaire, user_id, question_id, user_answer) VALUES (?, ?, ?, ?)',
            [idQuestionnaire, userId, questionId, userAnswer]
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

// questionService.js
export const getResolvedQuestions = async () => {
    const [rows] = await pool.query(`
        SELECT 
            uq.user_id,
            q.id AS question_id,
            q.question,
            q.answer1,
            q.answer2,
            q.answer3,
            q.answer4,
            q.correct_answer,
            uq.user_answer,
            qt.theme
        FROM 
            user_question uq
        JOIN 
            questions q ON uq.question_id = q.id
        JOIN 
            questionnaire qt ON q.id_questionnaire = qt.id
        ORDER BY 
            uq.user_id, qt.id, q.id;
    `);

    // Formatear los datos
    const formattedData = {};

    rows.forEach(row => {
        if (!formattedData[row.user_id]) {
            formattedData[row.user_id] = {
                userId: row.user_id,
                questions: []
            };
        }

        formattedData[row.user_id].questions.push({
            question: row.question,
            answers: [row.answer1, row.answer2, row.answer3, row.answer4],
            selected: [row.answer1, row.answer2, row.answer3, row.answer4].indexOf(row.user_answer), // Índice de la respuesta seleccionada
            theme: row.theme,
            correct_answer: [row.answer1, row.answer2, row.answer3, row.answer4].indexOf(row.correct_answer) // Índice de la respuesta correcta
        });
    });

    // Convertir el objeto a un array
    return Object.values(formattedData);
};
