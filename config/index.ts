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
    // Create parameters with default values if they don't exist
    const createParam = (name: string, defaultValue: string): string => {
        const paramName = `/gen-ai-mayan/${name}`;
        try {
            // Try to get existing parameter
            return StringParameter.valueForStringParameter(scope, paramName);
        } catch (e) {
            // If parameter doesn't exist, create it
            new StringParameter(scope, `Param${name.replace(/[^a-zA-Z0-9]/g, '')}`, {
                parameterName: paramName,
                stringValue: process.env[`PARAM_${name.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`] || defaultValue,
                description: `Parameter for ${name}`
            });
            return paramName;
        }
    };

    return {
        devAccountId: createParam('accounts/dev', defaultConfig.devAccountId),
        qaAccountId: createParam('accounts/qa', defaultConfig.qaAccountId),
        prodAccountId: createParam('accounts/prod', defaultConfig.prodAccountId),
        region: createParam('region', defaultConfig.region),
        apiDomainName: createParam('api/domainName', defaultConfig.apiDomainName),
        apiSubdomainName: createParam('api/subdomainName', defaultConfig.apiSubdomainName)
    };
};

// Function to get configuration (for use in stacks)
export const getConfiguration = (scope: Construct): Configuration => {
    // Get parameter value or fall back to environment variable or default
    const getParam = (name: string, defaultValue: string): string => {
        try {
            return StringParameter.valueForStringParameter(scope, `/gen-ai-mayan/${name}`);
        } catch (e) {
            // Fall back to environment variable or default
            return process.env[`PARAM_${name.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`] || defaultValue;
        }
    };

    return {
        stackName: 'gen-ai-mayan-translator-functions',
        apiDomainName: getParam('api/domainName', defaultConfig.apiDomainName),
        apiSubdomainName: getParam('api/subdomainName', defaultConfig.apiSubdomainName),
        accounts: {
            dev: getParam('accounts/dev', defaultConfig.devAccountId),
            qa: getParam('accounts/qa', defaultConfig.qaAccountId),
            prod: getParam('accounts/prod', defaultConfig.prodAccountId)
        },
        region: getParam('region', defaultConfig.region)
    };
};
