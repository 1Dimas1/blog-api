import {GmailOAuthAdapter} from "../common/adapters/gmail.oauth.adapter";
import {GmailOAuthManager, IOAuthManager} from "../common/managers/gmail.oauth.manager";

const oAuthCredentials = {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN!
};

const oAuthAdapter = new GmailOAuthAdapter(oAuthCredentials);
const oAuthManager: IOAuthManager = new GmailOAuthManager(oAuthAdapter);

export const oAuthComposition = {
    getOAuthManager: () => oAuthManager
} as const;