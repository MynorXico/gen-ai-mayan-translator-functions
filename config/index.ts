import { Configuration } from './types';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

// Default values (used as fallback)
const defaultConfig = {
    devAccountId: '123456789123',
    qaAccountId: '321654987321',
    prodAccountId: '789456123789',
    region: 'us-east-1',
    apiDomainName: 'example.com',
    apiSubdomainName: 'api'
} as const;

// Function to create parameters in a stack
export const createParameters = (scope: Construct) => {
    // Create parameters with default values
    const createParam = (name: string, defaultValue: string): string => {
        const paramName = `/gen-ai-mayan/${name}`;
        const envVarName = `PARAM_${name.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`;
        const paramValue = process.env[envVarName] || defaultValue;
        
        new StringParameter(scope, `Param${name.replace(/[^a-zA-Z0-9]/g, '')}`, {
            parameterName: paramName,
            stringValue: paramValue,
            description: `Parameter for ${name}`
        });
        
        return paramValue; // Return the value, not the name
    };

    // Create all parameters and return their values
    const devAccountId = createParam('accounts/dev', defaultConfig.devAccountId);
    const qaAccountId = createParam('accounts/qa', defaultConfig.qaAccountId);
    const prodAccountId = createParam('accounts/prod', defaultConfig.prodAccountId);
    const region = createParam('region', defaultConfig.region);
    const apiDomainName = createParam('api/domainName', defaultConfig.apiDomainName);
    const apiSubdomainName = createParam('api/subdomainName', defaultConfig.apiSubdomainName);

    // Return the configuration object with the actual values
    return {
        stackName: 'gen-ai-mayan-translator-functions',
        apiDomainName,
        apiSubdomainName,
        accounts: {
            dev: devAccountId,
            qa: qaAccountId,
            prod: prodAccountId
        },
        region
    };
};

// Function to get configuration (for use in other stacks)
export const getConfiguration = (): Configuration => {
    // For other stacks, we'll use the default values or environment variables
    // The actual values will be passed as props from the main stack
    return {
        stackName: 'gen-ai-mayan-translator-functions',
        apiDomainName: process.env.PARAM_API_DOMAINNAME || defaultConfig.apiDomainName,
        apiSubdomainName: process.env.PARAM_API_SUBDOMAINNAME || defaultConfig.apiSubdomainName,
        accounts: {
            dev: process.env.PARAM_ACCOUNTS_DEV || defaultConfig.devAccountId,
            qa: process.env.PARAM_ACCOUNTS_QA || defaultConfig.qaAccountId,
            prod: process.env.PARAM_ACCOUNTS_PROD || defaultConfig.prodAccountId
        },
        region: process.env.PARAM_REGION || defaultConfig.region
    };
};

// Function to create all parameters and return the configuration
export const setupParametersAndGetConfig = (scope: Construct): Configuration => {
    return createParameters(scope);
};
