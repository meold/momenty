
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
   source = "git::git@github.com:terraform-aws-modules/terraform-aws-s3-bucket.git//.?ref=v3.3.0"
}

inputs = {
  bucket = "${local.env}-${local.project}-original-media"
  acl    = "public-read"

  versioning = {
    enabled = false
  }
  cors_rule = [
    {
      allowed_methods = ["PUT", "POST", "GET"]
      allowed_origins = ["*.${local.environment_vars.locals.main_domain}", "${local.environment_vars.locals.main_domain}"]
      allowed_headers = ["*"]
      expose_headers  = ["ETag"]
      max_age_seconds = 3000
      }
  ]
  tags = {
    Environment = local.env
    Project     = local.project
    Description = "Managed by Terraform"
  }
}


include {
  path = find_in_parent_folders()
}

dependencies {
  paths = ["../aws-data"]
}

dependency "aws-data" {
  config_path = "../aws-data"
}