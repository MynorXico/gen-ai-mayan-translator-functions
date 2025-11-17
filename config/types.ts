export enum Environment {
    DEV = 'dev',
    QA = 'qa',
    PROD = 'prod'
}

export type Configuration = {
    stackName: string;
    apiDomainName: string;
    apiSubdomainName: string;
    accounts: {
        dev: string;
        qa: string;
        prod: string;
    },
    region: string
}
