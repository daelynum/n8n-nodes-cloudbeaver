import type { AuthPayload, IAuthProvider } from '../../helpers/interfaces';
export declare class TokenAuthProvider implements IAuthProvider {
    private readonly token;
    constructor(token: string);
    getPayload(): AuthPayload;
}
