export interface NotificationMessage {
  title: string;
  body: string;
  url?: string;
  priority?: 'low' | 'normal' | 'high';
}

export interface NotificationProvider {
  send(message: NotificationMessage): Promise<boolean>;
}
