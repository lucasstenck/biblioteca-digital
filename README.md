# Biblioteca Digital

Aplicativo móvel para download de livros em PDF desenvolvido com Expo Go, React Native, TypeScript, Node.js e MySQL.

## 🚀 Funcionalidades

- Cadastro e login de usuários com autenticação JWT
- Listagem de livros com paginação
- Busca e filtros de livros
- Download de livros em PDF
- Interface responsiva para Android e iOS
- Navegação por tabs
- Perfil do usuário
- Sistema de uploads e gerenciamento de arquivos

## 🛠️ Tecnologias

- **Frontend**: React Native, Expo, TypeScript
- **Backend**: Node.js, Express, MySQL
- **Autenticação**: JWT com bcrypt
- **Banco de Dados**: MySQL com suporte a UTF-8
- **Uploads**: Sistema de arquivos local

## 📱 Estrutura do Projeto

```
App/
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── config/         # Configuração do banco
│   │   ├── controllers/    # Controladores da API
│   │   ├── middleware/     # Middlewares (auth)
│   │   ├── models/         # Modelos do banco
│   │   ├── routes/         # Rotas da API
│   │   └── server.js       # Servidor principal
│   ├── uploads/            # Arquivos PDF e imagens
│   └── package.json
├── frontend/               # App React Native
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── contexts/       # Contextos (Auth)
│   │   ├── navigation/     # Navegação
│   │   ├── screens/        # Telas do app
│   │   ├── services/       # Serviços de API
│   │   └── types/          # Tipos TypeScript
│   ├── App.tsx             # Componente principal
│   └── package.json
├── database/               # Scripts de banco
│   ├── schema.sql          # Estrutura do banco
│   └── setup.js            # Script de configuração
└── package.json            # Dependências principais
```

## 🚀 Instalação

1. **Clonar o repositório**:
   ```bash
   git clone https://github.com/lucasstenck/biblioteca-digital.git
   cd biblioteca-digital
   ```

2. **Instalar dependências**:
   ```bash
   npm run install-all
   ```

3. **Configurar banco MySQL**:
   - Editar `backend/config.env`
   - Configurar senha do MySQL
   - Executar: `cd database && node setup.js`

4. **Iniciar aplicação**:
   ```bash
   npm start
   ```

## 📖 Documentação

Consulte o arquivo [INSTALACAO.md](INSTALACAO.md) para instruções detalhadas de instalação e configuração.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
