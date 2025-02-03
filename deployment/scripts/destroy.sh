#!/bin/bash

set -e

echo "Starting cleanup process..."

# Load environment variables
source .env

# Get cluster name from Terraform output
cd terraform
EKS_CLUSTER_NAME=$(terraform output -raw cluster_name)
AWS_REGION=$(terraform output -raw aws_region)
cd ..

# Configure kubectl
aws eks update-kubeconfig --name $EKS_CLUSTER_NAME --region $AWS_REGION

# Delete Kubernetes resources
echo "Deleting Kubernetes resources..."
kubectl delete -f k8s/frontend/ --ignore-not-found
kubectl delete -f k8s/backend/ --ignore-not-found
kubectl delete -f k8s/common/ --ignore-not-found
kubectl delete namespace blog-app --ignore-not-found

# Destroy Terraform infrastructure
echo "Destroying Terraform infrastructure..."
cd terraform
terraform destroy -auto-approve

echo "Cleanup completed successfully!"