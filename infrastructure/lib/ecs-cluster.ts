import {Stack, StackProps} from "aws-cdk-lib";
import {Vpc} from "aws-cdk-lib/aws-ec2";
import {Construct} from "constructs";
import {Cluster} from "aws-cdk-lib/aws-ecs";

export interface EcsClusterProps extends StackProps {
    cluster_name: string
    vpc: Vpc
}

export class EcsCluster extends Stack {
    public readonly EcsCluster: Cluster;

    constructor(scope: Construct, id: string, props: EcsClusterProps) {
        super(scope, id, props);

        const cluster = new Cluster(this, 'EcsCluster', {
            vpc: props.vpc,
            containerInsights: true,
            enableFargateCapacityProviders: true
        });

        this.EcsCluster = cluster

    }
}
