# 💊 Stock Control System

Sistema fullstack para controle de estoque de medicamentos, com autenticação de usuários, gerenciamento de produtos e movimentações de entrada/saída.

Projeto desenvolvido para fins de estudo e portfólio, com foco em backend e arquitetura de aplicações web modernas.

## 🚀 Tecnologias Utilizadas

### Backend
- Node.js
- Express
- PostgreSQL
- JWT (Autenticação)
- Arquitetura modular

### Frontend
- React
- Fetch API
- Single Page Application (SPA)

### Deploy
- Vercel (Frontend)
- Render (Backend)
- GitHub (Versionamento)

## 📁 Estrutura do Projeto

```
stock-control/
├── frontend/
├── backend/
├── .gitignore
└── README.md
```

## 🔐 Funcionalidades

- ✅ Cadastro e login de usuários
- ✅ CRUD de medicamentos
- ✅ Controle de estoque
- ✅ Registro de movimentações (entrada e saída)
- ✅ Validação de requisições
- ✅ Integração frontend ↔ backend via API REST

## ⚙️ Como Rodar Localmente

### 1. Clonar o Repositório
```bash
git clone URL_DO_REPOSITORIO
cd stock-control
```

### 2. Configurar Backend
```bash
cd backend
npm install
```

Criar arquivo `.env`:
```
PORT=3000
DATABASE_URL=sua_url_do_banco
JWT_SECRET=sua_chave_secreta
```

Executar:
```bash
npm run dev
```

### 3. Configurar Frontend
```bash
cd frontend
npm install
npm start
```

## 🌍 API Endpoints

### Autenticação
- `POST /auth/register`
- `POST /auth/login`

### Medicamentos
- `GET /medicines`
- `POST /medicines`
- `PUT /medicines/:id`
- `DELETE /medicines/:id`

### Estoque
- `POST /stock`
- `GET /stock`

## 🎯 Objetivo do Projeto

- Prática de backend com Node.js
- Organização de código em arquitetura modular
- Integração com banco relacional
- Deploy em ambiente real
- Preparação para vagas de estágio em desenvolvimento backend

## 📌 Próximas Melhorias

- 🔄 Testes automatizados
- 🛡️ Middleware global de tratamento de erros
- 📊 Dashboard com métricas
- 🐳 Dockerização
- 🔐 Refresh Token
- 📁 Upload de imagens de medicamentos

## 👨‍💻 Autor

**Gabriel Santos**  
Estudante de Análise e Desenvolvimento de Sistemas  
Foco em Desenvolvimento Backend
