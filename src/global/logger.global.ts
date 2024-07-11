import { Injectable, LoggerService } from '@nestjs/common';
import {
  GlobalLogger,
  ShowLoggerParams,
} from 'src/global/interfaces/logger.interface';

// 로거 색상
const FgBlack = '\x1b[30m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';
const FgGray = '\x1b[90m';
const BgBlack = '\x1b[40m';
const BgRed = '\x1b[41m';
const BgGreen = '\x1b[42m';
const BgYellow = '\x1b[43m';
const BgBlue = '\x1b[44m';
const BgMagenta = '\x1b[45m';
const BgCyan = '\x1b[46m';
const BgWhite = '\x1b[47m';
const BgGray = '\x1b[100m';
const Reset = '\x1b[0m';
const Bright = '\x1b[1m';
const Dim = '\x1b[2m';
const Underscore = '\x1b[4m';
const Blink = '\x1b[5m';
const Reverse = '\x1b[7m';
const Hidden = '\x1b[8m';

@Injectable()
export class CustomLogger implements LoggerService {
  log(message: any, optionalParams: any[]): any {
    this.showLogs({
      color: FgGray,
      logColor: FgGray,
      type: `[LOG] ►`,
      message: `[${optionalParams}] ${message}`,
    });
  }

  error(message: any, ...optionalParams: any[]): any {
    this.showLogs({
      color: FgRed,
      logColor: FgRed,
      type: `[ERROR] ►`,
      message: `[${optionalParams}] ${message}`,
    });
  }

  warn(message: any, ...optionalParams: any[]): any {
    this.showLogs({
      color: FgYellow,
      logColor: FgYellow,
      type: `[WARN] ►`,
      message: `[${optionalParams}] ${message}`,
    });
  }

  debug(message: any, ...optionalParams: any[]): any {
    this.showLogs({
      color: FgMagenta,
      logColor: FgMagenta,
      type: `[DEBUG] ►`,
      message: `[${optionalParams}] ${message}`,
    });
  }

  verbose(message: any, ...optionalParams: any[]): any {
    this.showLogs({
      color: FgWhite,
      logColor: FgWhite,
      type: `[VERBOSE] ►`,
      message: `[${optionalParams}] ${message}`,
    });
  }

  showLogs({ color, type, message, logColor }: ShowLoggerParams): void {
    const offset = new Date().getTimezoneOffset() * 60000;
    const today = new Date(Date.now() - offset).toISOString();
    const messageType = typeof message;
    if (messageType === 'object') {
      console.log(
        `${color}%s\x1b[0m ${logColor}%s %s\x1b[0m`,
        type,
        `${today}`,
        `${JSON.stringify(message, null, 2)}`,
      );
    } else
      console.log(
        `${color}%s\x1b[0m ${logColor}%s %s\x1b[0m`,
        type,
        `${today}`,
        `${message}`,
      );
  }
}

export const logger: GlobalLogger = Object.freeze({
  info: (message: any) => {
    showLogs({ color: FgGray, logColor: FgGray, type: `[INFO] ►`, message });
  },
  error: (message: any) => {
    showLogs({ color: FgRed, logColor: FgRed, type: `[ERROR] ►`, message });
  },
  warn: (message: any) => {
    showLogs({
      color: FgYellow,
      logColor: FgYellow,
      type: `[WARN] ►`,
      message,
    });
  },
  debug: (message: any) => {
    showLogs({ color: FgBlue, logColor: FgBlue, type: `[DEBUG] ►`, message });
  },
  data: (message: any) => {
    showLogs({
      color: FgMagenta,
      logColor: FgMagenta,
      type: `[DATA] ►`,
      message,
    });
  },
  prisma: (message: any) => {
    showLogs({ color: FgCyan, logColor: FgCyan, type: `[PRISMA] ►`, message });
  },
  redis: (message: any) => {
    showLogs({ color: FgGreen, logColor: FgGreen, type: `[REDIS] ►`, message });
  },
});

function showLogs({ color, logColor, type, message }: ShowLoggerParams): void {
  const offset = new Date().getTimezoneOffset() * 60000;
  const today = new Date(Date.now() - offset).toISOString();
  const messageType = typeof message;

  if (messageType === 'object') {
    if (Object.keys(message).length > 1) {
      console.log(message);

      return;
    }

    console.log(
      `${color}%s\x1b[0m ${logColor}%s %s\x1b[0m`,
      type,
      `${today} |`,
      `${JSON.stringify(message, null, 2)}`,
    );
  } else {
    console.log(
      `${color}%s\x1b[0m ${logColor}%s %s\x1b[0m`,
      type,
      `${today} |`,
      `${message}`,
    );
  }
}
