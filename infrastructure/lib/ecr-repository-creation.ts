import {Construct} from 'constructs';
import {Stack, StackProps} from 'aws-cdk-lib';
import { DockerImageAsset, NetworkMode } from 'aws-cdk-lib/aws-ecr-assets';
import path = require('path');
import { Repository } from 'aws-cdk-lib/aws-ecr';
import * as ecrdeploy from 'cdk-ecr-deployment';

export interface EcrRepoStackProps extends StackProps {
  serviceName: string;
  uniqueTagImage: string;
}

/**
 * Constructor to the ECR repo creation
 */
export class ECR extends Stack {

  public readonly repositoryReturn : Repository;

  constructor(scope: Construct, id: string, props: EcrRepoStackProps) {
    super(scope, id);
    const {serviceName, uniqueTagImage} = props;

    // Creates the ECR repo
    const repository = new Repository(this, `${serviceName}-repository`, {
      repositoryName: `${serviceName}-repository`,
      imageScanOnPush: true,
    });

    // Builds the image
    const image = new DockerImageAsset(this, `${serviceName}Image`, {
      directory: path.resolve(__dirname, '../..'), // Folder where the Docker file is hosted
      networkMode: NetworkMode.HOST,
      exclude: ['infrastructure'] // Avoid infrastructure folder to be imported by the Docker Image
    })

    // push the image to ECR from local Docker
    new ecrdeploy.ECRDeployment(this, `${serviceName}DockerImage`, {
      src: new ecrdeploy.DockerImageName(image.imageUri),
      dest: new ecrdeploy.DockerImageName(`${repository.repositoryUri}:${uniqueTagImage}`),
    });

    // Export the repository to be used by the ECS when deploy the application
    this.repositoryReturn = repository;
  }
}
