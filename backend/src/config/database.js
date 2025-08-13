const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Carregar configurações do arquivo
const configPath = path.join(__dirname, '../../config.env');
const configContent = fs.readFileSync(configPath, 'utf8');
const config = {};

configContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value && !key.startsWith('#')) {
    config[key.trim()] = value.trim();
  }
});

const dbConfig = {
  host: config.DB_HOST || 'localhost',
  user: config.DB_USER || 'root',
  password: config.DB_PASSWORD || '',
  database: config.DB_NAME || 'app_livros',
  port: config.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Testar conexão
pool.getConnection()
  .then(connection => {
    console.log('Conexão com MySQL estabelecida com sucesso!');
    connection.release();
  })
  .catch(err => {
    console.error('Erro ao conectar com MySQL:', err.message);
  });

module.exports = pool;
