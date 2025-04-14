import {IEmailAdapter} from "../adapters/email.adapter";

export interface IEmailManager {
    sendEmail(email: string, subject: string, html: string): Promise<boolean>;
}

export class EmailManager {
    constructor(private readonly emailAdapter: IEmailAdapter) {}

    async sendEmail(email: string, subject: string, html: string): Promise<boolean> {
        return this.emailAdapter.sendEmail(email, subject, html);
    }
}