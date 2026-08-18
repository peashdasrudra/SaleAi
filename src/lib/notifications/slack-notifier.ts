import { NotificationProvider, NotificationMessage } from './notification-interface';

export class SlackNotifier implements NotificationProvider {
  async send(message: NotificationMessage): Promise<boolean> {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) return false;

    try {
      const blocks: any[] = [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${message.title}*\n${message.body}`,
          },
        },
      ];

      if (message.url) {
        blocks.push({
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Details',
              },
              url: message.url,
            },
          ],
        });
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blocks }),
      });

      if (!response.ok) {
        console.error('[SlackNotifier] Error response:', await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error('[SlackNotifier] Failed to send message', error);
      return false;
    }
  }
}
