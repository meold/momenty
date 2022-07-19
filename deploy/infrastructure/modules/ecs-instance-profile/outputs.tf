output "this_iam_instance_profile_id" {
  value = aws_iam_instance_profile.this.id
}

output "aws_iam_role_arn" {
  value = aws_iam_role.this.arn
}

output "aws_iam_instance_profile_name" {
  value = aws_iam_instance_profile.this.name
}