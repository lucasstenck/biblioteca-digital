const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configurações do banco
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Stenck', // Senha configurada
  port: 3306
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('Conectando ao MySQL...');
    connection = await mysql.createConnection(dbConfig);
    
           // Criar banco de dados
       console.log('Criando banco de dados...');
       await connection.query('CREATE DATABASE IF NOT EXISTS app_livros CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
       
       // Usar o banco
       await connection.query('USE app_livros');
    
    // Ler e executar schema
    console.log('Executando schema...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Dividir em comandos individuais
    const commands = schema.split(';').filter(cmd => cmd.trim());
    
    for (const command of commands) {
      if (command.trim()) {
        try {
          await connection.execute(command);
        } catch (error) {
          if (!error.message.includes('already exists')) {
            console.error('Erro ao executar comando:', error.message);
          }
        }
      }
    }
    
    console.log('Banco de dados configurado com sucesso!');
    
    // Criar pasta uploads se não existir
    const uploadsPath = path.join(__dirname, '../backend/uploads');
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
      console.log('Pasta uploads criada');
    }
    
    // Pasta uploads já deve conter os arquivos necessários
    console.log('Pasta uploads verificada');
    
    console.log('Configuração concluída com sucesso!');
    
  } catch (error) {
    console.error('Erro durante a configuração:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Executar configuração
setupDatabase();
