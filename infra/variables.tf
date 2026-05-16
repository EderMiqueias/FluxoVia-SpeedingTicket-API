variable "s3_bucket_name" {
  description = "Nome do bucket S3 para armazenar os tickets"
  type        = string
}

variable "environment" {
  description = "Ambiente de implantação (ex: dev, staging, prod)"
  type        = string
}

variable "enable_versioning" {
  description = "Habilitar versionamento no bucket S3"
  type        = bool
  default     = true
}

variable "aws_region" {
  description = "Região AWS para deployment dos recursos"
  type        = string
  default     = "us-east-1"
}

variable "github_repo_url" {
  description = "A URL do repositório no GitHub"
  type        = string
  default     = "https://github.com/EderMiqueias/FluxoVia-SpeedingTicket-API"
}

variable "aws_access_key_id" {
  description = "Chave de acesso AWS"
  type        = string
  sensitive   = true
}

variable "aws_secret_access_key" {
  description = "Chave secreta AWS"
  type        = string
  sensitive   = true
}

variable "email_host" {
  description = "Host SMTP para envio de emails"
  type        = string
  sensitive   = true
}

variable "email_port" {
  description = "Porta SMTP para envio de emails"
  type        = string
  sensitive   = true
}

variable "email_user" {
  description = "Usuário SMTP para envio de emails"
  type        = string
  sensitive   = true
}

variable "email_pass" {
  description = "Senha SMTP para envio de emails"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "Chave secreta para assinatura de tokens JWT"
  type        = string
  sensitive   = true
}

variable "jwt_expires_in" {
  description = "Tempo de expiração do token JWT"
  type        = string
  default     = "30d"
}
