import { NotificationProvider, NotificationMessage } from './notification-interface';
import { EmailNotifier } from './email-notifier';
import { TelegramNotifier } from './telegram-notifier';
import { SlackNotifier } from './slack-notifier';

export function getNotificationProviders(): NotificationProvider[] {
  const providers: NotificationProvider[] = [];
  
  if (process.env.NOTIFICATION_EMAIL) {
    providers.push(new EmailNotifier());
  }
  
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    providers.push(new TelegramNotifier());
  }
  
  if (process.env.SLACK_WEBHOOK_URL) {
    providers.push(new SlackNotifier());
  }
  
  return providers;
}

export async function sendNotification(message: NotificationMessage): Promise<void> {
  const providers = getNotificationProviders();
  if (providers.length === 0) {
    console.warn('[Notifications] No notification providers configured.');
    return;
  }
  
  await Promise.allSettled(providers.map(p => p.send(message)));
}
