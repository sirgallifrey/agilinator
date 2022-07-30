import { Duration } from "aws-cdk-lib";
import { LambdaIntegration, LambdaIntegrationOptions } from "aws-cdk-lib/aws-apigateway";
import { Architecture, Code, Function, FunctionProps, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { join } from "path";
import { getFnFullPath } from "./fn_assets_path";
export interface LambdaIntegrationFactoryProps {
    integrationOptions?: Partial<LambdaIntegrationOptions>,
    functionProps?: Partial<FunctionProps>
}

export interface LambdaIntegrationFactoryCreateProps extends LambdaIntegrationFactoryProps {
    id: string,
    codePath: string,
    timeoutSeconds?: number
}

export class LambdaIntegrationFactory {
    private readonly context: Construct;
    private readonly props: Required<LambdaIntegrationFactoryProps>
    constructor(context: Construct, props?: LambdaIntegrationFactoryProps) {
        this.context = context;
        this.props = this.getPropsObj(props);
    }

    private getPropsObj(props?: LambdaIntegrationFactoryProps): Required<LambdaIntegrationFactoryProps> {
        return {
            integrationOptions: props?.integrationOptions || {},
            functionProps: props?.functionProps || {}
        };
    }

    create(props: LambdaIntegrationFactoryCreateProps) {
        const createProps = this.getPropsObj(props);

        return new LambdaIntegration(
            new Function(this.context, props.id, {
                runtime: Runtime.PROVIDED_AL2,
                code: Code.fromAsset(join(getFnFullPath(props.codePath), "bootstrap.zip")),
                handler: "bootstrap",
                architecture: Architecture.ARM_64,
                timeout: Duration.seconds(props.timeoutSeconds || 5),
                ...this.props.functionProps,
                ...createProps.functionProps
            }),
            {
                ...this.props.integrationOptions,
                ...createProps.integrationOptions
            }
        )
    }
}