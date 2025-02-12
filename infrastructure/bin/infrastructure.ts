#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EcsServiceTestStack } from '../lib/ecs-service-test-stack';
import {ECR} from "../lib/ecr-repository-creation";
import {VpcCluster} from "../lib/vpc";
import {EcsCluster} from "../lib/ecs-cluster";

const app = new cdk.App();
const serviceName ='ecs-test-service';
let uniqueTagImage = process.env.GIT_HASH || new Date().getTime().toString();

const repositoryStack =  new ECR(app, `${serviceName}EcrRepository`, {
    serviceName,
    uniqueTagImage
});

const vpc = new VpcCluster(app, "ClusterVpc", {
    vpc_name: "gustavo-vpc"
});

const ecsCluster = new EcsCluster(app, "EcsCluster", {
    vpc: vpc.VpcCluster,
    cluster_name: "gustavo-cluster"
})

new EcsServiceTestStack(app, 'ECSServiceTestStack', {
    cluster: ecsCluster.EcsCluster,
    repository: repositoryStack.repositoryReturn,
    serviceName,
    uniqueTagImage,
    vpc: vpc.VpcCluster,
});