# Set common variables for the environment. This is automatically pulled in in the root terragrunt.hcl configuration to
# feed forward to the child modules.
locals {
  environment                 = "main"              
  project                     = "nftmoments"  // project name
  // Aplication Load Balancer
  back_end_port               = 3000          // for health checks and ALB
  alb_allowed_ips_cird        = "0.0.0.0/0"   // allow IPs for Load Balancer
  health_path                 = "/health/"   // health check path
  // Auto Scaling Group    
  instance_type               = "t3.medium"    
  spot_price                  = "0.041"      // On-Demand price for this instance type
  volume_size                 = "30"
  ssh_allowed_cird            = ["195.72.145.219/32", "91.211.120.174/32"] 
  public_key_location         = "~/.ssh/nftmoments-main.pub" // path to ssh key
  max_cpu_percent             = 70
  period_seconds              = 60
  min_size                    = 2
  max_size                    = 4
  // DNS     
  main_domain                 = "nftmoments.fun"
}