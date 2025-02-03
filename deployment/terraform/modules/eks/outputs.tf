output "cluster_name" {
  value = aws_eks_cluster.main.name
}

output "cluster_endpoint" {
  value = aws_eks_cluster.main.endpoint
}

output "cluster_certificate_authority_data" {
  value = aws_eks_cluster.main.certificate_authority[0].data
}

output "cluster_token" {
  value = data.aws_eks_cluster_auth.cluster.token
  sensitive = true
}

# Add this data source at the top of the main.tf file in the eks module
data "aws_eks_cluster_auth" "cluster" {
  name = aws_eks_cluster.main.name
}