import mongoose from "mongoose";
import {
  DBConnection,
  DBConnectionStates,
  DBConnectOptions,
} from "../../types";

export interface DBConfig {
  isMultiTenant: boolean;
  dbUrl: string;
}

export class DB {
  private static instance: DB;

  private readonly dbUrl?: string;

  private connections: Record<string, DBConnection> = {};

  connection?: DBConnection;

  private readonly dbOptions: DBConnectOptions = {
    autoIndex: true,
    autoCreate: true,
  };

  private constructor(dbUrl?: string) {
    this.dbUrl = dbUrl;
  }

  public static getInstance(dbUrl?: string): DB {
    if (!DB.instance) {
      DB.instance = new DB(dbUrl);
    }
    if (!!dbUrl && DB.instance.dbUrl !== dbUrl) {
      DB.instance = new DB(dbUrl);
    }
    return DB.instance;
  }

  private createConnection(tenantId: string): DBConnection {
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
    this.getConnectionByTenantId(tenantId);
  }

  public getConnection(): DBConnection {
    if (!this.connection) {
      return new mongoose.Connection();
    }
    return this.connection;
  }

  public getConnectionByTenantId(tenantId: string): DBConnection {
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

  private getConnectionStatuses(): Record<string, DBConnectionStates> {
    return Object.entries(this.connections).reduce(
      (acc: Record<string, DBConnectionStates>, [tenantId, connection]) => {
        acc[tenantId] = connection.readyState;
        return acc;
      },
      {}
    );
  }
}
