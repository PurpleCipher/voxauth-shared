import { NotificationChannel } from "./channels";
import {
  EmailNotificationPayload,
  NotificationPayload,
  SlackNotificationPayload,
  SmsNotificationPayload,
} from "./notification.payload";
import { NotificationTopic } from "./topics";

interface Notification<T extends NotificationPayload> {
  payload: T;
  channel: NotificationChannel;
  topic: NotificationTopic;
}

interface EmailNotification extends Notification<EmailNotificationPayload> {
  channel: "email";
}

interface SmsNotification extends Notification<SmsNotificationPayload> {
  channel: "sms";
}

interface SlackNotification extends Notification<SlackNotificationPayload> {
  channel: "slack";
}

export type NotificationType =
  | EmailNotification
  | SmsNotification
  | SlackNotification;
