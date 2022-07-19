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
  name       = "${local.project}-${local.env}-github" 
  user_name  = dependency.github-iam-user.outputs.iam_user_name
  role_name  = dependency.github-iam-assumable-role.outputs.iam_role_name
  policy_arn = dependency.github-iam-policy.outputs.arn
}


include {
  path = find_in_parent_folders()
}

dependencies {
  paths = ["../github-iam-user", "../github-iam-policy", "../github-iam-assumable-role" ]
}

dependency "github-iam-user" {
  config_path = "../github-iam-user"
}

dependency "github-iam-policy" {
  config_path = "../github-iam-policy"
}

dependency "github-iam-assumable-role" {
  config_path = "../github-iam-assumable-role"
}