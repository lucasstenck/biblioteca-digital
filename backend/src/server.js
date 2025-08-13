const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Carregar configurações
const configPath = path.join(__dirname, '../config.env');
const configContent = fs.readFileSync(configPath, 'utf8');
const config = {};

configContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value && !key.startsWith('#')) {
    config[key.trim()] = value.trim();
  }
});

const app = express();
const PORT = config.PORT || 3000;

// Middleware
app.use(cors({
  origin: true, // Permitir todas as origens para desenvolvimento
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: 'API de Livros funcionando!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      books: '/api/books'
    }
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${config.NODE_ENV || 'development'}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`URL da rede: http://192.168.0.110:${PORT}`);
  console.log(`Servidor escutando em todas as interfaces (0.0.0.0:${PORT})`);
});

module.exports = app;
