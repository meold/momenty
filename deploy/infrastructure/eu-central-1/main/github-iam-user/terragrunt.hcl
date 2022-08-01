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
  source = "git::git@github.com:terraform-aws-modules/terraform-aws-iam.git//modules/iam-user?ref=v4.7.0"
}

inputs = {
  
  name = "github-actions-${local.env}-${local.project}"
  create_iam_user_login_profile = false
  create_iam_access_key         = true
  // Check iam_access_key_secret in terraform.tfstate in relative path.

}


include {
  path = find_in_parent_folders()
}
