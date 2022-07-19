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
  source = "${get_parent_terragrunt_dir()}//infrastructure/modules/iam-policy-attach"
}
inputs = {
  name       = "${local.project}-${local.env}" 
  user_name  = dependency.backend-iam-user.outputs.iam_user_name
  role_name  = dependency.backend-iam-assumable-role.outputs.iam_role_name
  policy_arn = dependency.backend-iam-policy.outputs.arn
}


include {
  path = find_in_parent_folders()
}

dependencies {
  paths = ["../backend-iam-user", "../backend-iam-policy", "../backend-iam-assumable-role" ]
}

dependency "backend-iam-user" {
  config_path = "../backend-iam-user"
}

dependency "backend-iam-policy" {
  config_path = "../backend-iam-policy"
}

dependency "backend-iam-assumable-role" {
  config_path = "../backend-iam-assumable-role"
}