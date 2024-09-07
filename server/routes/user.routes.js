import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Player from "../models/player.model.js";
import { Router } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

const router = Router();

router.post(
  "/sign-up",
  [
    body("username").notEmpty().withMessage("* Se requiere un usuario"),
    body("email").isEmail().withMessage("* Se requiere un correo válido"),
    body("password").notEmpty().withMessage("* Se requiere una contraseña"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password } = req.body;

      // Verificar si el username o el email ya existen
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (existingUser) {
        if (existingUser.username === username) {
          return res.status(400).json({
            errors: [
              {
                msg: "* Usuario no disponible",
                path: "username",
                location: "body",
              },
            ],
          });
        }
        if (existingUser.email === email) {
          return res.status(400).json({
            errors: [
              {
                msg: "* El correo ya está registrado",
                path: "email",
                location: "body",
              },
            ],
          });
        }
      }

      // Hashear la contraseña
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      // Crear el usuario
      const user = new User({
        username,
        email,
        password: hash,
      });
      await user.save();

      // Crear el jugador relacionado
      const player = new Player({
        userId: user._id,
        credits: 20,
      });

      await player.save();

      // Eliminar la contraseña antes de enviar la respuesta
      const { password: hashedPassword, __v, ...data } = user.toJSON();
      res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
);

router.post(
  "/sign-in",
  [
    body("email").isEmail().withMessage("* Se requiere un correo válido"),
    body("password").notEmpty().withMessage("* Se requiere una contraseña"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: "* No estás registrado",
              path: "email",
              location: "body",
            },
          ],
        });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({
          errors: [
            {
              msg: "* La contraseña es incorrecta",
              path: "password",
              location: "body",
            },
          ],
        });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      const { password: hashedPassword, __v, ...data } = user.toJSON();

      res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
);

router.get("/verify", (req, res) => {
  const token = req.cookies["jwt"];

  if (!token) {
    return res.status(401).json({ message: "* No autenticado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "* No autorizado" });
    }

    res.status(200).json({ message: "Token is valid", userId: decoded.id });
  });
});

export default router;
