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
  name        = "${local.environment_vars.locals.project}-${local.environment_vars.locals.environment}-github-actions"
  path        = "/"
  policy = <<EOF
{
   "Version":"2012-10-17",
   "Statement":[
      {
         "Sid":"RegisterTaskDefinition",
         "Effect":"Allow",
         "Action":[
            "ecs:RegisterTaskDefinition"
         ],
         "Resource":"*"
      },
      {
         "Sid": "AllowPublicReadAccess",
         "Effect": "Allow",
         "Action": "s3:*",
         "Resource": [
           "arn:aws:s3:::main-nftmoments-origin/*",
           "arn:aws:s3:::main-nftmoments-origin"
         ]
      },
      {
         "Sid": "CFInvalidation",
         "Effect":"Allow",
         "Action":[ 
            "cloudfront:GetDistribution",
            "cloudfront:GetStreamingDistribution",
            "cloudfront:GetDistributionConfig",
            "cloudfront:ListDistributions",
            "cloudfront:ListCloudFrontOriginAccessIdentities",
            "cloudfront:CreateInvalidation",
            "cloudfront:GetInvalidation",
            "cloudfront:ListInvalidations"
         ],
         "Resource":"*"
      },
      {
         "Sid":"PassRolesInTaskDefinition",
         "Effect":"Allow",
         "Action":[
            "iam:PassRole"
         ],
        "Resource":"*"
      },
      {
         "Sid":"DeployService",
         "Effect":"Allow",
         "Action":[
            "ecs:UpdateService",
            "ecs:DescribeServices",
            "ecs:DescribeTaskDefinition",
            "ecs:DescribeTasks",
            "ecs:RunTask",
            "ecs:DeleteTaskSet",
            "ecs:ListTasks",
            "ecs:ExecuteCommand",
            "ecs:DeregisterTaskDefinition",
            "ecr:*",
            "ssm:GetParameter",
            "kms:Decrypt",
            "secretsmanager:GetSecretValue"
         ],
        "Resource":"*"
      }
   ]
}
EOF

}


include {
  path = find_in_parent_folders()
}
