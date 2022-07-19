
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
   source = "git::git@github.com:terraform-aws-modules/terraform-aws-vpc.git//.?ref=v3.12.0"
}

inputs = {
   name                   = "${local.env}-${local.project}"
   cidr                   = "10.0.0.0/16"
   azs                    = ["${local.aws_region}a", "${local.aws_region}b", "${local.aws_region}c"]
   public_subnets         = ["10.0.0.0/24", "10.0.1.0/24", "10.0.2.0/24"]
   private_subnets        = ["10.0.10.0/24", "10.0.11.0/24", "10.0.12.0/24"]
   enable_dns_support     = true
   enable_dns_hostnames   = true
   enable_nat_gateway     = false
   #single_nat_gateway     = true
   #one_nat_gateway_per_az = false
   #reuse_nat_ips          = true
   #external_nat_ip_ids    = ["${dependency.aws-data.outputs.nat_ip_id[0]}"]
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