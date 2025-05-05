export type OAuthCredentials = {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
}

export type OAuthTokensSession = {
    accessToken: string;
    expiresAt: Date;
}