export class ApiResponseDto<T> {
  status: string;

  statusCode: number;

  message: string;

  data?: T;

  timestamp: string;
}
