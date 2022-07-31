const channels = {
  email: "email",
  sms: "sms",
  slack: "slack",
};

export type NotificationChannel = keyof typeof channels;
