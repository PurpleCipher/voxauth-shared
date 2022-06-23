/* eslint-disable */
import * as Winston from "winston";
import "winston-daily-rotate-file";
import path from "path";

export type LogConfig = {
  datePattern?: string;
  zippedArchive?: boolean;
  maxSize: string;
  maxFiles?: string;
};

const baseRotationTransport = {
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
};

export function setupLogging(
  errorPath?: string,
  logPath?: string,
  config: LogConfig = baseRotationTransport
): void {
  const dailyErrorLogger = new Winston.transports.DailyRotateFile({
    filename: path.join(__dirname, errorPath ?? "../logs/error.log"),
    level: "error",
    ...config,
  });

  const dailyCombinedLogger = new Winston.transports.DailyRotateFile({
    filename: path.join(__dirname, logPath ?? "../logs/combined.log"),
    ...config,
  });

  const winston = Winston.createLogger({
    transports: [dailyErrorLogger, dailyCombinedLogger],
  });

  if (process.env.NODE_ENV !== "production") {
    winston.add(
      new Winston.transports.Console({
        format: Winston.format.combine(
          Winston.format.colorize(),
          Winston.format.simple()
        ),
      })
    );
  }
  console.log = (message, meta?: any[]) => {
    winston.info(message, meta);
  };

  console.warn = (message, meta?: any[]) => {
    winston.warn(message, meta);
  };

  console.info = (message, meta?: any[]) => {
    winston.info(message, meta);
  };

  console.error = (message, meta?: any[]) => {
    winston.error(message, meta);
  };
}
