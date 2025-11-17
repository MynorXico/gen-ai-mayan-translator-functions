#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { GenAiMayanTranslatorFunctionsPipelineStack } from '../lib/gen-ai-mayan-translator-functions-pipeline-stack';
import { createParameters, getConfiguration } from '../config';

const app = new cdk.App();

// Create parameters stack
class ParametersStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        createParameters(this);
    }
}

// Deploy parameters first
const params = new ParametersStack(app, 'GenAiMayanTranslatorParams', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
    },
    tags: {
        Application: 'GenAiMayanTranslator',
        Environment: 'Dev'
    }
});

// Get configuration that uses the parameters
const config = getConfiguration(params);

// Then create the pipeline with the configuration
new GenAiMayanTranslatorFunctionsPipelineStack(app, 'GenAiMayanTranslatorFunctionsPipelineStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
    },
    configuration: config,
    tags: {
        Application: 'GenAiMayanTranslator',
        Environment: 'Pipeline'
    }
});
