import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class CloudBeaver implements INodeType {
    description: INodeTypeDescription;
    methods: {
        credentialTest: {
            cloudBeaverApiTest: typeof import("./methods/credentialTest").cloudBeaverApiTest;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
