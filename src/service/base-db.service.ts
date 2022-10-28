import mongoose from "mongoose";
import {
  DBConnection,
  DBDocument,
  DBModel,
  DBPaginateModel,
  DBSchema,
} from "../types";
import { DBService } from "./db.service";
import { DB } from "../utility";
import { InitService } from "./init.service";

export abstract class BaseDbService<T extends DBDocument>
  implements DBService<T>, InitService
{
  database: DB;

  connection?: DBConnection;

  model?: DBModel<T> | DBPaginateModel<T>;

  schema: DBSchema;

  abstract maxDbRetries: number;

  protected constructor(database: DB, schema: DBSchema, private name: string) {
    this.database = database;
    this.schema = schema;
  }

  private async getConnectionState(): Promise<
    mongoose.ConnectionStates | undefined
  > {
    return this.connection?.readyState;
  }

  async init(isMultiTenant: boolean, tenantId?: string): Promise<void> {
    this.connection = this.getDbConnection(tenantId);
    try {
      this.model = this.getModel(this.name, this.schema);
    } catch (e) {
      return;
    }
    let called = 0;
    let connectionState = await this.getConnectionState();
    while (connectionState !== 1 && called < this.maxDbRetries - 1) {
      console.log("Waiting for database connection...");
      called += 1;
      connectionState = await this.getConnectionState();
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
    if (connectionState !== 1) {
      throw new Error("Connection could not be established");
    }

    console.log("Database connection established");
  }

  getDbConnection(tenantId: string = "default"): DBConnection {
    return this.database.getConnectionByTenantId(tenantId);
  }

  getModel(name: string, schema: DBSchema): DBModel<T> | DBPaginateModel<T> {
    if (!this.connection) {
      throw new Error("Database connection is not initialized");
    }
    return this.connection.model(name, schema);
  }
}
