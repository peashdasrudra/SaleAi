import { NotificationProvider, NotificationMessage } from './notification-interface';

export class TelegramNotifier implements NotificationProvider {
  async send(message: NotificationMessage): Promise<boolean> {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) return false;

    try {
      let text = `*${message.title}*\n\n${message.body}`;
      if (message.url) {
        text += `\n\n[View Details](${message.url})`;
      }

      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown',
        }),
      });

      if (!response.ok) {
        console.error('[TelegramNotifier] Error response:', await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error('[TelegramNotifier] Failed to send message', error);
      return false;
    }
  }
}
