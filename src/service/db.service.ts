import { DB } from "../utility";
import { DBConnection, DBDocument, DBModel, DBSchema } from "../types";
import { InitService } from "./init.service";

export interface DBService<D extends DBDocument> extends InitService {
  database: DB;
  connection?: DBConnection;
  model?: DBModel<D>;
  getDbConnection: (tenantId?: string) => DBConnection;
  getModel: (name: string, schema: DBSchema) => DBModel<D>;
  onConnect: (resolve: () => void) => void;
  onDisconnect: (resolve: () => void) => void;
  onError: (reject: () => void) => void;
}
