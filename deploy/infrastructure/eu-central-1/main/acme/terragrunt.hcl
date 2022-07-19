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
  source = "git::git@github.com:terraform-aws-modules/terraform-aws-acm.git//.?ref=v3.2.0"
}

inputs = {
  
  domain_name         = "${local.environment_vars.locals.main_domain}"
  zone_id             = dependency.aws-data.outputs.domain_zone_id
  subject_alternative_names = ["*.${local.environment_vars.locals.main_domain}"]
  wait_for_validation = true

}


include {
  path = find_in_parent_folders()
}

dependencies {
  paths = ["../vpc", "../aws-data"]
}

dependency "vpc" {
  config_path = "../vpc"
}

dependency "aws-data" {
  config_path = "../aws-data"
}