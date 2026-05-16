
resource "aws_security_group" "api_sg" {
  name        = "fluxovia_api_sg"
  description = "Permite trafego HTTP e SSH"

  ingress {
    description = "HTTP web traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # ID oficial da Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }
}

resource "aws_instance" "api_server" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"
  vpc_security_group_ids = [aws_security_group.api_sg.id]

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  user_data = <<-EOF
              #!/bin/bash
              
              # A. Cria o SWAP de 2GB
              fallocate -l 2G /swapfile
              chmod 600 /swapfile
              mkswap /swapfile
              swapon /swapfile
              echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab

              # B. Atualiza o Linux e instala Docker e Git
              apt-get update
              apt-get install -y docker.io git

              # C. Clona o repositório
              cd /home/ubuntu
              git clone ${var.github_repo_url} api
              cd api

              # D. Cria o arquivo .env com as variáveis do Terraform
              cat <<EOT >> .env
              AWS_ACCESS_KEY_ID=${var.aws_access_key_id}
              AWS_SECRET_ACCESS_KEY=${var.aws_secret_access_key}
              AWS_S3_BUCKET_NAME=${var.s3_bucket_name}
              AWS_REGION=${var.aws_region}
              EMAIL_USER=${var.email_user}
              EMAIL_PASS=${var.email_pass}
              EMAIL_HOST=${var.email_host}
              EMAIL_PORT=${var.email_port}
              JWT_SECRET=${var.jwt_secret}
              JWT_EXPIRES_IN=${var.jwt_expires_in}
              EOT

              # E. Constrói a imagem e roda o contêiner
              docker build -t ticket-api .
              docker run -d -p 80:3000 --env-file .env --name api-rodando ticket-api
              EOF

  tags = {
    Name = "FluxoVia-SpeedingTicket-Server"
  }
}
