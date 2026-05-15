output "api_public_ip" {
  description = "O endereço IP público da API"
  value       = aws_instance.api_server.public_ip
}

output "api_url" {
  description = "URL pronta para teste"
  value       = "http://${aws_instance.api_server.public_ip}/auth"
}
