# Aula 15 - CRUD - BACKEND - FILMES

Nessa aula criamos um sistema mínimo de backend com CRUD e uma arquitetura simples baseada em Controllers e Services

## Tecnologias Utilziadas
- Express v5
- Prisma v7
- SQLite 
- Typescript v7
- Node v25

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js
- npm 

## Instalação e configuração

**1. Instale as dependências**

Na raiz do projeto, execute:

```bash
npm install
```

**2. Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto, com o seguinte conteúdo:

```env
DATABASE_URL="file:./dev.db"
```

**3. Sincronize o banco de dados**

Execute:

```bash
npx prisma db push
```

Esse comando cria o banco SQLite, caso ainda não exista, e sincroniza sua estrutura com os modelos definidos em `prisma/schema.prisma`.
Nessa aula temos apenas o modelo "filme".


**4. Gere o Prisma Client**

Execute:

```bash
npx prisma generate
```

Esse comando gera o cliente utilizado pela aplicação para acessar o banco de dados.
Será gerada uma pasta "src/generated". Não modifique nada nessa pasta.
Observe também no .gitignore que ela não é versionada, e portanto, não está no repositório.


## Executando o projeto

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

A aplicação fica disponível em **http://localhost:3001**.

## API de filmes

O prefixo `/filmes` é definido em `src/app.ts`. As rotas são registradas em `src/routes/filme.routes.ts`, recebem as requisições no `FilmeController` e acessam o banco por meio do `FilmeService`.

### Resumo das rotas

| Método HTTP | Rota | Método do controller/service | Operação | Sucesso | Erros previstos |
| --- | --- | --- | --- | --- | --- |
| `POST` | `/filmes` | `create` | Cadastrar um filme | `201 Created` | `400`, `500` |
| `GET` | `/filmes` | `findAll` | Listar os filmes | `200 OK` | `500` |
| `GET` | `/filmes/:id` | `findById` | Buscar um filme pelo ID | `200 OK` | `400`, `404`, `500` |
| `PUT` | `/filmes/:id` | `update` | Atualizar os dados de um filme | `200 OK` | `400`, `404`, `500` |
| `DELETE` | `/filmes/:id` | `delete` | Excluir um filme | `204 No Content` | `400`, `404`, `500` |

O `:id` representa um valor no caminho da URL. Por exemplo, `/filmes/1` identifica o filme de ID `1`. O ID deve ser um inteiro entre `1` e `2147483647`.

### Campos de entrada e saída

Envie o cabeçalho `Content-Type: application/json` nos métodos `POST` e `PUT`. Ambos exigem os três campos abaixo no corpo da requisição:

| Campo | Tipo JSON | Regra |
| --- | --- | --- |
| `titulo` | `string` | Obrigatório e não vazio após remover espaços das extremidades. |
| `nota` | `number` | Obrigatório, finito e entre `0` e `10`, inclusive. Não aceita números enviados como texto. |
| `imagem` | `string` | Obrigatório e não vazio após remover espaços das extremidades. |

Os valores de `titulo` e `imagem` são salvos sem espaços nas extremidades. A API valida `imagem` como texto; não exige uma URL nem verifica se a imagem existe.

As respostas que representam um filme contêm também:

| Campo | Tipo JSON | Descrição |
| --- | --- | --- |
| `id` | `number` | Identificador inteiro gerado automaticamente pelo banco. |
| `createdAt` | `string` | Data de criação representada em ISO 8601, como `2026-11-14T20:00:00.000Z`. |

Somente `titulo`, `nota` e `imagem` são enviados ao service. Campos extras no corpo, incluindo `id` e `createdAt`, são ignorados no cadastro e na atualização.


### Mensagens de erro

Os erros de validação e de filme inexistente produzidos pelo controller têm o formato:

```json
{
  "erro": "Filme inexistente."
}
```

| Status | Situação | Mensagem no campo `erro` |
| --- | --- | --- |
| `400` | Corpo ausente ou que não é um objeto, como um array | `O corpo da requisição deve ser um objeto JSON.` |
| `400` | Título ausente, de tipo incorreto ou vazio | `O título deve ser um texto não vazio.` |
| `400` | Nota ausente, de tipo incorreto ou fora da escala | `A nota deve ser um número entre 0 e 10.` |
| `400` | Imagem ausente, de tipo incorreto ou vazia | `A imagem deve ser um texto não vazio.` |
| `400` | ID fora do intervalo aceito ou que não representa um inteiro | `O ID deve ser um inteiro entre 1 e 2147483647.` |
| `404` | Filme não encontrado | `Filme inexistente.` |

O controller retorna a primeira falha de validação identificada. JSON malformado é rejeitado pelo `express.json()` com `400`; nesse caso, a resposta segue o tratamento padrão do Express, em HTML. Falhas internas inesperadas também seguem esse tratamento padrão, normalmente com status `500` e corpo HTML, sem o formato JSON acima.

## Prisma Studio

O Prisma Studio permite visualizar, inserir, editar e excluir registros do banco de dados por meio de uma interface gráfica no navegador.

Para iniciar, execute:

```bash
npm run prisma:studio
```

Faça isso em outro terminal para ter, ao mesmo tempo, o prisma studio aberto no navegador e o servidor executando.


**Observação:** neste projeto, o comando do Studio utiliza uma URL específica (`file://./dev.db`) como contorno para uma incompatibilidade observada com SQLite no Prisma Studio. 
A aplicação e a configuração principal do Prisma continuam utilizando `file:./dev.db`.

Você pode conferir isso no package.json.

O comando `prisma:studio` é um script definido no arquivo `package.json`, na seção `scripts`:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "prisma:studio": "prisma studio --url \"file://./dev.db\""
  }
}
```


## Estrutura do projeto

```text
backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controller/
│   ├── routes/
│   ├── services/
│   ├── prisma/
│   ├── app.ts
│   └── server.ts
├── .env
├── prisma.config.ts
├── package.json
└── tsconfig.json
```








