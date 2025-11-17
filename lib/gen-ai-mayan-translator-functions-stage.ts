import {Stage, StageProps} from "aws-cdk-lib";
import {Configuration, Environment} from "../config/types";
import {Construct} from "constructs";
import {GenAiMayanTranslatorFunctionsAppStack} from "./gen-ai-mayan-translator-functions-app-stack";

interface GenAiMayanTranslatorFunctionsStageProps extends StageProps{
    environment: Environment,
    configuration: Configuration
}

export class GenAiMayanTranslatorFunctionsStage extends Stage{
    constructor(scope: Construct, id: string, props: GenAiMayanTranslatorFunctionsStageProps){
        super(scope, id, props);

        const genAiMayanTranslatorFunctionsStack = new GenAiMayanTranslatorFunctionsAppStack(this, 'GenAiMayanTranslatorFunctionsStack', {

        })
    }
}
