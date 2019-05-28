import cdk = require('@aws-cdk/cdk');
import lambda = require('@aws-cdk/aws-lambda');

export class GeolambdaPythonExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //const geolambdaLayer = lambda.LayerVersion.fromLayerVersionArn(this, "geolambdaLayer", "arn:aws:lambda:us-west-2:552188055668:layer:geolambda:1");
    
    const geolambdaLayer = new lambda.LayerVersion(this, "geolambdaLayer", {
      name: "geolambdaLayer",
      description: "Geolambda layer",
      code: lambda.Code.asset("layer/geolambda.zip"),
      compatibleRuntimes: [ lambda.Runtime.Python36, lambda.Runtime.Python37 ]
    });

    const geolambdaPythonLayer = new lambda.LayerVersion(this, "geolambdaPythonLayer", {
      name: "geolambdaPythonLayer",
      description: "Geolambda Python bindings",
      code: lambda.Code.asset("layer/geolambda-python.zip"),
      compatibleRuntimes: [ lambda.Runtime.Python36, lambda.Runtime.Python37 ]
    });

    new lambda.Function(this, "CallGeolambdaPython", {
      runtime: lambda.Runtime.Python37,
      layers: [ geolambdaLayer, geolambdaPythonLayer ], 
      code: lambda.Code.asset("lambda/python"),
      handler: "lambda_function.lambda_handler",
      timeout: 300,
      description: "Lambda function that will invoke Geolambda Python bindings with GDAL"
    });
  }
}
