import {OAuth2Client} from "google-auth-library";
import {OAuthCredentials} from "../types/oauth.type";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/identifiers";

export interface IOAuthAdapter {
    getAccessToken(): Promise<string>;
    refreshAccessToken(): Promise<string>;
}

@injectable()
export class GmailOAuthAdapter implements IOAuthAdapter {
    private oAuth2Client: OAuth2Client;

    constructor(@inject(TYPES.OAuthCredentials) private credentials: OAuthCredentials) {
        this.oAuth2Client = new OAuth2Client(
            this.credentials.clientId,
            this.credentials.clientSecret,
            'https://developers.google.com/oauthplayground'
        );

        this.oAuth2Client.setCredentials({
            refresh_token: this.credentials.refreshToken
        });
    }

    async getAccessToken(): Promise<string> {
        try {
            const { token } = await this.oAuth2Client.getAccessToken();
            if (!token) {
                throw new Error('Failed to get access token');
            }
            return token;
        } catch (error) {
            console.error('Error getting access token:', error);
            throw error;
        }
    }

    async refreshAccessToken(): Promise<string> {
        try {
            const { credentials } = await this.oAuth2Client.refreshAccessToken();
            const { access_token } = credentials;

            if (!access_token) {
                throw new Error('Failed to refresh access token');
            }

            return access_token;
        } catch (error) {
            console.error('Error refreshing access token:', error);
            throw error;
        }
    }
}