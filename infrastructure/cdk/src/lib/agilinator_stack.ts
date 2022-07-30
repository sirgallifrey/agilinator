import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { SRVUserStack } from "./svr_user/srv_user";

export class AgilinatorStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const restApi = new RestApi(this, "agilinator", {
            deployOptions: {
                stageName: "api",
            },
        });
        restApi.root.addMethod("ANY");

        const srvUser = new SRVUserStack(this, {
            id: "SRVUserStack",
            resourcePath: "users",
            restApiId: restApi.restApiId,
            rootResourceId: restApi.restApiRootResourceId,
        });

        for (const method of srvUser.methods) {
            restApi.latestDeployment?.node.addDependency(method);
        }
    }
}
