import * as mongoose from "mongoose";
import { ConnectOptions } from "mongoose";

export interface DBConfig {
  isMultiTenant: boolean;
  dbUrl: string;
}

export class DB {
  private static instance: DB;

  private readonly dbUrl?: string;

  private connections: Record<string, mongoose.Connection> = {};

  private readonly dbOptions: ConnectOptions = {
    autoIndex: true,
    autoCreate: true,
  };

  private constructor(dbUrl: string) {
    this.dbUrl = dbUrl;
  }

  public static getInstance(dbUrl: string): DB {
    if (!DB.instance) {
      DB.instance = new DB(dbUrl);
    }
    if (DB.instance.dbUrl !== dbUrl) {
      DB.instance = new DB(dbUrl);
    }
    return DB.instance;
  }

  private createConnection(tenantId: string): mongoose.Connection {
    return mongoose.createConnection(
      `${this.dbUrl}/${tenantId}?retryWrites=true&w=majority`,
      this.dbOptions
    );
  }

  private async ping() {
    await mongoose.connect(
      `${this.dbUrl}?connectTimeoutMS=1000`,
      this.dbOptions
    );
  }

  public connect(dbName: string) {
    return mongoose.connect(
      `${this.dbUrl}/${dbName}?retryWrites=true&w=majority`,
      this.dbOptions
    );
  }

  public openConnection(tenantId: string) {
    this.getConnection(tenantId);
  }

  public getConnection(tenantId: string): mongoose.Connection {
    let connection = this.connections[tenantId];
    if (!connection) {
      console.error(`Connection to ${tenantId} is not initialized`);
      connection = this.createConnection(tenantId);
      this.connections[tenantId] = connection;
    }
    return connection;
  }

  public async getHealth(): Promise<"ok" | "unhealthy"> {
    const connectionStatuses = this.getConnectionStatuses();
    if (Object.values(connectionStatuses).length === 0) {
      try {
        await this.ping();
        return "ok";
      } catch (e) {
        console.error(e);
        return "unhealthy";
      }
    }
    if (
      Object.values(connectionStatuses).every(
        (status) => status !== mongoose.ConnectionStates.connected
      )
    ) {
      return "unhealthy";
    }
    return "ok";
  }

  private getConnectionStatuses(): Record<string, mongoose.ConnectionStates> {
    return Object.entries(this.connections).reduce(
      (
        acc: Record<string, mongoose.ConnectionStates>,
        [tenantId, connection]
      ) => {
        acc[tenantId] = connection.readyState;
        return acc;
      },
      {}
    );
  }
}
