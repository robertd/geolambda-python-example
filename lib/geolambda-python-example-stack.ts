import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import iam = require('@aws-cdk/aws-iam');

export class GeolambdaPythonExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //const geolambdaLayer = lambda.LayerVersion.fromLayerVersionArn(this, "geolambdaLayer", "arn:aws:lambda:us-west-2:552188055668:layer:geolambda:1");

    const role = iam.Role.fromRoleArn(this, "role", "arn:aws:iam::746822052750:role/dlv-services-lambda-role");
    
    const geolambdaLayer = new lambda.LayerVersion(this, "geolambdaLayer", {
      description: "Geolambda layer",
      code: lambda.Code.asset("layer/geolambda.zip"),
      compatibleRuntimes: [ lambda.Runtime.PYTHON_3_6, lambda.Runtime.PYTHON_3_7 ]
    });

    const geolambdaPythonLayer = new lambda.LayerVersion(this, "geolambdaPythonLayer", {
      description: "Geolambda Python bindings",
      code: lambda.Code.asset("layer/geolambda-python.zip"),
      compatibleRuntimes: [ lambda.Runtime.PYTHON_3_6, lambda.Runtime.PYTHON_3_7 ]
    });

    new lambda.Function(this, "CallGeolambdaPython", {
      runtime: lambda.Runtime.PYTHON_3_7,
      layers: [ geolambdaLayer, geolambdaPythonLayer ], 
      code: lambda.Code.asset("lambda/python"),
      role: role,
      timeout: cdk.Duration.seconds(300),
      handler: "lambda_function.lambda_handler",
      description: "Lambda function that will invoke Geolambda Python bindings with GDAL"
    });
  }
}
