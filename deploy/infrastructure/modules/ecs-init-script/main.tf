data "template_file" "user_data" {
  template = file("user-data.sh")

  vars = {
    cluster_name = var.cluster_name
  }
}