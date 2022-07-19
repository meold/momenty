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
  source = "git::git@github.com:terraform-aws-modules/terraform-aws-security-group.git//.?ref=v4.7.0"
}

include {
  path = find_in_parent_folders()
}

dependencies {
  paths = ["../vpc"]
}

dependency "vpc" {
  config_path = "../vpc"
}


###########################################################
# View all available inputs for this module:
# https://registry.terraform.io/modules/terraform-aws-modules/security-group/aws/3.1.0?tab=inputs
###########################################################
inputs = {
  # List of IPv4 CIDR ranges to use on all ingress rules
  # type: list(string)

  # List of ingress rules to create by name
  # type: list(string)
  //ingress_cidr_blocks = [dependency.vpc.outputs.vpc_cidr_block]

  //ingress_rules = ["all-all"]
  

  # Name of security group
  # type: string
  name = "${local.env}-${local.project}-for-ec2"

  # ID of the VPC where to create security group
  # type: string
  //vpc_id = dependency.vpc.outputs.vpc_id


  description = "Security group for SSH for some IPs and Back end port only from ALB"
  vpc_id      = dependency.vpc.outputs.vpc_id

  ingress_cidr_blocks      = flatten([local.environment_vars.locals.ssh_allowed_cird])
  ingress_rules            = ["ssh-tcp"]
  ingress_with_cidr_blocks = [
    {
      from_port   = 0
      to_port     = 65535
      protocol    = "tcp"
      description = "back end port"
      cidr_blocks = dependency.vpc.outputs.vpc_cidr_block
    }
  ]
  egress_rules  = ["all-all"]

}