const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    try {
      const { login, email, numero, senha } = userData;
      
      // Verificar se usuário já existe
      const [existingUsers] = await db.execute(
        'SELECT id FROM users WHERE email = ? OR login = ?',
        [email, login]
      );
      
      if (existingUsers.length > 0) {
        throw new Error('Usuário já existe com este email ou login');
      }
      
      // Hash da senha
      const hashedPassword = await bcrypt.hash(senha, 12);
      
      const [result] = await db.execute(
        'INSERT INTO users (login, email, numero, password, created_at) VALUES (?, ?, ?, ?, NOW())',
        [login, email, numero, hashedPassword]
      );
      
      return { id: result.insertId, login, email, numero };
    } catch (error) {
      throw error;
    }
  }
  
  static async findByEmail(email) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  static async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT id, login, email, numero, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  static async validatePassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }
  
  static async updateProfile(id, userData) {
    try {
      const { login, email, numero } = userData;
      
      const [result] = await db.execute(
        'UPDATE users SET login = ?, email = ?, numero = ? WHERE id = ?',
        [login, email, numero, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
