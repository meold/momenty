locals {
   # Automatically load environment-level variables
   environment_vars = read_terragrunt_config(find_in_parent_folders("env.hcl"))
   region_vars = read_terragrunt_config(find_in_parent_folders("region.hcl"))   
   # Extract out common variables for reuse
   env        = local.environment_vars.locals.environment
   project    = local.environment_vars.locals.project
   aws_region = local.region_vars.locals.aws_region
}

terraform {
  source = "git::git@github.com:terraform-aws-modules/terraform-aws-ecs.git//.?ref=v3.4.1"
}
inputs = {
  name                     = "${local.project}-${local.env}"
  capacity_providers       = ["cp-${local.environment_vars.locals.environment}"]

  default_capacity_provider_strategy = [{
    capacity_provider = "cp-${local.environment_vars.locals.environment}"
    weight            = "1"
  }]
  tags = {
  "project" = local.project
  "env"     = local.env
  }  
}


include {
  path = find_in_parent_folders()
}