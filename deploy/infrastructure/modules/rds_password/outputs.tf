output "parameter_names" {
  description = "List of key names"
  value       = module.store_write.names
}

output "parameter_values" {
  description = "List of values"
  value       = module.store_write.values
  sensitive   = true
}


output "arn_map" {
  description = "A map of the names and ARNs created"
  value       = module.store_write.arn_map
}