import { createUser, findUserByUsername } from "../services/userServices.js";
import helpers from "../auth/helper.js";
import { generateToken } from "../auth/index.js";

// Controlador para el inicio de sesión
export const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario por nombre de usuario en la base de datos
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Verificar la contraseña del usuario
    const isPasswordValid = await helpers.matchPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Generar un token JWT
    const token = generateToken(user.id);
    const isAdmin = user.isAdmin;
    return res.status(200).json({ message: 'Autenticación exitosa', token, isAdmin });
  } catch (error) {
    return res.status(500).json({ message: 'Error de autenticación', error: error.message });
  }
};

// Controlador para la creación de usuarios
export const createUserController = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verificar si ya existe un usuario con el mismo nombre de usuario
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    // Encriptar la contraseña
    const hashedPassword = await helpers.encryptPassword(password);

    // Crear un nuevo usuario
    const newUser = await createUser(username, hashedPassword);

    return res.status(201).json({ message: 'Usuario creado correctamente', newUser });
  } catch (error) {
    return res.status(500).json({ message: 'Error al guardar usuario', error: error.message });
  }
};
