########################################
# General vars
########################################
variable "env" {
  default     = ""
  description = "Environment"
  type        = string
}

variable "service" {
  default     = ""
  description = "Service category"
  type        = string
}


variable "create_secret" {
  default     = true
  description = "If false, this module does nothing (since tf doesn't support conditional modules)"
  type        = bool
}

variable "description" {
  default     = ""
  description = "Description to add to Secret"
  type        = string
}

variable "kms_key_id" {
  default     = null
  description = "Optional. The KMS Key ID to encrypt the secret. KMS key arn or alias can be used."
}

variable "name" {
  default     = ""
  description = "Name (omit to use name_prefix)"
  type        = string
}

variable "name_prefix" {
  default     = "terraform"
  description = "Name Prefix (not used if name specified)"
  type        = string
}

variable "pass_version" {
  default     = 1
  description = "Password version. Increment this to trigger a new password."
  type        = number
}

variable "tags" {
  default     = {}
  description = "Tags to add to supported resources"
  type        = map(string)
}


########################################
# Complexity rules
########################################
variable "length" {
  description = "Length of string"
  type        = number
}

variable "min_lower" {
  default     = 0
  description = "Minimum number of lower case characters"
  type        = number
}

variable "min_numeric" {
  default     = 0
  description = "Minimum number of numbers"
  type        = number
}

variable "min_special" {
  default     = 0
  description = "Minimum number of special characters"
  type        = number
}

variable "min_upper" {
  default     = 0
  description = "Minimum number of upper case characters"
  type        = number
}

variable "override_special" {
  type    = string
  default = ""
}

variable "use_lower" {
  default     = true
  description = "Use lower case  characters"
  type        = bool
}

variable "use_number" {
  default     = true
  description = "Use numbers"
  type        = bool
}

variable "use_special" {
  default     = true
  description = "Use special characters"
  type        = bool
}

variable "use_upper" {
  default     = true
  description = "Use upper case characters"
  type        = bool
}
