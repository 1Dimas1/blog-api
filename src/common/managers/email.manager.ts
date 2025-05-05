import {IEmailAdapter} from "../adapters/email.adapter";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/identifiers";

export interface IEmailManager {
    sendEmail(email: string, subject: string, html: string): Promise<boolean>;
}

@injectable()
export class EmailManager {
    constructor(@inject(TYPES.IEmailAdapter) private readonly emailAdapter: IEmailAdapter) {}

    async sendEmail(email: string, subject: string, html: string): Promise<boolean> {
        return this.emailAdapter.sendEmail(email, subject, html);
    }
}