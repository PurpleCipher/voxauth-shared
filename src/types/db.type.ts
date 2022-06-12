import mongoose from "mongoose";

export type DBConnection = mongoose.Connection;
export type DBModel<T> = mongoose.Model<T>;
export type DBConnectOptions = mongoose.ConnectOptions;
export type DBConnectionStates = mongoose.ConnectionStates;
