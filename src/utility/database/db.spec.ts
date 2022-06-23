import mongoose from "mongoose";
import { DB } from "./db";
import { DBConnection } from "../../types";

jest.createMockFromModule("mongoose");
jest.mock("mongoose");

describe("DB", () => {
  let db: DB;
  beforeEach(() => {
    console.error = () => {};
  });

  describe("sanity check", () => {
    afterEach(() => {
      // @ts-ignore
      DB["instance"] = null;
    });
    it("should set dbName", () => {
      db = DB.getInstance("test");
      expect(db["dbName"]).toBe("default");
    });

    it("should set dbUrl", () => {
      db = DB.getInstance("test", "test");
      expect(db["dbUrl"]).toBe("test");
      expect(db["dbName"]).toBe("test");
    });
  });

  describe("open connection", () => {
    describe("no existing connection", () => {
      beforeEach(() => {
        // @ts-ignore
        DB["instance"] = null;
        mongoose.createConnection = jest.fn();
        db = DB.getInstance("test", "test");
        db.openConnection("tenant-a");
      });

      it("should open mongo database connection", () => {
        expect(mongoose.createConnection).toBeCalledWith(
          "test/test_tenant-a?retryWrites=true&w=majority",
          {
            autoIndex: true,
            autoCreate: true,
          }
        );
      });
    });

    describe("existing connection", () => {
      beforeEach(() => {
        mongoose.createConnection = jest.fn();
        db = DB.getInstance("test", "test");
        db["connections"] = {
          "tenant-a": {} as DBConnection,
        };
      });
      afterEach(() => {
        // @ts-ignore
        DB["instance"] = null;
      });

      it("should not open new mongo database connection", () => {
        db.openConnection("tenant-a");
        expect(mongoose.createConnection).not.toBeCalled();
        db.openConnection("tenant-b");
        expect(mongoose.createConnection).toBeCalled();
      });
    });
  });

  describe("health check", () => {
    afterEach(() => {
      // @ts-ignore
      DB["instance"] = null;
    });
    describe("call ping when there are no connections", () => {
      it("should should ping when there are no connections", async () => {
        mongoose.connect = jest.fn();
        db = DB.getInstance();
        db["connections"] = {};

        await db.getHealth();

        expect(mongoose.connect).toBeCalledTimes(1);
      });
    });
  });
});
