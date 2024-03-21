export interface MongodbDomainParameterInterface {
  model: any;
  filter?: object;
  data?: object | any[];
  page?: number;
  per_page?: number;
  sort_field?: string[];
  sort_order?: number[];
}

export interface MongodbDomainResponseInterface {
  description: string | object;
  data?: any;
  error?: any;
  total?: number;
}
