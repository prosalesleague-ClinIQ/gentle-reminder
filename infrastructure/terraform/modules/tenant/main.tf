###############################################################################
# Terraform Module — Per-tenant AWS resources
#
# Provisions isolated AWS resources for each hospital tenant:
#   - S3 bucket for media/backups (encrypted, versioned)
#   - IAM role with scoped permissions (assumable by EKS pods)
#   - S3 bucket policy restricting access to the tenant IAM role
###############################################################################

terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

# ── Variables ──────────────────────────────────────────────────

variable "tenant_slug" {
  description = "URL-safe slug for the tenant (e.g. mayo-clinic)"
  type        = string

  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$", var.tenant_slug))
    error_message = "tenant_slug must be lowercase alphanumeric with hyphens, 3-63 chars."
  }
}

variable "tenant_name" {
  description = "Human-readable tenant name"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g. production, staging)"
  type        = string
  default     = "production"
}

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "eks_cluster_oidc_issuer" {
  description = "OIDC issuer URL for the EKS cluster (for IAM role trust policy)"
  type        = string
}

variable "eks_namespace" {
  description = "Kubernetes namespace for this tenant"
  type        = string
  default     = ""
}

variable "backup_retention_days" {
  description = "Number of days to retain old object versions in S3"
  type        = number
  default     = 90
}

variable "tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}

# ── Locals ─────────────────────────────────────────────────────

locals {
  bucket_name   = "gentle-reminder-${var.environment}-${var.tenant_slug}"
  role_name     = "gentle-reminder-${var.environment}-${var.tenant_slug}"
  namespace     = var.eks_namespace != "" ? var.eks_namespace : "tenant-${var.tenant_slug}"
  oidc_provider = replace(var.eks_cluster_oidc_issuer, "https://", "")

  common_tags = merge(var.tags, {
    Project     = "gentle-reminder"
    Tenant      = var.tenant_slug
    Environment = var.environment
    ManagedBy   = "terraform"
  })
}

# ── Data Sources ───────────────────────────────────────────────

data "aws_caller_identity" "current" {}

# ── S3 Bucket ──────────────────────────────────────────────────

resource "aws_s3_bucket" "tenant" {
  bucket = local.bucket_name
  tags   = local.common_tags
}

resource "aws_s3_bucket_versioning" "tenant" {
  bucket = aws_s3_bucket.tenant.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "tenant" {
  bucket = aws_s3_bucket.tenant.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "tenant" {
  bucket = aws_s3_bucket.tenant.id

  rule {
    id     = "cleanup-old-versions"
    status = "Enabled"

    noncurrent_version_expiration {
      noncurrent_days = var.backup_retention_days
    }

    # Move infrequent access objects to cheaper storage
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }
  }

  rule {
    id     = "abort-incomplete-uploads"
    status = "Enabled"

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

resource "aws_s3_bucket_public_access_block" "tenant" {
  bucket = aws_s3_bucket.tenant.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ── IAM Role (IRSA — IAM Roles for Service Accounts) ──────────

resource "aws_iam_role" "tenant" {
  name = local.role_name
  tags = local.common_tags

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/${local.oidc_provider}"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${local.oidc_provider}:sub" = "system:serviceaccount:${local.namespace}:gentle-reminder-api"
            "${local.oidc_provider}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "tenant_s3" {
  name = "${local.role_name}-s3"
  role = aws_iam_role.tenant.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowBucketListing"
        Effect = "Allow"
        Action = [
          "s3:ListBucket",
          "s3:GetBucketLocation",
        ]
        Resource = aws_s3_bucket.tenant.arn
      },
      {
        Sid    = "AllowObjectOperations"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:GetObjectVersion",
        ]
        Resource = "${aws_s3_bucket.tenant.arn}/*"
      },
    ]
  })
}

# ── S3 Bucket Policy ──────────────────────────────────────────

resource "aws_s3_bucket_policy" "tenant" {
  bucket = aws_s3_bucket.tenant.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "DenyUnencryptedUploads"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.tenant.arn}/*"
        Condition = {
          StringNotEquals = {
            "s3:x-amz-server-side-encryption" = "aws:kms"
          }
        }
      },
      {
        Sid       = "RestrictToTenantRole"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.tenant.arn,
          "${aws_s3_bucket.tenant.arn}/*",
        ]
        Condition = {
          StringNotLike = {
            "aws:PrincipalArn" = [
              aws_iam_role.tenant.arn,
              "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root",
            ]
          }
        }
      }
    ]
  })
}

# ── Outputs ────────────────────────────────────────────────────

output "s3_bucket_name" {
  description = "Name of the tenant S3 bucket"
  value       = aws_s3_bucket.tenant.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the tenant S3 bucket"
  value       = aws_s3_bucket.tenant.arn
}

output "iam_role_arn" {
  description = "ARN of the tenant IAM role (for K8s service account annotation)"
  value       = aws_iam_role.tenant.arn
}

output "iam_role_name" {
  description = "Name of the tenant IAM role"
  value       = aws_iam_role.tenant.name
}

output "kubernetes_namespace" {
  description = "Kubernetes namespace for this tenant"
  value       = local.namespace
}
