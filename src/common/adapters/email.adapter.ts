import nodemailer from 'nodemailer';
import {IOAuthManager} from "../managers/gmail.oauth.manager";

export interface IEmailAdapter {
    sendEmail(to: string, subject: string, html: string): Promise<boolean>;
}

export class EmailAdapter implements IEmailAdapter {
    private transporter: nodemailer.Transporter | null = null;

    constructor(
        private readonly gmailUser: string,
        private readonly oAuthManager: IOAuthManager
    ) {}

    private async createTransporter(): Promise<nodemailer.Transporter> {
        try {
            const accessToken = await this.oAuthManager.getValidAccessToken();

            return nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: this.gmailUser,
                    accessToken
                }
            });
        } catch (error) {
            console.error('Failed to create email transporter:', error);
            throw error;
        }
    }

    async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
        try {
            this.transporter = await this.createTransporter();

            if (!this.transporter) {
                throw new Error('Failed to create transporter');
            }

            await this.transporter.sendMail({
                from: `${this.gmailUser}`,
                to,
                subject,
                html
            });

            this.transporter.close();
            return true;
        } catch (error) {
            console.error('Failed to send email:', error);
            return false;
        }
    }
}