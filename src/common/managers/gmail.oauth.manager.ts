import {OAuthTokensSession} from "../types/oauth.type";
import {IOAuthAdapter} from "../adapters/gmail.oauth.adapter";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/identifiers";

export interface IOAuthManager {
    getValidAccessToken(): Promise<string>;
}

@injectable()
export class GmailOAuthManager implements IOAuthManager {
    private tokenSession: OAuthTokensSession | null = null;

    constructor(@inject(TYPES.IOAuthAdapter)private oAuthAdapter: IOAuthAdapter) {}

    async getValidAccessToken(): Promise<string> {
        try {
            if (this.isTokenSessionValid()) {
                return this.tokenSession!.accessToken;
            }

            if (this.tokenSession) {
                return await this.refreshToken();
            }

            return await this.getNewToken();
        } catch (error) {
            console.error('Error in getValidAccessToken:', error);
            throw error;
        }
    }

    private async getNewToken(): Promise<string> {
        const accessToken = await this.oAuthAdapter.getAccessToken();
        this.updateTokenSession(accessToken);
        return accessToken;
    }

    private async refreshToken(): Promise<string> {
        const accessToken = await this.oAuthAdapter.refreshAccessToken();
        this.updateTokenSession(accessToken);
        return accessToken;
    }

    private updateTokenSession(accessToken: string): void {
        this.tokenSession = {
            accessToken,
            expiresAt: new Date(Date.now() + 3600 * 1000) // OAuth tokens typically expire in 1 hour
        };
    }

    private isTokenSessionValid(): boolean {
        if (!this.tokenSession) return false;

        const bufferTime = 5 * 60 * 1000;
        return this.tokenSession.expiresAt.getTime() - bufferTime > Date.now();
    }
}