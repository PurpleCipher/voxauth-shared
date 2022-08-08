import axios from "axios";
import { NotificationType } from "./notification.type";
import { UserNotificationTopic } from "./topics";
import { sendNotifications } from "./send-notification";
import SpyInstance = jest.SpyInstance;

jest.mock("axios");

describe("Send Notification", () => {
  const port = 303030;
  const clientName = "test";
  let notification: NotificationType | NotificationType[];
  let spy: SpyInstance;

  describe("Sending notification", () => {
    describe("Multiple notifications", () => {
      beforeEach(async () => {
        spy = jest.spyOn(axios, "post").mockResolvedValue({});
        notification = {
          topic: UserNotificationTopic.USER_ONBOARDED,
          channel: "sms",
          payload: {
            to: "1234",
            from: "1234",
          },
        };
        await sendNotifications(clientName, port, [notification, notification]);
      });

      it("should call axios once", () => {
        expect(spy).toBeCalledTimes(2);
      });
    });

    describe("Single notification", () => {
      beforeEach(async () => {
        spy = jest.spyOn(axios, "post").mockResolvedValue({});
        notification = {
          topic: UserNotificationTopic.USER_ONBOARDED,
          channel: "sms",
          payload: {
            to: "1234",
            from: "1234",
          },
        };
        await sendNotifications(clientName, port, notification);
      });

      it("should call spy with notification", () => {
        expect(spy).toBeCalledWith(
          `http://localhost:${port}/v1.0/publish/${clientName}/${UserNotificationTopic.USER_ONBOARDED}`,
          notification
        );
      });

      it("should call axios once", () => {
        expect(spy).toBeCalledTimes(1);
      });
    });
  });
});
