// Get configuration from environment variables or CDK context
import {Configuration} from "./types";

export const getConfig = (): Configuration => {
    const config = {
        stackName: 'gen-ai-mayan-translator-functions',
        apiDomainName: process.env.PARAM_API_DOMAINNAME,
        apiSubdomainName: process.env.PARAM_API_SUBDOMAINNAME,
        accounts: {
            dev: process.env.PARAM_ACCOUNTS_DEV,
            qa: process.env.PARAM_ACCOUNTS_QA,
            prod: process.env.PARAM_ACCOUNTS_PROD
        },
        region: process.env.PARAM_REGION
    };

    // Log the configuration being used
    console.log('Using configuration:', JSON.stringify(config, null, 2));

    return config;
};
