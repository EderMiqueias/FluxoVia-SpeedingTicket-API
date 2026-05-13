# 🚦 FluxoVia — Speeding Ticket API

> Microsserviço de notificação de infrações de trânsito do ecossistema **FluxoVia**.

Ao receber os dados de uma infração, este serviço **gera automaticamente um PDF da multa**, armazena o documento na nuvem e **notifica o condutor por e-mail** — tudo em uma única requisição autenticada.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Fluxo de Processamento](#-fluxo-de-processamento)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Endpoints da API](#-endpoints-da-api)
- [Executando os Testes](#-executando-os-testes)

---

## 🔍 Visão Geral

O **FluxoVia Speeding Ticket API** é um microsserviço com responsabilidade única dentro do ecossistema FluxoVia. Seu papel é atuar como um **serviço de notificação de infrações**, recebendo os dados capturados pelos radares, produzindo o documento oficial da multa e garantindo que ele chegue ao infrator.

A autenticação de acesso é feita via **JWT**, garantindo que apenas sistemas autorizados dentro do ecossistema possam emitir notificações.

---

## 🔄 Fluxo de Processamento

```
  Cliente Autenticado (Bearer JWT)
           │
           ▼
  POST /tickets  ──────────────────────────────────┐
           │                                        │
           ▼                                        │
  [1] Valida o payload da infração                  │
           │                                        │
           ▼                                        │
  [2] Renderiza o template HTML via Puppeteer        │
      e gera o PDF (formato A4)                     │
           │                                        │
           ▼                                        │
  [3] Faz upload do PDF para o AWS S3               │
      e obtém a URL pública do documento            │
           │                                        │
           ▼                                        │
  [4] Envia e-mail ao condutor via Nodemailer        │
      com o PDF como anexo                          │
           │                                        │
           ▼                                        │
  Retorna { pdfUrl, message } ◄────────────────────┘
```

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Finalidade |
|---|---|---|
| **NestJS** | `^10` | Framework principal (Node.js + TypeScript) |
| **TypeORM** + **PostgreSQL** | `^0.3` / `pg ^8` | Persistência e gestão de usuários da API |
| **JWT** (`@nestjs/jwt`) | `^10` | Autenticação via Bearer Token |
| **Puppeteer** | `^24` | Renderização do template HTML para PDF A4 |
| **AWS SDK — S3** | `^3` | Armazenamento do PDF gerado na nuvem |
| **Nodemailer** | `^8` | Envio do e-mail com o PDF em anexo |
| **bcrypt** | `^5` | Hash seguro de senhas |
| **class-validator** | `^0.14` | Validação dos DTOs de entrada |

---

## 📁 Estrutura do Projeto

```
src/
├── app.module.ts
├── main.ts
├── auth/                       # Módulo de autenticação
│   ├── auth.controller.ts      # POST /auth (register/login híbrido)
│   ├── auth.dto.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── jwt-auth.guard.ts
│   └── jwt.strategy.ts
└── tickets/                    # Módulo principal
    ├── create-ticket.dto.ts    # Payload de infração
    ├── ticket.entity.ts
    ├── tickets.controller.ts   # POST /tickets
    ├── tickets.module.ts
    ├── tickets.service.ts      # Orquestra PDF + S3 + Email
    └── utils/
        ├── aws-s3.service.ts   # Upload para o S3
        └── email.service.ts    # Envio via Nodemailer

assets/
└── templates/
    └── ticket.html             # Template HTML da multa (renderizado pelo Puppeteer)

infra/                          # Infraestrutura como Código (Terraform/AWS)
```

---

## 🚀 Instalação

### Pré-requisitos

- Node.js `>= 20`
- PostgreSQL em execução
- Credenciais AWS com permissão de escrita no bucket S3
- Conta SMTP configurada (ex.: Gmail, SendGrid)

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/FluxoVia/FluxoVia-SpeedingTicket-API.git
cd FluxoVia-SpeedingTicket-API

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente (veja a seção abaixo)
cp .env.example .env

# 4. Inicie em modo desenvolvimento
npm run start:dev
```

> A aplicação estará disponível em `http://localhost:3000` por padrão.

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run start:dev` | Inicia com hot-reload |
| `npm run start:prod` | Inicia a build de produção |
| `npm run build` | Compila o projeto |
| `npm run test` | Executa os testes unitários |
| `npm run test:cov` | Executa os testes com relatório de cobertura |

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no exemplo abaixo:

```env
# ─── Aplicação ─────────────────────────────────────────
PORT=3000

# ─── Autenticação JWT ──────────────────────────────────
JWT_SECRET=troque_por_um_segredo_forte_e_aleatorio
JWT_EXPIRES_IN=1d

# ─── AWS S3 ────────────────────────────────────────────
AWS_ACCESS_KEY_ID=3X4MPL30F44CC35T0K3N
AWS_SECRET_ACCESS_KEY=D3V5/4JVD4/QV3M-C3D0/M4D6VG4
AWS_REGION=us-east-1
AWS_BUCKET=fluxovia-tickets-pdf

# ─── SMTP (Nodemailer) ─────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app_aqui
SMTP_FROM="FluxoVia Notificações <seu_email@gmail.com>"
```

> ⚠️ **Nunca** versione o arquivo `.env` real. Certifique-se de que ele está listado no `.gitignore`.

---

## 📡 Endpoints da API

### 🔑 `POST /auth` — Autenticação

Endpoint público. Registra o usuário caso ele não exista, ou valida as credenciais caso já esteja cadastrado. Retorna um **JWT** em ambos os casos.

**Request**
```http
POST /auth
Content-Type: application/json

{
  "email": "sistema@fluxovia.com",
  "password": "senhaSegura123"
}
```

**Response** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Possíveis erros**

| Status | Descrição |
|---|---|
| `400 Bad Request` | Payload inválido (e-mail malformado, senha curta) |
| `401 Unauthorized` | Credenciais incorretas para usuário existente |

---

### 🎫 `POST /tickets` — Emitir Notificação de Infração

Endpoint protegido. Recebe os dados da infração, gera o PDF, salva no S3 e envia o e-mail ao condutor.

**Headers**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request**
```http
POST /tickets
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "proprietario": "Juscelino Kubitschek",
  "placa": "ABC1D23",
  "uf": "SP",
  "velocidade_registrada": 112,
  "limite_permitido": 80,
  "id_aparelho_medidor": "RADAR-SP-0042",
  "email_condutor": "juscelino.kubitschek@ufrpe.br"
}
```

**Response** `201 Created`
```json
{
  "pdfUrl": "https://fluxovia-tickets-pdf.s3.amazonaws.com/tickets/ABC1D23-1715530800000.pdf",
  "message": "Notificação emitida e e-mail enviado com sucesso."
}
```

**Possíveis erros**

| Status | Descrição |
|---|---|
| `400 Bad Request` | Campos obrigatórios ausentes ou inválidos |
| `401 Unauthorized` | Token JWT ausente, expirado ou inválido |
| `500 Internal Server Error` | Falha na geração do PDF, upload S3 ou envio de e-mail |

---

## 🧪 Executando os Testes

```bash
# Testes unitários
npm run test

# Testes com cobertura de código
npm run test:cov

# Testes em modo watch
npm run test:watch
```

---

## 📄 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Desenvolvido pelo time <strong>FluxoVia</strong>
</p>
Serviço independente do ecossistema FluxoVia, responsável por armazenar registros de infrações de trânsito e enviar seu PDF via email para propositos didáticos.
