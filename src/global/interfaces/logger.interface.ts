export interface ShowLoggerParams {
  readonly color: string;
  readonly type: string;
  readonly message: any;
  readonly logColor: string;
}

export interface GlobalLogger {
  readonly info: (message: any) => void;
  readonly error: (message: any) => void;
  readonly warn: (message: any) => void;
  readonly debug: (message: any) => void;
  readonly data: (message: any) => void;
  readonly prisma: (message: any) => void;
  readonly redis: (message: any) => void;
}
