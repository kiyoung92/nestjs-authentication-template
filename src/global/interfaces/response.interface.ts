export interface GlobalResponseType {
  readonly success: <DataType>({
    statusCode,
    message,
    data,
  }: ResponseSuccessParams<DataType>) => ResponseSuccess<DataType>;
  readonly exception: ({
    statusCode,
    message,
  }: ResponseExceptionParams) => ResponseException;
  readonly error: ({
    statusCode,
    message,
  }: ResponseErrorParams) => ResponseError;
}

export interface ResponseSuccessParams<DataType> {
  readonly statusCode: number;
  readonly message: string;
  readonly data?: DataType;
}

export interface ResponseSuccess<DataType> {
  readonly statusCode: number;
  readonly status: 'success';
  readonly message: string;
  readonly data?: DataType;
  readonly timestamp: string;
}

export interface ResponseExceptionParams {
  readonly statusCode: number;
  readonly message: string;
}

export interface ResponseException {
  statusCode: number;
  readonly status: 'exception';
  message: string;
  readonly timestamp: string;
}

export interface ResponseErrorParams {
  readonly statusCode: number;
  readonly message: string;
}

export interface ResponseError {
  statusCode: number;
  readonly status: 'error';
  message: string;
  readonly timestamp: string;
}
