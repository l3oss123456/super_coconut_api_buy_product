import * as R from 'ramda';
import {
  SuccessResponse,
  ResponseTemplate,
} from '../interface/response/response.interface';

export default {
  Success: ({ results }: { results: SuccessResponse }): ResponseTemplate => {
    let _results = {};

    if (!R.isNil(results[`page`]) && !R.isNil(results[`per_page`])) {
      _results = {
        results: results[`data`] || [],
        total: results[`total`] || 0,
        page: results[`page`] || 1,
        per_page: results[`per_page`] || 10,
      };
    } else if (!R.isNil(results[`total`])) {
      _results = {
        results: results[`data`],
        total: results[`total`] || 0,
      };
    } else {
      _results = {
        results: results[`data`],
      };
    }

    return {
      code: 1000,
      description: `success`,
      data: _results,
    };
  },
  CreateSuccess: (): ResponseTemplate => {
    return {
      code: 1000,
      description: `success`,
    };
  },
  UpdateSuccess: (): ResponseTemplate => {
    return {
      code: 1000,
      description: `success`,
    };
  },
  DeleteSuccess: (): ResponseTemplate => {
    return {
      code: 1000,
      description: `success`,
    };
  },
};
