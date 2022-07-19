locals {
  # Use existing (via data source) or create new zone (will fail validation, if zone is not reachable)
  use_existing_route53_zone = true

  # Removing trailing dot from domain - just to be sure :)
  domain_name = trimsuffix(var.domain, ".")
}

data "aws_region" "selected" {}

data "aws_availability_zones" "available" {}


data "aws_route53_zone" "this" {
  count = local.use_existing_route53_zone ? 1 : 0

  name         = local.domain_name
  private_zone = false
}

resource "aws_route53_zone" "this" {
  count = ! local.use_existing_route53_zone ? 1 : 0
  name  = local.domain_name
}

data "aws_ami" "amazon_linux_ecs" {
  most_recent = true

  owners = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn-ami-*-amazon-ecs-optimized"]
  }

  filter {
    name   = "owner-alias"
    values = ["amazon"]
  }
}
