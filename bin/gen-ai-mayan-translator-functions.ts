#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { GenAiMayanTranslatorFunctionsPipelineStack } from '../lib/gen-ai-mayan-translator-functions-pipeline-stack';
import { setupParametersAndGetConfig, getConfigurationFromSSM } from '../config';

const app = new cdk.App();

// Create parameters stack that will create all SSM parameters
class ParametersStack extends cdk.Stack {
    public readonly config: any;
    
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        // This will create all parameters and return the config
        this.config = setupParametersAndGetConfig(this);
    }
}

// Create the parameters stack first
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

// Create a separate stack to read the configuration from SSM
class PipelineConfigStack extends cdk.Stack {
    public readonly config: any;
    
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        // Read configuration from SSM parameters
        this.config = getConfigurationFromSSM(this);
    }
}

// Read the configuration from SSM for the pipeline
const pipelineConfig = new PipelineConfigStack(app, 'GenAiMayanTranslatorPipelineConfig', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
    }
});

// Then create the pipeline with the configuration from SSM
new GenAiMayanTranslatorFunctionsPipelineStack(app, 'GenAiMayanTranslatorFunctionsPipelineStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
    },
    configuration: pipelineConfig.config,
    tags: {
        Application: 'GenAiMayanTranslator',
        Environment: 'Pipeline'
    }
});
