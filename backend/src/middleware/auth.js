const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Carregar configurações
const configPath = path.join(__dirname, '../../config.env');
const configContent = fs.readFileSync(configPath, 'utf8');
const config = {};

configContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value && !key.startsWith('#')) {
    config[key.trim()] = value.trim();
  }
});

const JWT_SECRET = config.JWT_SECRET || 'chave_secreta_padrao';

const auth = (req, res, next) => {
  try {
    console.log('=== MIDDLEWARE DE AUTENTICAÇÃO ===');
    console.log('URL:', req.url);
    console.log('Método:', req.method);
    console.log('Headers de autorização:', req.headers.authorization ? 'Presente' : 'Ausente');
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ Token não fornecido');
      return res.status(401).json({ 
        success: false, 
        message: 'Token de acesso não fornecido' 
      });
    }
    
    console.log('Token recebido:', token.substring(0, 20) + '...');
    
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token válido para usuário:', decoded.userId);
    
    req.user = decoded;
    next();
  } catch (error) {
    console.log('❌ Erro na autenticação:', error.message);
    return res.status(401).json({ 
      success: false, 
      message: 'Token inválido ou expirado' 
    });
  }
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { 
    expiresIn: config.JWT_EXPIRES_IN || '7d' 
  });
};

module.exports = { auth, generateToken };
