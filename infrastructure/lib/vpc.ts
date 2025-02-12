import {IpAddresses, SubnetType, Vpc} from "aws-cdk-lib/aws-ec2";
import {Construct} from "constructs";
import {Stack, StackProps} from "aws-cdk-lib";

export interface VpcClusterProps extends StackProps {
    vpc_name: string
}

export class VpcCluster extends Stack  {
    public readonly VpcCluster : Vpc;

    constructor(scope: Construct, id: string, props: VpcClusterProps) {

        super(scope, id, props);

        const vpc = new Vpc(this, 'VPC', {
            ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
            vpcName: props.vpc_name,
            maxAzs: 2,
            subnetConfiguration: [
                {
                    cidrMask: 18,
                    name: 'private',
                    subnetType: SubnetType.PRIVATE_WITH_EGRESS,
                },
                {
                    cidrMask: 19,
                    name: 'public',
                    subnetType: SubnetType.PUBLIC,
                },
                {
                    cidrMask: 19,
                    name: 'isolated',
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                }
            ]
        })

        this.VpcCluster = vpc
    }

}