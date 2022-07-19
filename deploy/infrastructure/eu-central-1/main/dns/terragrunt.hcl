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
  source = "git::git@github.com:terraform-aws-modules/terraform-aws-route53.git//modules/records?ref=v2.3.0"
}

inputs = {

  zone_name = dependency.aws-data.outputs.domain_name

  records = [
    {
      name    = ""
      type    = "A"
      alias   = {
        name    = dependency.alb.outputs.lb_dns_name
        zone_id = dependency.alb.outputs.lb_zone_id
        #evaluate_target_health = true
      }
    }
  ]

}

include {
  path = find_in_parent_folders()
}

dependencies {
  paths = ["../vpc", "../sg-alb", "../acme", "../alb", "../aws-data"]
}

dependency "aws-data" {
  config_path = "../aws-data"
}

dependency "vpc" {
  config_path = "../vpc"
}

dependency "sg-alb" {
  config_path = "../sg-alb"
}

dependency "acme" {
  config_path = "../acme"
}

dependency "alb" {
  config_path = "../alb"
}