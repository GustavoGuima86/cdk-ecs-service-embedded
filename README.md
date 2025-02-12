# CDK ECS service demo of ecr embedded deployment

One of the CDK capabilities helps us to simplify the deployment of microservices. By packing up CDK infra altogether your application and using Dockerfile we can build the application push to ECR and deploy the service in a simple pipeline.

What does it mean? No more complex pipelines to build and push Docker image to repos and another pipeline to deploy the new version to your container orchestrator.

In this simple project is demonstrated this feature, here we will se the following components:

- CDK stack
- ECS cluster
- ECS service
- ALB Load Balancer
- ECR repos creation
- Little httpserver
- DockerFile building the Httpserver


## Code example for the eCR deployment
```
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
    
    export class ECR extends Stack {
    
      public readonly repositoryReturn : Repository;
    
      constructor(scope: Construct, id: string, props: EcrRepoStackProps) {
        super(scope, id);
        const {serviceName, uniqueTagImage} = props;
    
        const repository = new Repository(this, `${serviceName}-repository`, {
          repositoryName: `${serviceName}-repository`,
          imageScanOnPush: true,
        });
    
        const image = new DockerImageAsset(this, `${serviceName}Image`, {
          directory: path.resolve(__dirname, '../..'),
          networkMode: NetworkMode.HOST,
          exclude: ['infrastructure']
        })
    
        const deployment = new ecrdeploy.ECRDeployment(this, `${serviceName}DockerImage`, {
          src: new ecrdeploy.DockerImageName(image.imageUri),
          dest: new ecrdeploy.DockerImageName(`${repository.repositoryUri}:${uniqueTagImage}`),
        });
        this.repositoryReturn = repository;
      }
}
```

### Command to deploy 

``NO_PREBUILT_LAMBDA=1 cdk deploy --all``