resource "aws_cloudwatch_log_group" "this_log_group" {
  name              = var.log_group_name
  retention_in_days = 14
}

data "aws_ecs_task_definition" "this_task_definition" {
  task_definition = "${aws_ecs_task_definition.this_task_definition.family}"
}


resource "aws_ecs_task_definition" "this_task_definition" {
  family = var.app_name
  execution_role_arn = "${var.role_arn}"
    container_definitions = jsonencode([
{
	name: "${var.app_name}",
	image: "${var.image}",
	memory: var.memory,
	command: [
		"sh",
		"-c",
		"${var.command}"],
	healthCheck: {
		retries: 3,
		timeout: 5,
		interval: 30,
		startPeriod: null,
		command: [
			"CMD-SHELL",
			"curl -f http://localhost:${var.back_end_port}${var.health_check_path} || exit 1"
		]
	},
	portMappings: [{
		containerPort: var.back_end_port,
		hostPort: 0,
		protocol: "tcp"
	}],
  environment: [
                {
                    name: "NODE_ENV",
                    value: "${var.node_env}"
                },
                {
									name: "TZ",
									value: "UTC"
							  },
                {
                    name: "NODE_OPTIONS",
                    value: "--max_old_space_size=${var.memory}"
                }
            ],
	logConfiguration: {
		logDriver: "awslogs",
		options: {
			awslogs-region: "${var.aws_region}",
			awslogs-group: "${aws_cloudwatch_log_group.this_log_group.name}",
			awslogs-stream-prefix: "${var.app_name}"
		}
	}
}
  ])
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_ecs_service" "this_task_service" {
  depends_on = [
    aws_ecs_task_definition.this_task_definition
  ]
  name            = "${var.app_name}-service"
  cluster         = var.cluster_id
  task_definition = "${aws_ecs_task_definition.this_task_definition.family}:${max("${aws_ecs_task_definition.this_task_definition.revision}", "${data.aws_ecs_task_definition.this_task_definition.revision}")}"

  lifecycle {
    create_before_destroy = true
    ignore_changes        = [task_definition]
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  capacity_provider_strategy {
    base = var.min_size
    capacity_provider = var.capacity_provider_name
    weight = 100

  }

  load_balancer {
    target_group_arn = var.alb_target_group
    container_name = aws_ecs_task_definition.this_task_definition.family
    container_port = var.back_end_port

  }

  desired_count = var.desired_count
  force_new_deployment = true

  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 50
}


resource "aws_appautoscaling_target" "ecs_target" {
  max_capacity       = var.max_size
  min_capacity       = var.min_size
  resource_id        = "service/${var.cluster_name}/${aws_ecs_service.this_task_service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "ecs_target_cpu" {
  name               = "application-scaling-policy-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 80
  }
  depends_on = [aws_appautoscaling_target.ecs_target]
}

resource "aws_appautoscaling_policy" "ecs_target_memory" {
  name               = "application-scaling-policy-memory"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
    target_value = 80
  }
  depends_on = [aws_appautoscaling_target.ecs_target]
}

data "aws_ecs_service" "this" {
  depends_on = [
    aws_ecs_task_definition.this_task_definition
  ]
  service_name = aws_ecs_service.this_task_service.name
  cluster_arn  = var.cluster_arn
}