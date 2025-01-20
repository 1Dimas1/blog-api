import {oAuthComposition} from "./oauth.composition";
import {EmailManager, IEmailManager} from "../common/managers/email.manager";
import {EmailAdapter} from "../common/adapters/email.adapter";

const emailAdapter = new EmailAdapter(
    process.env.GMAIL_USER!,
    oAuthComposition.getOAuthManager()
);

const emailManager: IEmailManager = new EmailManager(emailAdapter);

export const emailComposition = {
    getEmailManager: ()  => emailManager
} as const;