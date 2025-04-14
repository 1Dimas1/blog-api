export interface IEmailTemplateManager {
    getConfirmationEmailTemplate(confirmationCode: string): { subject: string; html: string };
    getPasswordRecoveryEmailTemplate(recoveryCode: string): { subject: string; html: string };
}

export class EmailTemplateManager implements IEmailTemplateManager {
    getConfirmationEmailTemplate(confirmationCode: string): { subject: string; html: string } {
        const subject = 'Please confirm your email';
        const confirmationLink = `https://somesite.com/confirm-email?code=${confirmationCode}`;

        const html = `
            <h1>Thank you for registration</h1>
            <p>To finish registration please follow the link below:
            <a href="${confirmationLink}">complete registration</a>
            </p>
        `;

        return { subject, html };
    }

    getPasswordRecoveryEmailTemplate(recoveryCode: string): { subject: string; html: string } {
        const subject = 'Password Recovery';
        const recoveryLink = `https://somesite.com/password-recovery?recoveryCode=${recoveryCode}`;

        const html = `
            <h1>Password Recovery</h1>
            <p>To set a new password please follow the link below:
            <a href="${recoveryLink}">recovery password</a>
            </p>
        `;

        return { subject, html };
    }
}