#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { GenAiMayanTranslatorFunctionsPipelineStack } from '../lib/gen-ai-mayan-translator-functions-pipeline-stack';
import {getConfig} from "../config";

const app = new cdk.App();



// Then create the pipeline with the configuration
new GenAiMayanTranslatorFunctionsPipelineStack(app, 'GenAiMayanTranslatorFunctionsPipelineStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
    },
    configuration: getConfig(),
    tags: {
        Application: 'GenAiMayanTranslator',
        Environment: 'Pipeline'
    }
});
