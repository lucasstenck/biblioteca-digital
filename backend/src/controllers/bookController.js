const Book = require('../models/Book');
const path = require('path');
const fs = require('fs');

class BookController {
  static async getAllBooks(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      
      if (page < 1 || limit < 1) {
        return res.status(400).json({
          success: false,
          message: 'Página e limite devem ser números positivos'
        });
      }
      
      const result = await Book.getAll(page, limit);
      
             // Mapear campos dos livros com validação
       const mappedBooks = result.books.map(book => {
         // Validar se o livro tem todos os campos necessários
         if (!book || !book.id || !book.title) {
           console.log('Livro inválido encontrado:', book);
           return null;
         }
         
         return {
           id: book.id,
           title: book.title || 'Título não disponível',
           description: book.description || 'Descrição não disponível',
           short_description: book.short_description || book.description || 'Descrição não disponível',
           author: book.author || 'Autor não informado',
           category: book.category || 'Categoria não informada',
           image_url: book.image_url || null,
           pdf_url: book.pdf_url || null,
           download_count: book.download_count || 0,
           created_at: book.created_at || new Date(),
           updated_at: book.updated_at || new Date()
         };
       }).filter(book => book !== null); // Remover livros inválidos
      
      res.json({
        success: true,
        data: {
          books: mappedBooks,
          pagination: result.pagination
        }
      });
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
  
  static async getBookById(req, res) {
    try {
      const { id } = req.params;
      const book = await Book.getById(id);
      
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Livro não encontrado'
        });
      }
      
                   // Mapear campos do banco para o formato esperado pelo frontend
      const mappedBook = {
        id: book.id,
        title: book.title,
        description: book.description,
        short_description: book.short_description || book.description,
        author: book.author || 'Autor não informado',
        category: book.category || 'Categoria não informada',
        image_url: book.image_url || null,
        pdf_url: book.pdf_url || null,
        download_count: book.download_count,
        created_at: book.created_at,
        updated_at: book.updated_at
      };
      
      console.log('Livro mapeado:', mappedBook);
      
      res.json({
        success: true,
        data: { book: mappedBook }
      });
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
  
  static async searchBooks(req, res) {
    try {
      const { q, page = 1, limit = 5 } = req.query;
      
      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Termo de busca é obrigatório'
        });
      }
      
      const result = await Book.search(q.trim(), parseInt(page), parseInt(limit));
      
                   // Mapear campos dos livros
      const mappedBooks = result.books.map(book => ({
        id: book.id,
        title: book.title,
        description: book.description,
        short_description: book.short_description || book.description,
        author: book.author,
        category: book.category,
        image_url: book.image_url || null,
        pdf_url: book.pdf_url || null,
        download_count: book.download_count,
        created_at: book.created_at,
        updated_at: book.updated_at
      }));
      
      res.json({
        success: true,
        data: {
          books: mappedBooks,
          pagination: result.pagination
        }
      });
    } catch (error) {
      console.error('Erro na busca:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
  
  static async downloadBook(req, res) {
    try {
      console.log('=== INÍCIO DO DOWNLOAD ===');
      console.log('Download solicitado para livro ID:', req.params.id);
      console.log('Headers da requisição:', req.headers);
      console.log('Token de autorização:', req.headers.authorization ? 'Presente' : 'Ausente');
      
      const { id } = req.params;
      const book = await Book.getById(id);
      
      if (!book) {
        console.log('Livro não encontrado para ID:', id);
        return res.status(404).json({
          success: false,
          message: 'Livro não encontrado'
        });
      }
      
                   console.log('Livro encontrado:', book.title);
      console.log('Arquivo PDF:', book.pdf_url);
      console.log('Dados completos do livro:', book);
      
                         // Extrair apenas o nome do arquivo do pdf_url
       let fileName;
       console.log('URL original do PDF:', book.pdf_url);
       
       // Extrair apenas o nome do arquivo da URL
       if (book.pdf_url && book.pdf_url.includes('/')) {
         const urlParts = book.pdf_url.split('/');
         fileName = urlParts[urlParts.length - 1];
         console.log('Nome do arquivo extraído da URL:', fileName);
       } else {
         fileName = book.pdf_url;
         console.log('Nome do arquivo direto:', fileName);
       }
      
                      // Construir o caminho correto baseado na estrutura real dos arquivos
         // Os arquivos estão em: backend/uploads/books/folder_name/nome_do_arquivo.pdf
         
         // __dirname: C:\Users\lucas\Desktop\App\backend\src\controllers
         // Caminho para uploads: C:\Users\lucas\Desktop\App\backend\uploads
         const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
         const booksDir = path.join(uploadsDir, 'books');
         
         console.log('🔍 Pasta uploads base:', uploadsDir);
         console.log('🔍 Pasta books:', booksDir);
         
         // Primeiro verificar se o arquivo está diretamente na pasta uploads (pasta raiz)
         const directFilePath = path.join(uploadsDir, fileName);
         console.log('🔍 Verificando arquivo diretamente em uploads:', directFilePath);
         
         let finalPath;
         if (fs.existsSync(directFilePath)) {
           console.log('✅ Arquivo encontrado diretamente em uploads');
           finalPath = fileName; // Usar apenas o nome do arquivo
         } else {
           console.log('❌ Arquivo não encontrado diretamente, tentando pasta books...');
           
           // Se não estiver na raiz, tentar usar o folder_name do livro
           const bookFolderName = book.folder_name;
           if (bookFolderName) {
             console.log('🔍 Usando folder_name:', bookFolderName);
             
             // Construir o caminho completo: books/folder_name/nome_do_arquivo.pdf
             finalPath = path.join('books', bookFolderName, fileName);
             console.log('🔍 Caminho construído:', finalPath);
           } else {
             console.log('❌ Livro não tem folder_name definido');
             finalPath = fileName; // Fallback para pasta raiz
           }
         }
      
      console.log('Caminho final construído:', finalPath);
       
             console.log('Nome do arquivo extraído:', fileName);
      console.log('Caminho final para busca:', finalPath);
      
             // Verificar se o arquivo existe
       const filePath = path.join(uploadsDir, finalPath);
        console.log('Caminho completo do arquivo:', filePath);
       
       if (!fs.existsSync(filePath)) {
         console.log('❌ Arquivo não encontrado no caminho:', filePath);
         console.log('📁 Caminhos verificados:');
         console.log('   - Direto:', path.join(uploadsDir, fileName));
         console.log('   - Books:', path.join(uploadsDir, 'books'));
         console.log('   - Final:', filePath);
         
         return res.status(404).json({
           success: false,
           message: `Arquivo PDF não encontrado. Procurado em: ${filePath}`,
           debug: {
             fileName,
             finalPath,
             searchedPaths: [
               path.join(uploadsDir, fileName),
               path.join(uploadsDir, 'books'),
               filePath
             ]
           }
         });
       }
       
       // Verificar tamanho do arquivo
       const stats = fs.statSync(filePath);
       console.log('Tamanho do arquivo:', stats.size, 'bytes');
       
       if (stats.size === 0) {
         console.log('Arquivo está vazio');
         return res.status(500).json({
           success: false,
           message: 'Arquivo PDF está vazio'
         });
       }
       
       console.log('Arquivo encontrado e válido, iniciando download...');
       
       // Incrementar contador de downloads
       await Book.incrementDownloadCount(id);
       
             // Configurar headers para download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${book.title}.pdf"`);
      res.setHeader('Content-Length', stats.size);
       res.setHeader('Cache-Control', 'no-cache');
      
      console.log('Headers configurados, enviando arquivo...');
      
      // Enviar arquivo
      const fileStream = fs.createReadStream(filePath);
      
      fileStream.on('error', (error) => {
        console.error('Erro ao ler arquivo:', error);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Erro ao ler arquivo'
          });
        }
      });
      
      fileStream.on('end', () => {
        console.log('Download concluído com sucesso');
      });
      
      fileStream.pipe(res);
      
    } catch (error) {
      console.error('Erro no download:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }
  
  static async getPopularBooks(req, res) {
    try {
      console.log('=== CONTROLLER: BUSCANDO LIVROS POPULARES ===');
      const limit = parseInt(req.query.limit) || 5;
      console.log('Limit solicitado:', limit);
      
      console.log('Chamando modelo Book.getPopularBooks...');
      const books = await Book.getPopularBooks(limit);
      console.log('✅ Modelo retornou livros:', books.length);
      
      if (!books || books.length === 0) {
        console.log('⚠️ Nenhum livro encontrado, retornando array vazio');
        return res.json({
          success: true,
          data: { books: [] }
        });
      }
      
             console.log('Primeiro livro recebido:', {
         id: books[0].id,
         title: books[0].title,
         campos_disponiveis: Object.keys(books[0])
       });
      
             // Mapear campos dos livros com validação
       console.log('Iniciando mapeamento dos livros...');
       const mappedBooks = books.map((book, index) => {
         console.log(`Mapeando livro ${index + 1}:`, book.id);
         
         // Validar se o livro tem todos os campos necessários
         if (!book || !book.id || !book.title) {
           console.log('❌ Livro inválido encontrado:', book);
           return null;
         }
         
         const mappedBook = {
           id: book.id,
           title: book.title || 'Título não disponível',
           description: book.description || 'Descrição não disponível',
           short_description: book.short_description || book.description || 'Descrição não disponível',
           author: book.author || 'Autor não informado',
           category: book.category || 'Categoria não informada',
           image_url: book.image_url || null,
           pdf_url: book.pdf_url || null,
           download_count: book.download_count || 0,
           created_at: book.created_at || new Date(),
           updated_at: book.updated_at || new Date()
         };
         
         console.log(`✅ Livro ${index + 1} mapeado com sucesso`);
         return mappedBook;
       }).filter(book => book !== null); // Remover livros inválidos
      
      console.log('✅ Total de livros mapeados:', mappedBooks.length);
      
      res.json({
        success: true,
        data: { books: mappedBooks }
      });
      
    } catch (error) {
      console.error('=== CONTROLLER: Erro ao buscar livros populares ===');
      console.error('Mensagem:', error.message);
      console.error('Código:', error.code);
      console.error('Stack trace:', error.stack);
      
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }
  
  static async getBookCover(req, res) {
    try {
      const { id } = req.params;
      const book = await Book.getById(id);
      
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Livro não encontrado'
        });
      }
      
                   // Extrair apenas o nome do arquivo do image_url
      let imageFileName = book.image_url;
      if (imageFileName && imageFileName.includes('/uploads/')) {
        imageFileName = imageFileName.split('/uploads/')[1];
        // Remover o prefixo 'books/' se existir
        if (imageFileName.startsWith('books/')) {
          imageFileName = imageFileName.substring(6); // Remove 'books/'
        }
      } else if (imageFileName && imageFileName.includes('uploads/')) {
        // Caso a URL não tenha a barra inicial
        imageFileName = imageFileName.split('uploads/')[1];
        if (imageFileName.startsWith('books/')) {
          imageFileName = imageFileName.substring(6);
        }
      }
       
       console.log('Nome da imagem extraído:', imageFileName);
       
       // Verificar se a imagem existe
       const imagePath = path.join(__dirname, '../../../uploads', imageFileName);
      
      if (!fs.existsSync(imagePath)) {
        return res.status(404).json({
          success: false,
          message: 'Imagem da capa não encontrada'
        });
      }
      
      // Enviar imagem
      res.sendFile(imagePath);
      
    } catch (error) {
      console.error('Erro ao buscar capa:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = BookController;
