import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

export type DBConnection = mongoose.Connection;
export type DBModel<T> = mongoose.Model<T>;
export type DBPaginateModel<T> = mongoose.PaginateModel<T>;
export type DBConnectOptions = mongoose.ConnectOptions;
export type DBConnectionStates = mongoose.ConnectionStates;

export const types = { paginate, mongoose };
