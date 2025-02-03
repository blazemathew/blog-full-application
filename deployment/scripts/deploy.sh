#!/bin/bash

# Exit on error
set -e

# Load environment variables
source .env

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "Error: AWS credentials not configured. Please configure AWS CLI first."
    exit 1
fi

echo "Starting deployment process..."

# Step 1: Initialize and apply Terraform
echo "Initializing Terraform..."
cd terraform
terraform init
terraform apply -auto-approve

# Get ECR repository URLs
FRONTEND_ECR_URL=$(terraform output -raw frontend_repository_url)
BACKEND_ECR_URL=$(terraform output -raw backend_repository_url)
EKS_CLUSTER_NAME=$(terraform output -raw cluster_name)
AWS_REGION=$(terraform output -raw aws_region)

cd ..

# Step 2: Configure kubectl
echo "Configuring kubectl for EKS cluster..."
aws eks update-kubeconfig --name $EKS_CLUSTER_NAME --region $AWS_REGION

# Step 3: Build and push Docker images
echo "Building and pushing Docker images..."

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $FRONTEND_ECR_URL

# Frontend
echo "Building frontend image..."
docker build -t $FRONTEND_ECR_URL:latest -f docker/frontend/Dockerfile ./frontend
echo "Pushing frontend image..."
docker push $FRONTEND_ECR_URL:latest

# Backend
echo "Building backend image..."
docker build -t $BACKEND_ECR_URL:latest -f docker/backend/Dockerfile ./backend
echo "Pushing backend image..."
docker push $BACKEND_ECR_URL:latest

# Step 4: Deploy Kubernetes resources
echo "Deploying Kubernetes resources..."

# Create namespace if it doesn't exist
kubectl create namespace blog-app --dry-run=client -o yaml | kubectl apply -f -

# Apply common resources
kubectl apply -f k8s/common/

# Replace image placeholders in Kubernetes manifests
sed -i "s|IMAGE_PLACEHOLDER_FRONTEND|$FRONTEND_ECR_URL:latest|g" k8s/frontend/deployment.yaml
sed -i "s|IMAGE_PLACEHOLDER_BACKEND|$BACKEND_ECR_URL:latest|g" k8s/backend/deployment.yaml

# Apply Kubernetes manifests
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/

# Step 5: Wait for deployments to be ready
echo "Waiting for deployments to be ready..."
kubectl wait --namespace blog-app \
  --for=condition=ready pod \
  --selector=app=frontend \
  --timeout=300s

kubectl wait --namespace blog-app \
  --for=condition=ready pod \
  --selector=app=backend \
  --timeout=300s

# Get service URLs
FRONTEND_URL=$(kubectl get service frontend-service -n blog-app -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
BACKEND_URL=$(kubectl get service backend-service -n blog-app -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

echo "Deployment completed successfully!"
echo "Frontend URL: http://$FRONTEND_URL"
echo "Backend URL: http://$BACKEND_URL"