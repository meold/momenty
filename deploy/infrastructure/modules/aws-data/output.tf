output "aws_region" {
  description = "Details about selected AWS region"
  value       = data.aws_region.selected
}

output "available_aws_availability_zones_names" {
  description = "A list of the Availability Zone names available to the account"
  value       = data.aws_availability_zones.available.names
}

output "available_aws_availability_zones_zone_ids" {
  description = "A list of the Availability Zone IDs available to the account"
  value       = data.aws_availability_zones.available.zone_ids
}

output "ecs_image_id" {
  description = "AMI ID"
  value       = data.aws_ami.amazon_linux_ecs.id
}


output "domain_name" {
  description = "Main domain name"
  value       = local.domain_name
}


output "domain_zone_id" {
  description = "Route53 zone id"
  // from https://github.com/terraform-aws-modules/terraform-aws-acm/blob/a8842dc90aab69ae99038bf80bf3f9d8e355d61f/examples/complete-dns-validation/main.tf#L27
  value       = coalescelist(data.aws_route53_zone.this.*.zone_id, aws_route53_zone.this.*.zone_id)[0]
}

