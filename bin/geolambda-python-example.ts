#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { GeolambdaPythonExampleStack } from '../lib/geolambda-python-example-stack';

const app = new cdk.App();
new GeolambdaPythonExampleStack(app, 'GeolambdaPythonExampleStack');
