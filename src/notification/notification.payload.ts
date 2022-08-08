import { Attachment } from "./attachment";

export interface NotificationPayload {
  context?: unknown;
}

export interface EmailNotificationPayload extends NotificationPayload {
  from: string;
  to: string | string[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  attachments?: Attachment;
}

export interface SmsNotificationPayload extends NotificationPayload {
  from: string;
  to: string;
}

export interface SlackNotificationPayload extends NotificationPayload {
  slackChannelId?: string;
  slackUserId?: string;
}
