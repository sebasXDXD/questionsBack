import jwt from 'jsonwebtoken';

export const jwtConfig = {
  secretKey: 'EstaEsUnaPalabraUltraSecreta',
  expiresIn: 60 * 60, // 1 hora
};

export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, jwtConfig.secretKey, { expiresIn: jwtConfig.expiresIn });
  return token;
};

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const tokenWithoutBearer = token.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(tokenWithoutBearer, jwtConfig.secretKey);

    // Obtener el userId del payload
    const userId = decoded.userId;

    req.userId = userId;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Token inválido' });
  }
};
