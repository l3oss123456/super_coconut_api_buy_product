export interface ResponseTemplate {
  code: number;
  description: string;
  error?: any;
  data?: any;
}

export interface SuccessResponse {
  data: any[] | object;
  total?: number;
  page?: number;
  per_page?: number;
}
