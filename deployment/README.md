# Blog Application Deployment Guide

This repository contains the complete deployment configuration for the Blog Application, including Docker containers, Kubernetes manifests, and Terraform infrastructure as code.

## 🏗️ Infrastructure Overview

The deployment stack includes:

- Docker containerization for frontend and backend
- Kubernetes (EKS) orchestration
- AWS infrastructure managed by Terraform
- CI/CD deployment scripts

### AWS Resources Created:
- VPC with public and private subnets
- EKS cluster
- ECR repositories
- NAT Gateways
- Load Balancers
- IAM roles and policies

## 🚀 Prerequisites

- AWS CLI configured with appropriate permissions
- Terraform (v1.0+)
- kubectl
- Docker
- Bash shell

## 📁 Repository Structure

```
deployment/
├── docker/
│   ├── backend.Dockerfile
│   └── frontend.Dockerfile
├── k8s/
│   ├── backend/
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   ├── common/
│   │   ├── namespace.yaml
│   │   ├── configmap.yaml
│   │   └── secrets.yaml
│   └── frontend/
│       ├── deployment.yaml
│       └── service.yaml
├── scripts/
│   ├── build-and-push.sh
│   ├── deploy.sh
│   └── destroy.sh
├── terraform/
│   ├── modules/
│   │   ├── ecr/
│   │   ├── eks/
│   │   └── vpc/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
└── .env.template
```

## 🛠️ Setup Instructions

### 1. Environment Configuration

1. Copy the environment template:
```bash
cp .env.template .env
```

2. Update the `.env` file with your values:
```env
AWS_REGION=us-west-2
AWS_PROFILE=default
ENVIRONMENT=dev
PROJECT_NAME=blog-app
...
```

### 2. Infrastructure Deployment

1. Initialize Terraform:
```bash
cd terraform
terraform init
```

2. Apply Terraform configuration:
```bash
terraform apply
```

### 3. Container Build and Push

Run the build and push script:
```bash
./scripts/build-and-push.sh
```

This script will:
- Build Docker images for frontend and backend
- Tag images with latest and git commit hash
- Push images to ECR

### 4. Kubernetes Deployment

1. Update Kubernetes secrets:
```bash
# Edit k8s/common/secrets.yaml with base64 encoded values
kubectl apply -f k8s/common/secrets.yaml
```

2. Deploy the application:
```bash
./scripts/deploy.sh
```

## 🔄 CI/CD Pipeline

The deployment process can be automated using the provided scripts:

1. `build-and-push.sh`: Builds and pushes Docker images
2. `deploy.sh`: Deploys the application to EKS
3. `destroy.sh`: Tears down the infrastructure

## 🏗️ Infrastructure Components

### VPC Configuration
- CIDR: 10.0.0.0/16
- 2 Public Subnets
- 2 Private Subnets
- NAT Gateways
- Internet Gateway

### EKS Cluster
- Kubernetes version: 1.29
- Node type: t3.medium
- Auto-scaling configuration:
  - Min: 1
  - Max: 3
  - Desired: 2

### Security
- IAM roles with least privilege
- Network isolation with private subnets
- Security groups
- RBAC configuration

## 📊 Monitoring and Logging

The deployment includes:
- Readiness probes
- Liveness probes
- Resource limits and requests
- Container logging

## 🔍 Troubleshooting

### Common Issues

1. ECR Login Failures:
```bash
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URL
```

2. EKS Connection Issues:
```bash
aws eks update-kubeconfig --name $CLUSTER_NAME --region $AWS_REGION
```

3. Pod Status Checking:
```bash
kubectl get pods -n blog-app
kubectl describe pod <pod-name> -n blog-app
```

## 🧹 Cleanup

To destroy all resources:
```bash
./scripts/destroy.sh
```

## ⚙️ Configuration Reference

### Resource Limits
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### Health Checks
```yaml
readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 10
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 🔒 Security Notes

- Secrets are managed using Kubernetes secrets
- All sensitive values should be base64 encoded
- Infrastructure uses private subnets for workloads
- Container images are scanned for vulnerabilities

## 📝 License

This project is licensed under the MIT License.