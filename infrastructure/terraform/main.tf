# Gentle Reminder - AWS Infrastructure
#
# All resources are commented out so this file serves as a complete,
# ready-to-uncomment blueprint. Remove the comment markers and fill
# in variable values to provision the full stack.

# terraform {
#   required_version = ">= 1.5"
#
#   required_providers {
#     aws = {
#       source  = "hashicorp/aws"
#       version = "~> 5.0"
#     }
#   }
#
#   backend "s3" {
#     bucket         = "gentle-reminder-terraform-state"
#     key            = "infrastructure/terraform.tfstate"
#     region         = "us-west-2"
#     encrypt        = true
#     dynamodb_table = "gentle-reminder-terraform-lock"
#   }
# }

# provider "aws" {
#   region = var.aws_region
#
#   default_tags {
#     tags = {
#       Project     = "gentle-reminder"
#       Environment = var.environment
#       ManagedBy   = "terraform"
#     }
#   }
# }

# data "aws_availability_zones" "available" {
#   state = "available"
# }

# ---------------------------------------------------------------------------
# KMS - Encryption key for all data-at-rest
# ---------------------------------------------------------------------------

# resource "aws_kms_key" "main" {
#   description             = "Gentle Reminder encryption key"
#   deletion_window_in_days = 30
#   enable_key_rotation     = true
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-kms"
#   }
# }
#
# resource "aws_kms_alias" "main" {
#   name          = "alias/${var.project_name}-${var.environment}"
#   target_key_id = aws_kms_key.main.key_id
# }

# ---------------------------------------------------------------------------
# VPC - Networking
# ---------------------------------------------------------------------------

# resource "aws_vpc" "main" {
#   cidr_block           = var.vpc_cidr
#   enable_dns_hostnames = true
#   enable_dns_support   = true
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-vpc"
#   }
# }
#
# resource "aws_internet_gateway" "main" {
#   vpc_id = aws_vpc.main.id
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-igw"
#   }
# }
#
# resource "aws_subnet" "public" {
#   count                   = 2
#   vpc_id                  = aws_vpc.main.id
#   cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
#   availability_zone       = data.aws_availability_zones.available.names[count.index]
#   map_public_ip_on_launch = true
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-public-${count.index}"
#     Tier = "public"
#   }
# }
#
# resource "aws_subnet" "private" {
#   count             = 2
#   vpc_id            = aws_vpc.main.id
#   cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 10)
#   availability_zone = data.aws_availability_zones.available.names[count.index]
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-private-${count.index}"
#     Tier = "private"
#   }
# }
#
# resource "aws_eip" "nat" {
#   count  = 1
#   domain = "vpc"
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-nat-eip"
#   }
# }
#
# resource "aws_nat_gateway" "main" {
#   allocation_id = aws_eip.nat[0].id
#   subnet_id     = aws_subnet.public[0].id
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-nat"
#   }
#
#   depends_on = [aws_internet_gateway.main]
# }
#
# resource "aws_route_table" "public" {
#   vpc_id = aws_vpc.main.id
#
#   route {
#     cidr_block = "0.0.0.0/0"
#     gateway_id = aws_internet_gateway.main.id
#   }
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-public-rt"
#   }
# }
#
# resource "aws_route_table" "private" {
#   vpc_id = aws_vpc.main.id
#
#   route {
#     cidr_block     = "0.0.0.0/0"
#     nat_gateway_id = aws_nat_gateway.main.id
#   }
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-private-rt"
#   }
# }
#
# resource "aws_route_table_association" "public" {
#   count          = 2
#   subnet_id      = aws_subnet.public[count.index].id
#   route_table_id = aws_route_table.public.id
# }
#
# resource "aws_route_table_association" "private" {
#   count          = 2
#   subnet_id      = aws_subnet.private[count.index].id
#   route_table_id = aws_route_table.private.id
# }

# ---------------------------------------------------------------------------
# Security Groups
# ---------------------------------------------------------------------------

# resource "aws_security_group" "alb" {
#   name_prefix = "${var.project_name}-${var.environment}-alb-"
#   vpc_id      = aws_vpc.main.id
#   description = "ALB security group"
#
#   ingress {
#     from_port   = 443
#     to_port     = 443
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#     description = "HTTPS"
#   }
#
#   ingress {
#     from_port   = 80
#     to_port     = 80
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#     description = "HTTP (redirect to HTTPS)"
#   }
#
#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-alb-sg"
#   }
# }
#
# resource "aws_security_group" "ecs" {
#   name_prefix = "${var.project_name}-${var.environment}-ecs-"
#   vpc_id      = aws_vpc.main.id
#   description = "ECS tasks security group"
#
#   ingress {
#     from_port       = 0
#     to_port         = 0
#     protocol        = "-1"
#     security_groups = [aws_security_group.alb.id]
#     description     = "From ALB"
#   }
#
#   ingress {
#     from_port = 0
#     to_port   = 0
#     protocol  = "-1"
#     self      = true
#     description = "Inter-service communication"
#   }
#
#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-ecs-sg"
#   }
# }
#
# resource "aws_security_group" "rds" {
#   name_prefix = "${var.project_name}-${var.environment}-rds-"
#   vpc_id      = aws_vpc.main.id
#   description = "RDS security group"
#
#   ingress {
#     from_port       = 5432
#     to_port         = 5432
#     protocol        = "tcp"
#     security_groups = [aws_security_group.ecs.id]
#     description     = "PostgreSQL from ECS"
#   }
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-rds-sg"
#   }
# }

# ---------------------------------------------------------------------------
# RDS PostgreSQL (encrypted, multi-AZ)
# ---------------------------------------------------------------------------

# resource "aws_db_subnet_group" "main" {
#   name       = "${var.project_name}-${var.environment}-db-subnet"
#   subnet_ids = aws_subnet.private[*].id
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-db-subnet"
#   }
# }
#
# resource "aws_db_instance" "postgres" {
#   identifier = "${var.project_name}-${var.environment}-postgres"
#
#   engine         = "postgres"
#   engine_version = "16.3"
#   instance_class = var.db_instance_class
#
#   allocated_storage     = 20
#   max_allocated_storage = 100
#   storage_type          = "gp3"
#   storage_encrypted     = true
#   kms_key_id            = aws_kms_key.main.arn
#
#   db_name  = "gentle_reminder"
#   username = var.db_username
#   password = var.db_password
#
#   multi_az               = var.environment == "production"
#   db_subnet_group_name   = aws_db_subnet_group.main.name
#   vpc_security_group_ids = [aws_security_group.rds.id]
#
#   backup_retention_period = 7
#   backup_window           = "03:00-04:00"
#   maintenance_window      = "Mon:04:00-Mon:05:00"
#
#   deletion_protection       = var.environment == "production"
#   skip_final_snapshot       = var.environment != "production"
#   final_snapshot_identifier = var.environment == "production" ? "${var.project_name}-${var.environment}-final-snapshot" : null
#
#   performance_insights_enabled    = true
#   performance_insights_kms_key_id = aws_kms_key.main.arn
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-postgres"
#   }
# }

# ---------------------------------------------------------------------------
# ECS Fargate Cluster
# ---------------------------------------------------------------------------

# resource "aws_ecs_cluster" "main" {
#   name = "${var.project_name}-${var.environment}"
#
#   setting {
#     name  = "containerInsights"
#     value = "enabled"
#   }
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-cluster"
#   }
# }
#
# resource "aws_ecs_cluster_capacity_providers" "main" {
#   cluster_name       = aws_ecs_cluster.main.name
#   capacity_providers = ["FARGATE", "FARGATE_SPOT"]
#
#   default_capacity_provider_strategy {
#     capacity_provider = "FARGATE"
#     weight            = 1
#     base              = 1
#   }
# }

# ---------------------------------------------------------------------------
# ECS Task Execution Role
# ---------------------------------------------------------------------------

# resource "aws_iam_role" "ecs_execution" {
#   name = "${var.project_name}-${var.environment}-ecs-execution"
#
#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [{
#       Action    = "sts:AssumeRole"
#       Effect    = "Allow"
#       Principal = { Service = "ecs-tasks.amazonaws.com" }
#     }]
#   })
# }
#
# resource "aws_iam_role_policy_attachment" "ecs_execution" {
#   role       = aws_iam_role.ecs_execution.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
# }
#
# resource "aws_iam_role" "ecs_task" {
#   name = "${var.project_name}-${var.environment}-ecs-task"
#
#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [{
#       Action    = "sts:AssumeRole"
#       Effect    = "Allow"
#       Principal = { Service = "ecs-tasks.amazonaws.com" }
#     }]
#   })
# }
#
# resource "aws_iam_role_policy" "ecs_task_s3" {
#   name = "${var.project_name}-${var.environment}-ecs-task-s3"
#   role = aws_iam_role.ecs_task.id
#
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [{
#       Effect   = "Allow"
#       Action   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
#       Resource = "${aws_s3_bucket.media.arn}/*"
#     }]
#   })
# }

# ---------------------------------------------------------------------------
# ECS Task Definitions & Services
# ---------------------------------------------------------------------------

# resource "aws_ecs_task_definition" "api" {
#   family                   = "${var.project_name}-${var.environment}-api"
#   requires_compatibilities = ["FARGATE"]
#   network_mode             = "awsvpc"
#   cpu                      = 512
#   memory                   = 1024
#   execution_role_arn       = aws_iam_role.ecs_execution.arn
#   task_role_arn            = aws_iam_role.ecs_task.arn
#
#   container_definitions = jsonencode([{
#     name      = "api"
#     image     = "${var.ecr_repository_url}/api:latest"
#     essential = true
#
#     portMappings = [{
#       containerPort = 3000
#       protocol      = "tcp"
#     }]
#
#     environment = [
#       { name = "NODE_ENV", value = "production" },
#       { name = "LOG_LEVEL", value = "info" },
#     ]
#
#     secrets = [
#       { name = "DATABASE_URL", valueFrom = "${aws_secretsmanager_secret.app.arn}:DATABASE_URL::" },
#       { name = "JWT_SECRET", valueFrom = "${aws_secretsmanager_secret.app.arn}:JWT_SECRET::" },
#     ]
#
#     healthCheck = {
#       command     = ["CMD-SHELL", "wget -qO- http://localhost:3000/health || exit 1"]
#       interval    = 15
#       timeout     = 5
#       retries     = 3
#       startPeriod = 30
#     }
#
#     logConfiguration = {
#       logDriver = "awslogs"
#       options = {
#         "awslogs-group"         = aws_cloudwatch_log_group.api.name
#         "awslogs-region"        = var.aws_region
#         "awslogs-stream-prefix" = "api"
#       }
#     }
#   }])
# }
#
# resource "aws_ecs_service" "api" {
#   name            = "${var.project_name}-${var.environment}-api"
#   cluster         = aws_ecs_cluster.main.id
#   task_definition = aws_ecs_task_definition.api.arn
#   desired_count   = 2
#   launch_type     = "FARGATE"
#
#   network_configuration {
#     subnets          = aws_subnet.private[*].id
#     security_groups  = [aws_security_group.ecs.id]
#     assign_public_ip = false
#   }
#
#   load_balancer {
#     target_group_arn = aws_lb_target_group.api.arn
#     container_name   = "api"
#     container_port   = 3000
#   }
#
#   deployment_circuit_breaker {
#     enable   = true
#     rollback = true
#   }
#
#   depends_on = [aws_lb_listener.https]
# }
#
# resource "aws_ecs_task_definition" "ai" {
#   family                   = "${var.project_name}-${var.environment}-ai"
#   requires_compatibilities = ["FARGATE"]
#   network_mode             = "awsvpc"
#   cpu                      = 1024
#   memory                   = 2048
#   execution_role_arn       = aws_iam_role.ecs_execution.arn
#   task_role_arn            = aws_iam_role.ecs_task.arn
#
#   container_definitions = jsonencode([{
#     name      = "ai"
#     image     = "${var.ecr_repository_url}/ai:latest"
#     essential = true
#
#     portMappings = [{
#       containerPort = 8000
#       protocol      = "tcp"
#     }]
#
#     healthCheck = {
#       command     = ["CMD-SHELL", "wget -qO- http://localhost:8000/health || exit 1"]
#       interval    = 30
#       timeout     = 10
#       retries     = 3
#       startPeriod = 60
#     }
#
#     logConfiguration = {
#       logDriver = "awslogs"
#       options = {
#         "awslogs-group"         = aws_cloudwatch_log_group.ai.name
#         "awslogs-region"        = var.aws_region
#         "awslogs-stream-prefix" = "ai"
#       }
#     }
#   }])
# }
#
# resource "aws_ecs_service" "ai" {
#   name            = "${var.project_name}-${var.environment}-ai"
#   cluster         = aws_ecs_cluster.main.id
#   task_definition = aws_ecs_task_definition.ai.arn
#   desired_count   = 1
#   launch_type     = "FARGATE"
#
#   network_configuration {
#     subnets          = aws_subnet.private[*].id
#     security_groups  = [aws_security_group.ecs.id]
#     assign_public_ip = false
#   }
#
#   load_balancer {
#     target_group_arn = aws_lb_target_group.ai.arn
#     container_name   = "ai"
#     container_port   = 8000
#   }
#
#   deployment_circuit_breaker {
#     enable   = true
#     rollback = true
#   }
#
#   depends_on = [aws_lb_listener.https]
# }

# ---------------------------------------------------------------------------
# Application Load Balancer
# ---------------------------------------------------------------------------

# resource "aws_lb" "main" {
#   name               = "${var.project_name}-${var.environment}-alb"
#   internal           = false
#   load_balancer_type = "application"
#   security_groups    = [aws_security_group.alb.id]
#   subnets            = aws_subnet.public[*].id
#
#   enable_deletion_protection = var.environment == "production"
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-alb"
#   }
# }
#
# resource "aws_lb_listener" "http" {
#   load_balancer_arn = aws_lb.main.arn
#   port              = 80
#   protocol          = "HTTP"
#
#   default_action {
#     type = "redirect"
#     redirect {
#       port        = "443"
#       protocol    = "HTTPS"
#       status_code = "HTTP_301"
#     }
#   }
# }
#
# resource "aws_lb_listener" "https" {
#   load_balancer_arn = aws_lb.main.arn
#   port              = 443
#   protocol          = "HTTPS"
#   ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
#   certificate_arn   = var.acm_certificate_arn
#
#   default_action {
#     type = "fixed-response"
#     fixed_response {
#       content_type = "application/json"
#       message_body = "{\"error\":\"not_found\"}"
#       status_code  = "404"
#     }
#   }
# }
#
# resource "aws_lb_target_group" "api" {
#   name        = "${var.project_name}-${var.environment}-api-tg"
#   port        = 3000
#   protocol    = "HTTP"
#   vpc_id      = aws_vpc.main.id
#   target_type = "ip"
#
#   health_check {
#     path                = "/health"
#     healthy_threshold   = 2
#     unhealthy_threshold = 3
#     interval            = 15
#     timeout             = 5
#   }
# }
#
# resource "aws_lb_target_group" "ai" {
#   name        = "${var.project_name}-${var.environment}-ai-tg"
#   port        = 8000
#   protocol    = "HTTP"
#   vpc_id      = aws_vpc.main.id
#   target_type = "ip"
#
#   health_check {
#     path                = "/health"
#     healthy_threshold   = 2
#     unhealthy_threshold = 3
#     interval            = 30
#     timeout             = 10
#   }
# }
#
# resource "aws_lb_listener_rule" "api" {
#   listener_arn = aws_lb_listener.https.arn
#   priority     = 100
#
#   action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.api.arn
#   }
#
#   condition {
#     host_header {
#       values = ["api.gentlereminder.health"]
#     }
#   }
# }
#
# resource "aws_lb_listener_rule" "ai" {
#   listener_arn = aws_lb_listener.https.arn
#   priority     = 200
#
#   action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.ai.arn
#   }
#
#   condition {
#     host_header {
#       values = ["ai.gentlereminder.health"]
#     }
#   }
# }

# ---------------------------------------------------------------------------
# S3 - Media storage (encrypted, versioned)
# ---------------------------------------------------------------------------

# resource "aws_s3_bucket" "media" {
#   bucket = "${var.project_name}-${var.environment}-media"
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-media"
#   }
# }
#
# resource "aws_s3_bucket_versioning" "media" {
#   bucket = aws_s3_bucket.media.id
#   versioning_configuration {
#     status = "Enabled"
#   }
# }
#
# resource "aws_s3_bucket_server_side_encryption_configuration" "media" {
#   bucket = aws_s3_bucket.media.id
#
#   rule {
#     apply_server_side_encryption_by_default {
#       sse_algorithm     = "aws:kms"
#       kms_master_key_id = aws_kms_key.main.arn
#     }
#     bucket_key_enabled = true
#   }
# }
#
# resource "aws_s3_bucket_public_access_block" "media" {
#   bucket                  = aws_s3_bucket.media.id
#   block_public_acls       = true
#   block_public_policy     = true
#   ignore_public_acls      = true
#   restrict_public_buckets = true
# }
#
# resource "aws_s3_bucket_lifecycle_configuration" "media" {
#   bucket = aws_s3_bucket.media.id
#
#   rule {
#     id     = "transition-to-ia"
#     status = "Enabled"
#
#     transition {
#       days          = 90
#       storage_class = "STANDARD_IA"
#     }
#
#     noncurrent_version_expiration {
#       noncurrent_days = 30
#     }
#   }
# }

# ---------------------------------------------------------------------------
# CloudFront Distribution
# ---------------------------------------------------------------------------

# resource "aws_cloudfront_origin_access_identity" "media" {
#   comment = "${var.project_name}-${var.environment} media OAI"
# }
#
# resource "aws_s3_bucket_policy" "media_cloudfront" {
#   bucket = aws_s3_bucket.media.id
#
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [{
#       Sid       = "AllowCloudFront"
#       Effect    = "Allow"
#       Principal = { AWS = aws_cloudfront_origin_access_identity.media.iam_arn }
#       Action    = "s3:GetObject"
#       Resource  = "${aws_s3_bucket.media.arn}/*"
#     }]
#   })
# }
#
# resource "aws_cloudfront_distribution" "media" {
#   enabled             = true
#   is_ipv6_enabled     = true
#   default_root_object = ""
#   price_class         = "PriceClass_100"
#   comment             = "${var.project_name}-${var.environment} media CDN"
#
#   origin {
#     domain_name = aws_s3_bucket.media.bucket_regional_domain_name
#     origin_id   = "s3-media"
#
#     s3_origin_config {
#       origin_access_identity = aws_cloudfront_origin_access_identity.media.cloudfront_access_identity_path
#     }
#   }
#
#   default_cache_behavior {
#     allowed_methods        = ["GET", "HEAD", "OPTIONS"]
#     cached_methods         = ["GET", "HEAD"]
#     target_origin_id       = "s3-media"
#     viewer_protocol_policy = "redirect-to-https"
#     compress               = true
#
#     forwarded_values {
#       query_string = false
#       cookies {
#         forward = "none"
#       }
#     }
#
#     min_ttl     = 0
#     default_ttl = 86400
#     max_ttl     = 31536000
#   }
#
#   restrictions {
#     geo_restriction {
#       restriction_type = "none"
#     }
#   }
#
#   viewer_certificate {
#     cloudfront_default_certificate = true
#     # For custom domain, use:
#     # acm_certificate_arn      = var.cloudfront_certificate_arn
#     # ssl_support_method       = "sni-only"
#     # minimum_protocol_version = "TLSv1.2_2021"
#   }
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-cdn"
#   }
# }

# ---------------------------------------------------------------------------
# Secrets Manager
# ---------------------------------------------------------------------------

# resource "aws_secretsmanager_secret" "app" {
#   name       = "${var.project_name}/${var.environment}/app"
#   kms_key_id = aws_kms_key.main.arn
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-app-secrets"
#   }
# }

# ---------------------------------------------------------------------------
# CloudWatch Log Groups
# ---------------------------------------------------------------------------

# resource "aws_cloudwatch_log_group" "api" {
#   name              = "/ecs/${var.project_name}-${var.environment}/api"
#   retention_in_days = var.log_retention_days
#   kms_key_id        = aws_kms_key.main.arn
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-api-logs"
#   }
# }
#
# resource "aws_cloudwatch_log_group" "ai" {
#   name              = "/ecs/${var.project_name}-${var.environment}/ai"
#   retention_in_days = var.log_retention_days
#   kms_key_id        = aws_kms_key.main.arn
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-ai-logs"
#   }
# }
#
# resource "aws_cloudwatch_log_group" "memory_graph" {
#   name              = "/ecs/${var.project_name}-${var.environment}/memory-graph"
#   retention_in_days = var.log_retention_days
#   kms_key_id        = aws_kms_key.main.arn
#
#   tags = {
#     Name = "${var.project_name}-${var.environment}-memory-graph-logs"
#   }
# }

# ---------------------------------------------------------------------------
# Auto Scaling for ECS
# ---------------------------------------------------------------------------

# resource "aws_appautoscaling_target" "api" {
#   max_capacity       = 10
#   min_capacity       = 2
#   resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.api.name}"
#   scalable_dimension = "ecs:service:DesiredCount"
#   service_namespace  = "ecs"
# }
#
# resource "aws_appautoscaling_policy" "api_cpu" {
#   name               = "${var.project_name}-${var.environment}-api-cpu-scaling"
#   policy_type        = "TargetTrackingScaling"
#   resource_id        = aws_appautoscaling_target.api.resource_id
#   scalable_dimension = aws_appautoscaling_target.api.scalable_dimension
#   service_namespace  = aws_appautoscaling_target.api.service_namespace
#
#   target_tracking_scaling_policy_configuration {
#     predefined_metric_specification {
#       predefined_metric_type = "ECSServiceAverageCPUUtilization"
#     }
#     target_value       = 70.0
#     scale_in_cooldown  = 300
#     scale_out_cooldown = 60
#   }
# }
