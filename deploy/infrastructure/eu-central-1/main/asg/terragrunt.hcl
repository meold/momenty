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
  source = "git::git@github.com:terraform-aws-modules/terraform-aws-autoscaling.git//.?ref=v5.1.1"
}

inputs = {
  name      = "asg-${local.env}-${local.project}"
  lc_name   = "lc-${local.env}-${local.project}"
  use_lc    = true
  create_lc = true
  use_lt    = false
  create_lt = false
  initial_lifecycle_hooks = [
    {
      name                 = "StartupLifeCycleHook"
      default_result       = "CONTINUE"
      heartbeat_timeout    = 60
      lifecycle_transition = "autoscaling:EC2_INSTANCE_LAUNCHING"
      # This could be a rendered data resource
      notification_metadata = jsonencode({ "hello" = "world" })
    },
    {
      name                 = "TerminationLifeCycleHook"
      default_result       = "CONTINUE"
      heartbeat_timeout    = 180
      lifecycle_transition = "autoscaling:EC2_INSTANCE_TERMINATING"
      # This could be a rendered data resource
      notification_metadata = jsonencode({ "goodbye" = "world" })
    }
  ]
  image_id                  = dependency.aws-data.outputs.ecs_image_id
  key_name                  = dependency.ssh-key.outputs.key_pair_key_name
  instance_type             = local.environment_vars.locals.instance_type
  security_groups           = [dependency.sg-ec2.outputs.security_group_id]
  iam_instance_profile_name = dependency.ec2-profile.outputs.aws_iam_instance_profile_name
  user_data_base64          = base64encode(dependency.ecs-init.outputs.user_data_rendered)
  enable_monitoring         = true
  lifecycle                 = { create_before_destroy = true  }
  instance_refresh = {
    strategy = "Rolling"
    preferences = {
      min_healthy_percentage = 50
    }
    triggers = ["tag"]
  }
  instance_market_options = {
    market_type = "spot"
    # spot_options = {
    #   block_duration_minutes = 60
    # }
  }

  root_block_device = [
    {
      volume_size = local.environment_vars.locals.volume_size
      volume_type = "gp2"
    },
  ]

  # Auto scaling group
  asg_name                  = "asg-${local.env}-${local.project}"
  vpc_zone_identifier       = dependency.vpc.outputs.public_subnets
  health_check_type         = "EC2"
  spot_price                = local.environment_vars.locals.spot_price
  min_size                  = local.environment_vars.locals.min_size
  max_size                  = local.environment_vars.locals.max_size
  desired_capacity          = local.environment_vars.locals.min_size
  wait_for_capacity_timeout = 0
}


include {
  path = find_in_parent_folders()
}

dependencies {
  paths = ["../vpc", "../sg-ec2", "../aws-data", "../ssh-key", "../ec2-profile", "../ecs-init"]
}

dependency "vpc" {
  config_path = "../vpc"
}

dependency "sg-ec2" {
  config_path = "../sg-ec2"
}

dependency "ssh-key" {
  config_path = "../ssh-key"
}

dependency "aws-data" {
  config_path = "../aws-data"
}

dependency "ec2-profile" {
  config_path = "../ec2-profile"
}

dependency "ecs-init" {
  config_path = "../ecs-init"
}
