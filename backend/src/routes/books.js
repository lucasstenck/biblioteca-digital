const express = require('express');
const BookController = require('../controllers/bookController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Rotas públicas
router.get('/', BookController.getAllBooks);
router.get('/search', BookController.searchBooks);
router.get('/popular', BookController.getPopularBooks);
router.get('/:id', BookController.getBookById);
router.get('/:id/cover', BookController.getBookCover);

// Rotas protegidas (requerem autenticação)
router.get('/:id/download', auth, BookController.downloadBook);

module.exports = router;
