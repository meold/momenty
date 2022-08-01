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
  source = "git::git@github.com:terraform-aws-modules/terraform-aws-rds.git//.?ref=v4.7.0"
}

inputs = {

  identifier                            = "${local.project}-main"
  engine                                = "mysql"
  engine_version                        = "8.0.27"
  publicly_accessible                   = true
  family                                = "mysql8.0" # DB parameter group
  major_engine_version                  = "8.0"      # DB option group
  instance_class                        = "db.t4g.small"
  allocated_storage                     = 30
  max_allocated_storage                 = 100
  multi_az                              = false
  vpc_id                                = dependency.vpc.outputs.vpc_id
  subnet_ids                            = flatten([dependency.vpc.outputs.public_subnets])
  db_subnet_group_name                  = local.project
  create_db_subnet_group                = true
  create_security_group                 = false
  
  iam_database_authentication_enabled   = false
  username                              = "administrator"
  password                              = dependency.rds-password.outputs.parameter_values[0]
  create_random_password                = false
  db_name                               = "${local.env}db"

  apply_immediately                     = true
  skip_final_snapshot                   = false
  vpc_security_group_ids                = [dependency.sg-rds.outputs.security_group_id]

  backup_retention_period               = 7

  performance_insights_enabled          = false
  performance_insights_retention_period = 7
  create_monitoring_role                = true
  monitoring_role_name                  = "RDSRole${local.environment_vars.locals.project}"
  monitoring_interval                   = 60
  enabled_cloudwatch_logs_exports       = ["audit", "error", "general", "slowquery"]

  tags = {
    Environment = local.env
    Project     = local.project
  }
}

dependency "vpc" {
  config_path = "../vpc"
}

dependency "sg-rds" {
  config_path = "../sg-rds"
}

dependency "aws-data" {
  config_path = "../aws-data"
}

dependency "rds-password" {
  config_path = "../rds-password"
}


dependencies {
  paths = ["../vpc", "../sg-rds", "../aws-data", "../rds-password"]
}

include {
  path = find_in_parent_folders()
}