const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Validações para registro
const registerValidation = [
  body('login')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Login deve ter entre 3 e 50 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('numero')
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Número deve ter entre 10 e 15 caracteres'),
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('confirmarSenha')
    .custom((value, { req }) => {
      if (value !== req.body.senha) {
        throw new Error('Confirmação de senha não coincide');
      }
      return true;
    })
];

// Validações para login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

// Rotas públicas
router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthController.login);

// Rotas protegidas
router.get('/profile', auth, AuthController.getProfile);

module.exports = router;
