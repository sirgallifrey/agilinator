import { Construct } from "constructs";
import { ResourceNestedStack, ResourceNestedStackProps } from "../infrastructure/resource_nested_stack";

export class SRVUserStack extends ResourceNestedStack {
    constructor(scope: Construct, props: ResourceNestedStackProps) {
        super(scope, props);

        const v1 = this.addResource("v1");

        const signup = this.addLambda("GET", "signup", {
            parentResource: v1,
            id: "FNCreateUser",
            codePath: "fn_create_user",
        });

        this.methods.push(signup);
    }
}
