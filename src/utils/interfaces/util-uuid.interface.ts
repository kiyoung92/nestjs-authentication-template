export interface UuidUtils {
  readonly v1: () => string;
  readonly v4: () => string;
  readonly randomNumericString: () => string;
}
