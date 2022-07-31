import axios, { AxiosResponse } from "axios";
import { NotificationType } from "./notification.type";

export async function sendNotifications(
  clientName: string,
  clientPort: number,
  notifications: NotificationType | NotificationType[]
) {
  let payloads: NotificationType[];
  const promises: Promise<AxiosResponse>[] = [];
  if (Array.isArray(notifications)) {
    payloads = notifications;
  } else {
    payloads = [notifications];
  }
  payloads.forEach((payload) => {
    promises.push(
      axios.post(
        `http://localhost:${clientPort}/v1.0/publish/${clientName}/${payload.topic}`,
        payload
      )
    );
  });

  await Promise.all(promises);
}
