resource "aws_s3_bucket" "tickets" {
  bucket = var.s3_bucket_name

  tags = {
    Name        = var.s3_bucket_name
    Environment = var.environment
    Service     = "aws-s3-service"
  }
}

resource "aws_s3_bucket_versioning" "tickets" {
  bucket = aws_s3_bucket.tickets.id

  versioning_configuration {
    status = var.enable_versioning ? "Enabled" : "Suspended"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "tickets" {
  bucket = aws_s3_bucket.tickets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "tickets" {
  bucket = aws_s3_bucket.tickets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

output "s3_bucket_name" {
  description = "Nome do bucket S3 de tickets"
  value       = aws_s3_bucket.tickets.id
}

output "s3_bucket_arn" {
  description = "ARN do bucket S3 de tickets"
  value       = aws_s3_bucket.tickets.arn
}
