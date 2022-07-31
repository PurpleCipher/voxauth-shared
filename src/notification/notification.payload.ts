export interface NotificationPayload {}

export interface EmailNotificationPayload extends NotificationPayload {
  subject: string;
  from: string;
  to: string;
  message?: string;
  html?: string;
  cc?: string[];
  bcc?: string[];
}

export interface SmsNotificationPayload extends NotificationPayload {
  from: string;
  to: string;
  message: string;
}

export interface SlackNotificationPayload extends NotificationPayload {
  slackChannelId?: string;
  slackUserId?: string;
  context: unknown;
}
