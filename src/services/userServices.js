
import { pool } from "../db.js";
export const findUserByUsername = async (username) => {
    try {
        const [rows] = await pool.query('SELECT id,username,isAdmin,password FROM users WHERE username = ?', [username]);
        return rows[0]; 
    } catch (error) {
        throw error;
    }
};
export const createUser = async (username, password) => {
    try {
      const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
      const newUser = {
        id: result.insertId,
        username
      };
      return newUser;
    } catch (error) {
      throw error;
    }
  };