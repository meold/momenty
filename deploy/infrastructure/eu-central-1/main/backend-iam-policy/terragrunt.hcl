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
  source = "git::git@github.com:terraform-aws-modules/terraform-aws-iam.git//modules/iam-policy?ref=v4.7.0"
}

inputs = {
  name        = "${local.environment_vars.locals.project}-${local.environment_vars.locals.environment}-backend"
  path        = "/"
  policy = <<EOF
{
   "Version":"2012-10-17",
   "Statement":[
      {
         "Sid": "S3Allow",
         "Effect": "Allow",
         "Action": "s3:*",
         "Resource": [
           "arn:aws:s3:::*"
         ]
      },
      {
        "Sid": "Stmt1645190459413",
        "Action": "sqs:*",
        "Effect": "Allow",
        "Resource": [
          "arn:aws:sqs:eu-central-1:738261233018:momentlyrenderImages",
          "arn:aws:sqs:eu-central-1:738261233018:momentlyrenderVideo"
        ]
      }
  ]
}
EOF

}


include {
  path = find_in_parent_folders()
}
