terraform {
 //required_version = ">= 0.12.6, < 0.14"
  required_providers {
    random = ">= 2.2.0"
  }
}


resource "random_password" "random_string" {
  count            = var.create_secret ? 1 : 0
  length           = var.length
  lower            = var.use_lower
  number           = var.use_number
  min_lower        = var.min_lower
  min_numeric      = var.min_numeric
  min_special      = var.min_special
  min_upper        = var.min_upper
  override_special = var.override_special == "" ? null : var.override_special
  special          = var.use_special
  upper            = var.use_upper

  keepers = {
    pass_version = var.pass_version
  }
}


module "store_write" {
  source          = "git::git@github.com:cloudposse/terraform-aws-ssm-parameter-store.git"

  parameter_write = [
    {
      name        = var.name
      value       = random_password.random_string[0].result
      type        = "SecureString"
      overwrite   = "true"
      description = var.description
    }
  ]

  tags = {
    ManagedBy = "Terraform"
  }
}