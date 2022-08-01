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
  source = "${get_parent_terragrunt_dir()}//infrastructure/modules/rds_password"
}

inputs = {
  
  name              = "/${local.environment_vars.locals.environment}/${local.project}/rdsmysql/password"
  env               = local.env
  description       = "RDS ${local.environment_vars.locals.environment} ${local.project} master password"
  length            = 14
  override_special  = "@#$%^*()-=_+[]{};<>?,''./' '"
  pass_version      = 3
  use_special       = false

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