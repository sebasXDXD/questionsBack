CREATE DATABASE IF NOT EXISTS questionsdb;
USE questionsdb;


CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS questionnaire (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_created_id INT,
  theme VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_created_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_questionnaire INT,
  question TEXT NOT NULL,
  answer1 TEXT NOT NULL,
  answer2 TEXT NOT NULL,
  answer3 TEXT NOT NULL,
  answer4 TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_questionnaire) REFERENCES questionnaire(id)
);
CREATE TABLE IF NOT EXISTS user_question (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_questionnaire INT,
  user_id INT,
  user_answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_questionnaire) REFERENCES questionnaire(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);



