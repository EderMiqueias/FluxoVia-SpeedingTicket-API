variable "s3_bucket_name" {
  description = "Nome do bucket S3 para armazenar os tickets"
  type        = string
}

variable "environment" {
  description = "Ambiente de implantação (ex: dev, staging, prod)"
  type = string
}

variable "enable_versioning" {
  description = "Habilitar versionamento no bucket S3"
  type        = bool
  default     = true
}
