const db = require('../config/database');

class Book {
  static async getAll(page = 1, limit = 5) {
    try {
      console.log('=== MODELO: getAll ===');
      console.log('Page:', page, 'Limit:', limit);
      
      const offset = (page - 1) * limit;
      console.log('Offset calculado:', offset);
      
      // Primeiro, testar conexão e contar livros
      console.log('Testando conexão com banco...');
      const [countResult] = await db.query('SELECT COUNT(*) as total FROM books');
      const total = countResult[0].total;
      console.log('Total de livros no banco:', total);
      
      if (total === 0) {
        console.log('⚠️ Nenhum livro encontrado no banco');
        return {
          books: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalBooks: 0,
            hasNext: false,
            hasPrev: false
          }
        };
      }
      
             // Buscar livros com paginação
       console.log('Executando query de livros...');
       const [books] = await db.query(
         'SELECT * FROM books ORDER BY title LIMIT ? OFFSET ?',
         [parseInt(limit), parseInt(offset)]
       );
      
      console.log('Livros retornados da query:', books.length);
             if (books.length > 0) {
         console.log('Primeiro livro:', {
           id: books[0].id,
           title: books[0].title,
           campos: Object.keys(books[0])
         });
       }
      
      return {
        books,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalBooks: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('=== MODELO: Erro em getAll ===');
      console.error('Mensagem:', error.message);
      console.error('Código:', error.code);
      console.error('Stack:', error.stack);
      throw error;
    }
  }
  
  static async getById(id) {
    try {
      console.log('=== MODELO: getById ===');
      console.log('Buscando livro com ID:', id);
      
      const [rows] = await db.query(
        'SELECT * FROM books WHERE id = ?',
        [parseInt(id)]
      );
      
      console.log('Linhas retornadas:', rows.length);
             if (rows.length > 0) {
         console.log('Livro encontrado:', {
           id: rows[0].id,
           title: rows[0].title,
           campos: Object.keys(rows[0])
         });
       } else {
         console.log('❌ Nenhum livro encontrado com ID:', id);
       }
      
      return rows[0];
    } catch (error) {
      console.error('=== MODELO: Erro em getById ===');
      console.error('Mensagem:', error.message);
      console.error('Código:', error.code);
      console.error('Stack:', error.stack);
      throw error;
    }
  }
  
  static async search(query, page = 1, limit = 5) {
    try {
      const offset = (page - 1) * limit;
      const searchQuery = `%${query}%`;
      
                   const [books] = await db.query(
        'SELECT * FROM books WHERE title LIKE ? OR description LIKE ? ORDER BY title LIMIT ? OFFSET ?',
        [searchQuery, searchQuery, parseInt(limit), parseInt(offset)]
      );
      
      const [countResult] = await db.query(
        'SELECT COUNT(*) as total FROM books WHERE title LIKE ? OR description LIKE ?',
        [searchQuery, searchQuery]
      );
      
      const total = countResult[0].total;
      
      return {
        books,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalBooks: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw error;
    }
  }
  
  static async getPopularBooks(limit = 5) {
    try {
      console.log('=== MODELO: Iniciando busca de livros populares ===');
      console.log('Limit solicitado:', limit);
      
      // Primeiro, testar uma query simples
      console.log('Testando query simples...');
      const [testBooks] = await db.query('SELECT COUNT(*) as total FROM books');
      console.log('Total de livros na tabela:', testBooks[0].total);
      
             // Query simplificada para evitar problemas com campos inexistentes
       console.log('Executando query de livros populares...');
       const [books] = await db.query(
         'SELECT * FROM books ORDER BY created_at DESC LIMIT ?',
         [parseInt(limit)]
       );
      
      console.log('Livros encontrados:', books.length);
             if (books.length > 0) {
         console.log('Primeiro livro:', {
           id: books[0].id,
           title: books[0].title,
           download_count: books[0].download_count
         });
       }
      
      return books;
    } catch (error) {
      console.error('=== MODELO: Erro ao buscar livros populares ===');
      console.error('Mensagem:', error.message);
      console.error('Código:', error.code);
      console.error('Stack:', error.stack);
      throw error;
    }
  }
  
     static async incrementDownloadCount(id) {
     try {
       console.log('Incrementando contador de downloads para livro ID:', id);
       // Por enquanto, apenas logar o download (campo download_count não existe)
       console.log('✅ Download registrado para livro ID:', id);
       // TODO: Adicionar campo download_count na tabela se necessário
     } catch (error) {
       console.error('Erro ao incrementar contador de downloads:', error);
       throw error;
     }
   }
}

module.exports = Book;
