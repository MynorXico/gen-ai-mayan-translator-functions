import {Stack, StackProps, aws_iam as iam} from "aws-cdk-lib";
import {Construct} from "constructs";
import {Configuration, Environment} from "../config/types";
import {CodePipeline, CodePipelineSource, ShellStep} from "aws-cdk-lib/pipelines";
import {GenAiMayanTranslatorFunctionsStage} from "./gen-ai-mayan-translator-functions-stage";

interface GenAiMayanTranslatorFunctionsPipelineStackProps extends StackProps{
    configuration: Configuration
}

export class GenAiMayanTranslatorFunctionsPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props: GenAiMayanTranslatorFunctionsPipelineStackProps){
        super(scope, id, props);

        // AWS CDK Pipeline
        const pipeline = new CodePipeline(this, 'GenAiMayanTranslatorFunctionsPipeline', {
            crossAccountKeys: true, // Enable cross-account deployments
            pipelineName: 'gen-ai-mayan-translator-pipeline',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.gitHub('MynorXico/gen-ai-mayan-translator-functions', 'main'),
                commands: [
                    'npm ci',
                    'npm run build',
                    'npx cdk synth'
                ],
                env: {
                    PARAM_ACCOUNTS_DEV: props.configuration.accounts.dev,
                    PARAM_ACCOUNTS_QA: props.configuration.accounts.qa,
                    PARAM_ACCOUNTS_PROD: props.configuration.accounts.prod,
                    PARAM_REGION: props.configuration.region,
                    PARAM_API_DOMAINNAME: props.configuration.apiDomainName,
                    PARAM_API_SUBDOMAINNAME: props.configuration.apiSubdomainName
                }
            })
        })

        const pipelineRole = new iam.Role(this, 'CodePipelineServiceRole', {
            assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
            description: 'Role for the CodePipeline to access SSM parameters and perform cross-account deployments',
        });

        // Cross-account deployment permissions
        pipelineRole.addToPolicy(new iam.PolicyStatement({
            actions: [
                'kms:Decrypt',
                'kms:Encrypt',
                'kms:ReEncrypt*',
                'kms:GenerateDataKey*',
                'kms:DescribeKey',
                'sts:AssumeRole',
                'cloudformation:*',
                's3:*',
                'iam:PassRole'
            ],
            resources: ['*']
        }));

        // Create dev stage with the configuration from props
        const devStage = pipeline.addStage(new GenAiMayanTranslatorFunctionsStage(this, 'Dev', {
            env: {
                account: props.configuration.accounts.dev,
                region: props.configuration.region
            },
            environment: Environment.DEV,
            configuration: props.configuration,
        }));
    }
}
