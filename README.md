# Product Management System

Este projeto é um sistema de gerenciamento de produtos com autenticação de usuários. Os usuários podem criar uma conta, fazer login e gerenciar seus produtos (criar, visualizar, editar e excluir).

## Tecnologias Utilizadas

### Backend
- .NET Core 8
- Entity Framework Core
- ASP.NET Core Identity
- JWT Authentication
- SQLite

### Frontend
- React
- React Router
- React Query
- Zustand (gerenciamento de estado)
- TailwindCSS
- ShadCN UI (componentes)

## Configuração e Execução

### Backend

1. Clone o repositório:
   ```bash
   git clone https://github.com/rogerapdev/ProductManagement.git
   cd ProductManagement
   ```

2. String de conexão do banco de dados em `src/ProductManagement.API/appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Data Source=ProductManagement.db"
   }
   ```
3. Execute as migrações do banco de dados:
   ```bash
   cd src/ProductManagement.API
   dotnet ef database update --project ../ProductManagement.Infrastructure/ProductManagement.Infrastructure.csproj
   ```

4. Execute a API:
   ```bash
   dotnet run
   ```

   A API estará disponível em `https://localhost:5001`.

### Frontend

1. Navegue até a pasta do frontend:
   ```bash
   cd src/ProductManagement.Web
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure a variável de ambiente para a URL da API:
   ```
   # .env
   REACT_APP_API_URL=https://localhost:5001
   ```

4. Execute o aplicativo React:
   ```bash
   npm start
   ```

   O frontend estará disponível em `http://localhost:3000`.

## Estrutura do Projeto

### Backend

O backend segue uma arquitetura em camadas baseada em DDD (Domain-Driven Design):

- **ProductManagement.API** - Controladores da API, middleware, configuração
- **ProductManagement.Application** - Serviços de aplicação, DTOs, validadores
- **ProductManagement.Domain** - Entidades, objetos de valor, serviços de domínio
- **ProductManagement.Infrastructure** - Repositórios, contexto EF, migrações

### Frontend

O frontend segue uma estrutura baseada em componentes React:

- **components/** - Componentes reutilizáveis da UI
- **pages/** - Páginas/rotas da aplicação
- **services/** - Serviços para comunicação com a API
- **store/** - Gerenciamento de estado com Zustand
- **lib/** - Utilitários e funções auxiliares

## Funcionalidades

### Autenticação
- Registro de usuário
- Login de usuário
- Proteção de rotas autenticadas
- Armazenamento seguro de token JWT

### Gerenciamento de Produtos
- Visualização de produtos do usuário
- Criação de novos produtos
- Edição de produtos existentes
- Exclusão de produtos
- Upload de imagens para produtos
- Ordenação de produtos por data ou preço

## Implementados

### Backend
- ✅ Autenticação baseada em JWT com ASP.NET Core Identity
- ✅ API RESTful para gerenciamento de produtos
- ✅ Relacionamento de produtos com usuários
- ✅ Upload de imagens com validação de tipo de arquivo
- ✅ Banco de dados com Entity Framework Core

### Frontend
- ✅ Autenticação e sessão com armazenamento seguro de token
- ✅ Formulários de registro e login
- ✅ Dashboard para visualização de produtos
- ✅ Formulário para criação e edição de produtos
- ✅ Upload de imagens
- ✅ Filtro para ordenação de produtos
- ✅ React Query para requisições assíncronas
- ✅ Zustand para gerenciamento de estado
- ✅ UI com TailwindCSS e ShadCN