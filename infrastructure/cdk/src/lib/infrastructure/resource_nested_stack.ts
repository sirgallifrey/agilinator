import { NestedStack, NestedStackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
    IRestApi,
    Method,
    MethodOptions,
    Resource,
    ResourceOptions,
    ResourceProps,
    RestApi,
} from "aws-cdk-lib/aws-apigateway";
import {
    LambdaIntegrationFactory,
    LambdaIntegrationFactoryCreateProps,
    LambdaIntegrationFactoryProps,
} from "./lambda_integration_factory";

export interface ResourceNestedStackProps extends NestedStackProps {
    readonly restApiId: string;

    readonly rootResourceId: string;

    readonly id: string;

    readonly resourcePath: string;
}

export interface AddLambdaOptions extends LambdaIntegrationFactoryCreateProps {
    parentResource?: Resource;
    resourceOptions?: ResourceOptions;
    methodOptions?: MethodOptions;
}

export class ResourceNestedStack extends NestedStack {
    public readonly methods: Method[] = [];
    public readonly api: IRestApi;

    public readonly resourcePath: string;

    protected readonly stackResource: Resource;

    protected lambdaIntegrationFactory: LambdaIntegrationFactory;

    constructor(scope: Construct, props: ResourceNestedStackProps) {
        super(scope, props.id, props);

        // TODO: Should this "RestApi" he hardcoded?
        this.api = RestApi.fromRestApiAttributes(this, "RestApi", {
            restApiId: props.restApiId,
            rootResourceId: props.rootResourceId,
        });

        this.resourcePath = props.resourcePath;

        this.stackResource = this.api.root.addResource(this.resourcePath);

        this.createLambdaIntegrationFactory();
    }

    createLambdaIntegrationFactory(props?: LambdaIntegrationFactoryProps) {
        this.lambdaIntegrationFactory = new LambdaIntegrationFactory(this, props);
    }

    addResource(id: string, props?: ResourceOptions): Resource {
        return this.stackResource.addResource(id, props);
    }

    addLambda(method: string, resource: string, options: AddLambdaOptions): Method {
        const { parentResource, resourceOptions, methodOptions, ...lambdaIntegrationOptions } = options;
        const resourceInstance = parentResource || this.stackResource;

        return resourceInstance
            .addResource(resource, resourceOptions)
            .addMethod(method, this.lambdaIntegrationFactory.create(lambdaIntegrationOptions), methodOptions);
    }
}
