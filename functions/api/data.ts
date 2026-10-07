import { errorResponse, json, snapshot, type RequestContext } from '../_lib/api';

export const onRequestGet = async ({ request, env }: RequestContext): Promise<Response> => {
  try {
    return json(await snapshot(request, env));
  } catch {
    return errorResponse('Shared site data is temporarily unavailable.', 503);
  }
};
