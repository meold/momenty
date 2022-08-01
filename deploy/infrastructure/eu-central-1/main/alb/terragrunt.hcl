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
  source = "git::git@github.com:terraform-aws-modules/terraform-aws-alb.git//.?ref=v6.7.0"
}

inputs = {

  name = "alb-${local.env}-${local.project}"

  load_balancer_type = "application"

  vpc_id          = dependency.vpc.outputs.vpc_id
  security_groups = [dependency.sg-alb.outputs.security_group_id]
  subnets         = dependency.vpc.outputs.public_subnets

  http_tcp_listeners = [
    {
      port        = 80
      protocol    = "HTTP"
      action_type = "redirect"
      redirect = {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }
  ]

  https_listeners = [
    {
      port               = 443
      protocol           = "HTTPS"
      certificate_arn    = dependency.acme.outputs.acm_certificate_arn
      target_group_index = 0
    }
  ]

  target_groups = [
    {
      name                = "app-${local.project}"
      backend_protocol     = "HTTP"
      backend_port         = local.environment_vars.locals.back_end_port
      target_type          = "instance"
      deregistration_delay = 10
      health_check = {
        enabled             = true
        interval            = 5
        path                = local.environment_vars.locals.health_path
        port                = "traffic-port"
        healthy_threshold   = 2
        unhealthy_threshold = 3
        timeout             = 4
        protocol            = "HTTP"
        matcher             = "200,404"
      }
    }
  ]
}


include {
  path = find_in_parent_folders()
}

dependencies {
  paths = ["../vpc", "../sg-alb", "../acme"]
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
