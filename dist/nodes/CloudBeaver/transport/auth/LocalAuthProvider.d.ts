import type { AuthPayload, IAuthProvider } from '../../helpers/interfaces';
export declare class LocalAuthProvider implements IAuthProvider {
    private readonly user;
    private readonly password;
    constructor(user: string, password: string);
    getPayload(): AuthPayload;
}
