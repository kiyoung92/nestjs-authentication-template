import {
  GlobalResponseType,
  ResponseError,
  ResponseErrorParams,
  ResponseException,
  ResponseExceptionParams,
  ResponseSuccess,
  ResponseSuccessParams,
} from 'src/global/interfaces/response.interface';

export const GlobalResponse: GlobalResponseType = Object.freeze({
  success: <DataType>({
    statusCode,
    message,
    data,
  }: ResponseSuccessParams<DataType>): ResponseSuccess<DataType> => {
    return {
      statusCode,
      status: 'success',
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  },
  exception: ({
    statusCode,
    message,
  }: ResponseExceptionParams): ResponseException => {
    return {
      statusCode,
      status: 'exception',
      message,
      timestamp: new Date().toISOString(),
    };
  },
  error: ({ statusCode, message }: ResponseErrorParams): ResponseError => {
    return {
      statusCode,
      status: 'error',
      message,
      timestamp: new Date().toISOString(),
    };
  },
});
