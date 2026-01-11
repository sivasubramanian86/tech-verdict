terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "tech-verdict-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "tech-verdict-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Application = "tech-verdict"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "function_memory" {
  description = "Lambda function memory in MB"
  type        = number
  default     = 512
}

variable "function_timeout" {
  description = "Lambda function timeout in seconds"
  type        = number
  default     = 30
}

# Lambda execution role
resource "aws_iam_role" "lambda_role" {
  name = "tech-verdict-lambda-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Lambda basic execution policy
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Bedrock policy
resource "aws_iam_role_policy" "bedrock_policy" {
  name = "tech-verdict-bedrock-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel"
        ]
        Resource = "arn:aws:bedrock:${var.aws_region}::model/anthropic.claude-3-sonnet-20240229-v1:0"
      }
    ]
  })
}

# Lambda function
resource "aws_lambda_function" "tech_verdict" {
  filename      = "lambda_function.zip"
  function_name = "tech-verdict-${var.environment}"
  role          = aws_iam_role.lambda_role.arn
  handler       = "dist/api.default"
  runtime       = "nodejs18.x"
  timeout       = var.function_timeout
  memory_size   = var.function_memory

  environment {
    variables = {
      BEDROCK_MODEL_ID = "claude-3-sonnet-20240229"
      NODE_ENV         = var.environment
    }
  }

  source_code_hash = filebase64sha256("lambda_function.zip")
}

# API Gateway
resource "aws_apigatewayv2_api" "tech_verdict" {
  name          = "tech-verdict-${var.environment}"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
  }
}

# API Gateway stage
resource "aws_apigatewayv2_stage" "tech_verdict" {
  api_id      = aws_apigatewayv2_api.tech_verdict.id
  name        = var.environment
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_logs.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      resourcePath   = "$context.resourcePath"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
      integrationLatency = "$context.integration.latency"
    })
  }
}

# CloudWatch log group for API
resource "aws_cloudwatch_log_group" "api_logs" {
  name              = "/aws/apigateway/tech-verdict-${var.environment}"
  retention_in_days = 30
}

# CloudWatch log group for Lambda
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/tech-verdict-${var.environment}"
  retention_in_days = 30
}

# Outputs
output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = "${aws_apigatewayv2_api.tech_verdict.api_endpoint}/${var.environment}"
}

output "lambda_function_arn" {
  description = "Lambda function ARN"
  value       = aws_lambda_function.tech_verdict.arn
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.tech_verdict.function_name
}
