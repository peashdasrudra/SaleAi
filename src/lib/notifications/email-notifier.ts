import { NotificationProvider, NotificationMessage } from './notification-interface';
// Assuming a mailer service exists, otherwise utilizing standard fetch/Resend logic.
// In a real implementation, you would import your email sending utility here.

export class EmailNotifier implements NotificationProvider {
  async send(message: NotificationMessage): Promise<boolean> {
    const email = process.env.NOTIFICATION_EMAIL;
    if (!email) return false;

    try {
      const htmlBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #333;">${message.title}</h2>
          <p style="color: #555; line-height: 1.5;">${message.body}</p>
          ${message.url ? `<a href="${message.url}" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 20px;">View Details</a>` : ''}
          <p style="color: #999; font-size: 12px; margin-top: 30px;">LeadPilot System Notification</p>
        </div>
      `;

      // Mock sending logic - integration with Resend or nodemailer would go here
      console.log(`[EmailNotifier] Sending email to ${email}: ${message.title}`);
      
      // Example Resend call:
      // await resend.emails.send({ from: 'system@leadpilot.com', to: email, subject: message.title, html: htmlBody });
      
      return true;
    } catch (error) {
      console.error('[EmailNotifier] Failed to send email', error);
      return false;
    }
  }
}
