import {IEmailAdapter} from "../adapters/email.adapter";

export interface IEmailManager {
    sendConfirmationEmail(email: string, confirmationCode: string): Promise<boolean>;
}

export class EmailManager {
    constructor(private readonly emailAdapter: IEmailAdapter) {}

    async sendConfirmationEmail(email: string, confirmationCode: string): Promise<boolean> {
        const subject = 'Please confirm your email';
        const confirmationLink = `https://somesite.com/confirm-email?code=${confirmationCode}`;

        const html = `
            <h1>Thank you for registration</h1>
            <p>To finish registration please follow the link below:
            <a href="${confirmationLink}">complete registration</a>
            </p>
        `;

        return this.emailAdapter.sendEmail(email, subject, html);
    }
}