# API Cardápio Digital

API REST em .NET 8 para gerenciamento de cardápios digitais com arquitetura de camadas.

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura de camadas bem definida:

- **Models**: Entidades do banco de dados
- **DTOs**: Objetos de transferência de dados
- **Repositories**: Camada de acesso aos dados
- **Services**: Regras de negócio
- **Controllers**: Endpoints da API
- **Data**: Contexto do Entity Framework

## 📊 Modelo de Dados

### Entidades

- **Usuario**: Usuários do sistema (restaurantes)
- **Categoria**: Categorias dos itens (Pratos Principais, Bebidas, etc.)
- **Cardapio**: Cardápios criados pelos usuários
- **ItemCardapio**: Itens que compõem os cardápios
- **VariacaoItem**: Variações dos itens (tamanhos, sabores, etc.)

### Relacionamentos

- Usuario 1:N Cardapio
- Categoria 1:N ItemCardapio
- ItemCardapio N:M Cardapio
- ItemCardapio 1:N VariacaoItem

## 🚀 Configuração

### Pré-requisitos

- .NET 8 SDK
- PostgreSQL 12+

### Configuração do Banco

1. Instale o PostgreSQL
2. Crie um banco de dados chamado `defaultdb`
3. Atualize a string de conexão no `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=defaultdb;Username=postgres;Password=SUA_SENHA"
  }
}
```

### Instalação

```bash
# Clone o repositório
cd APICardapio

# Restaurar dependências
dotnet restore

# Executar migrations (se não executou automaticamente)
dotnet ef database update

# Executar a aplicação
dotnet run
```

## 📚 Endpoints da API

### Autenticação

- `POST /api/usuarios/login` - Login com email e senha

### Usuários

- `GET /api/usuarios` - Listar todos os usuários
- `GET /api/usuarios/{id}` - Obter usuário por ID
- `POST /api/usuarios` - Criar novo usuário
- `PUT /api/usuarios/{id}` - Atualizar usuário
- `DELETE /api/usuarios/{id}` - Deletar usuário (soft delete)

### Exemplo de Requisição POST /api/usuarios/login

```json
{
  "email": "contato@restaurante.com",
  "senha": "123456"
}
```

### Exemplo de Resposta Login

```json
{
  "id": 1,
  "nome": "Restaurante Exemplo",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Exemplo de Requisição POST /api/usuarios

```json
{
  "nome": "Restaurante Exemplo",
  "email": "contato@restaurante.com",
  "senha": "123456"
}
```

### Exemplo de Resposta

```json
{
  "id": 1,
  "nome": "Restaurante Exemplo",
  "email": "contato@restaurante.com",
  "dataCriacao": "2025-05-31T10:30:00Z",
  "ativo": true
}
```

## 🔧 Tecnologias Utilizadas

- **Framework**: .NET 8
- **ORM**: Entity Framework Core 8
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT com BCrypt para hash de senhas
- **Documentação**: Swagger/OpenAPI
- **Arquitetura**: Repository Pattern + Service Layer

## 📈 Próximos Passos

Endpoints que podem ser implementados:

1. **Categorias**
   - CRUD completo para categorias
   
2. **Cardápios**
   - CRUD para cardápios
   - Associar/desassociar itens
   
3. **Itens do Cardápio**
   - CRUD para itens
   - Upload de imagens
   
4. **Variações**
   - CRUD para variações dos itens

5. **Autenticação** ✅
   - JWT Authentication (implementado)
   - Login com email e senha (implementado)
   - Hash seguro de senhas com BCrypt (implementado)

## 🐛 Desenvolvimento

```bash
# Executar em modo desenvolvimento
dotnet run --environment Development

# Acessar documentação
# http://localhost:5000 (Swagger)

# Executar testes
dotnet test
```

## 📝 Notas

- A API utiliza soft delete para usuários (marca como inativo)
- Senhas são hasheadas com BCrypt para segurança
- Login é realizado com email e senha, retornando token JWT
- Usuários inativos não conseguem fazer login
- Migrations são executadas automaticamente no startup
- Dados iniciais de categorias são criados automaticamente
