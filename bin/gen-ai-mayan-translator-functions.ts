#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { GenAiMayanTranslatorFunctionsPipelineStack } from '../lib/gen-ai-mayan-translator-functions-pipeline-stack';
import { Configuration } from '../config/types';
import { setupParametersAndGetConfig } from '../config';

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

// Get configuration from environment variables or CDK context
const getConfigFromEnvOrContext = (): Configuration => {
    const config = {
        stackName: 'gen-ai-mayan-translator-functions',
        apiDomainName: process.env.PARAM_API_DOMAINNAME || app.node.tryGetContext('apiDomainName') || 'example.com',
        apiSubdomainName: process.env.PARAM_API_SUBDOMAINNAME || app.node.tryGetContext('apiSubdomainName') || 'api',
        accounts: {
            dev: process.env.PARAM_ACCOUNTS_DEV || app.node.tryGetContext('devAccountId') || '123456789123',
            qa: process.env.PARAM_ACCOUNTS_QA || app.node.tryGetContext('qaAccountId') || '123456789123',
            prod: process.env.PARAM_ACCOUNTS_PROD || app.node.tryGetContext('prodAccountId') || '123456789'
        },
        region: process.env.PARAM_REGION || app.node.tryGetContext('region') || process.env.CDK_DEFAULT_REGION || 'us-east-1'
    };
    
    // Log the configuration being used
    console.log('Using configuration:', JSON.stringify(config, null, 2));
    
    return config;
};

// Then create the pipeline with the configuration
new GenAiMayanTranslatorFunctionsPipelineStack(app, 'GenAiMayanTranslatorFunctionsPipelineStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
    },
    configuration: getConfigFromEnvOrContext(),
    tags: {
        Application: 'GenAiMayanTranslator',
        Environment: 'Pipeline'
    }
});
