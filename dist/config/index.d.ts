import type { SignOptions } from "jsonwebtoken";
declare const config: {
    connection_string: string;
    port: string | undefined;
    secret: string | undefined;
    refresh_secret: string | undefined;
    node_env: string | undefined;
    access_expires_in: SignOptions["expiresIn"];
    refresh_expires_in: SignOptions["expiresIn"];
};
export default config;
//# sourceMappingURL=index.d.ts.map