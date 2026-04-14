import type { ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class CloudBeaverApi implements ICredentialType {
    name: string;
    displayName: string;
    icon: {
        readonly light: "file:icons/CloudBeaver.svg";
        readonly dark: "file:icons/CloudBeaver.svg";
    };
    documentationUrl: string;
    properties: INodeProperties[];
}
