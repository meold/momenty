resource "aws_iam_policy_attachment" "attach" {
  name       = "${var.name}-attachment"
  users      = ["${var.user_name}"]
  roles      = ["${var.role_name}"]
  #groups     = [aws_iam_group.group.name]
  policy_arn = "${var.policy_arn}"
}