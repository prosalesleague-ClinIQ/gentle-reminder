# ---------------------------------------------------------------------------
# Outputs
# ---------------------------------------------------------------------------
# Uncomment these outputs when the corresponding resources are enabled.

# output "vpc_id" {
#   description = "VPC ID"
#   value       = aws_vpc.main.id
# }

# output "rds_endpoint" {
#   description = "RDS PostgreSQL endpoint"
#   value       = aws_db_instance.postgres.endpoint
# }

# output "rds_port" {
#   description = "RDS PostgreSQL port"
#   value       = aws_db_instance.postgres.port
# }

# output "s3_media_bucket" {
#   description = "S3 media bucket name"
#   value       = aws_s3_bucket.media.id
# }

# output "s3_media_bucket_arn" {
#   description = "S3 media bucket ARN"
#   value       = aws_s3_bucket.media.arn
# }

# output "cloudfront_distribution_domain" {
#   description = "CloudFront distribution domain name for media CDN"
#   value       = aws_cloudfront_distribution.media.domain_name
# }

# output "cloudfront_distribution_id" {
#   description = "CloudFront distribution ID"
#   value       = aws_cloudfront_distribution.media.id
# }

# output "alb_dns_name" {
#   description = "Application Load Balancer DNS name"
#   value       = aws_lb.main.dns_name
# }

# output "alb_zone_id" {
#   description = "ALB hosted zone ID (for Route53 alias records)"
#   value       = aws_lb.main.zone_id
# }

# output "ecs_cluster_name" {
#   description = "ECS cluster name"
#   value       = aws_ecs_cluster.main.name
# }

# output "ecs_cluster_arn" {
#   description = "ECS cluster ARN"
#   value       = aws_ecs_cluster.main.arn
# }

# output "kms_key_arn" {
#   description = "KMS key ARN used for encryption"
#   value       = aws_kms_key.main.arn
# }

# output "api_log_group" {
#   description = "CloudWatch log group for API service"
#   value       = aws_cloudwatch_log_group.api.name
# }

# output "ai_log_group" {
#   description = "CloudWatch log group for AI service"
#   value       = aws_cloudwatch_log_group.ai.name
# }
