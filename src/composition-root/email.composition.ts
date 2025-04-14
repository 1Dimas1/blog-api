import {oAuthComposition} from "./oauth.composition";
import {EmailManager, IEmailManager} from "../common/managers/email.manager";
import {EmailAdapter} from "../common/adapters/email.adapter";
import {EmailTemplateManager, IEmailTemplateManager} from "../common/managers/email-template.manager";

const emailAdapter = new EmailAdapter(
    process.env.GMAIL_USER!,
    oAuthComposition.getOAuthManager()
);

const emailManager: IEmailManager = new EmailManager(emailAdapter);

export const emailComposition = {
    getEmailManager: ()  => emailManager,
    getEmailTemplateManager(): IEmailTemplateManager {
        return new EmailTemplateManager();
    }
} as const;