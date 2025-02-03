#!/bin/bash

set -e

# Load environment variables
source .env

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "Error: AWS credentials not configured"
    exit 1
fi

# Get ECR repository URLs from Terraform output
cd terraform
FRONTEND_ECR_URL=$(terraform output -raw frontend_repository_url)
BACKEND_ECR_URL=$(terraform output -raw backend_repository_url)
AWS_REGION=$(terraform output -raw aws_region)
cd ..

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $FRONTEND_ECR_URL

# Build and push frontend
echo "Building frontend image..."
docker build -t $FRONTEND_ECR_URL:latest \
  -t $FRONTEND_ECR_URL:$(git rev-parse --short HEAD) \
  -f docker/frontend/Dockerfile ./frontend

echo "Pushing frontend image..."
docker push $FRONTEND_ECR_URL:latest
docker push $FRONTEND_ECR_URL:$(git rev-parse --short HEAD)

# Build and push backend
echo "Building backend image..."
docker build -t $BACKEND_ECR_URL:latest \
  -t $BACKEND_ECR_URL:$(git rev-parse --short HEAD) \
  -f docker/backend/Dockerfile ./backend

echo "Pushing backend image..."
docker push $BACKEND_ECR_URL:latest
docker push $BACKEND_ECR_URL:$(git rev-parse --short HEAD)

echo "Successfully built and pushed all images!"