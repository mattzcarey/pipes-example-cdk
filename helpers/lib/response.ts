export interface Response {
  statusCode: number;
  body: string;
}

export const errorResponse = (message?: string): Response => ({
  statusCode: 400,
  body: message ?? 'Bad Request',
});

export const successResponse = (message?: string): Response => ({
  statusCode: 200,
  body: message ?? 'OK',
});

export const internalErrorResponse = (message?: string): Response => ({
  statusCode: 500,
  body: message ?? 'Internal Server Error',
});
