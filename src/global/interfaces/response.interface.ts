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
  readonly error: <DataType>({
    statusCode,
    message,
  }: ResponseErrorParams<DataType>) => ResponseError<DataType>;
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

export interface ResponseErrorParams<DataType> {
  readonly statusCode: number;
  readonly message: string;
  readonly data?: DataType;
}

export interface ResponseError<DataType> {
  statusCode: number;
  readonly status: 'error';
  message: string;
  readonly data?: DataType;
  readonly timestamp: string;
}
