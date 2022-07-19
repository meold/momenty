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
  source = "git::git@github.com:terraform-aws-modules/terraform-aws-iam.git//modules/iam-assumable-role?ref=v4.13.0"
}

inputs = {
  
  trusted_role_arns = [
    dependency.backend-iam-user.outputs.iam_user_arn,
  ]

  create_role = true

  role_name         = "backend-${local.env}"
  role_requires_mfa = false


  custom_role_policy_arns = [
    dependency.backend-iam-policy.outputs.arn
  ]

}


include {
  path = find_in_parent_folders()
}


dependencies {
  paths = ["../backend-iam-user", "../backend-iam-policy"]
}

dependency "backend-iam-user" {
  config_path = "../backend-iam-user"
}

dependency "backend-iam-policy" {
  config_path = "../backend-iam-policy"
}