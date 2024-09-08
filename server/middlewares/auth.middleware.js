import jwt from "jsonwebtoken";

// Middleware para verificar el token y agregar el usuario al request
const authenticateToken = (req, res, next) => {
  const token = req.cookies["jwt"];

  if (!token) {
    return res.status(401).json({ message: "* No autenticado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "* No autorizado" });
    }

    req.userId = decoded.id; // Extraer el ID del usuario del token
    next();
  });
};

export default authenticateToken;
