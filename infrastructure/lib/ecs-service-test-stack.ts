import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StackProps} from "aws-cdk-lib";
import {
  Cluster,
  ContainerImage,
  FargateService,
  FargateTaskDefinition,
  LogDrivers
} from "aws-cdk-lib/aws-ecs";
import {ApplicationLoadBalancer, ApplicationProtocol} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {Port, Vpc} from "aws-cdk-lib/aws-ec2";
import {Repository} from "aws-cdk-lib/aws-ecr";

export interface ECSServiceTestStackProps extends StackProps {
  serviceName: string,
  repository: Repository,
  uniqueTagImage: string,
  vpc: Vpc
  cluster: Cluster
}

export class EcsServiceTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ECSServiceTestStackProps) {
    super(scope, id, props);
    const {serviceName, repository, uniqueTagImage, vpc, cluster } = props;

    const taskDefinitionFargate = new FargateTaskDefinition(this, 'TaskDefFargate');

    taskDefinitionFargate.addContainer('testContainerService', {
      image: ContainerImage.fromEcrRepository(repository, uniqueTagImage),
      logging: LogDrivers.awsLogs({
        streamPrefix: 'ecs',
      }),
      memoryLimitMiB: 512,
      cpu: 256,
      portMappings: [{ containerPort: 80 }],
    });

    const service = new FargateService(this, 'Service', {
      cluster,
      taskDefinition: taskDefinitionFargate,
      maxHealthyPercent: 200,
      minHealthyPercent: 50,
      serviceName: serviceName,
    });
    service.connections.allowFromAnyIpv4(Port.tcp(80))

    const lb = new ApplicationLoadBalancer(this, 'LB', {
      vpc,
      internetFacing: true,
      deletionProtection: false,
    });

    const listener = lb.addListener('Listener', {
      port: 80,
      open: true,
      protocol: ApplicationProtocol.HTTP,
    });

    listener.addTargets('DefaultTargetGroup', {
      targets: [service],
      port: 80,
      healthCheck: {
        path: '/'
      },
    });
  }
}
