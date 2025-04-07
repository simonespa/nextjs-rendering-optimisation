import cache from '@/cache';
import type { QueryFunctionContext } from '@tanstack/react-query';

// https://developer.mozilla.org/en-US/docs/Web/API/fetch
const DEFAULT_CONFIG: RequestInit = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
};

export async function clientFetcher(context: QueryFunctionContext) {
  const [baseUrl, path, headers] = context.queryKey;

  const response = await fetch(`${baseUrl}${path}`, {
    headers: headers as HeadersInit
  });

  throwErrorIfResponseNotOk(response);

  return response.json();
}

export async function serverFetcher(context: QueryFunctionContext) {
  let cacheHit = false;
  let responseJson;

  // read from cache first
  try {
    const responseString: string = (await cache.get(cacheKey)) as string;
    responseJson = JSON.parse(responseString);
  } catch (error) {} // eslint-disable-line no-empty

  // do a full fetch if the json is not in the cache
  if (responseJson) {
    cacheHit = true;
  } else {
    const response = await fetch(url, fetchOptions);
    throwErrorIfResponseNotOk(response);
    responseJson = await response.json();
  }

  const [baseUrl, path, headers] = context.queryKey;

  const response = await fetch(`${baseUrl}${path}`, {
    headers: headers as HeadersInit
  });

  throwErrorIfResponseNotOk(response);

  return response.json();
}

export function throwErrorIfResponseNotOk(response: Response): void {
  const { ok, status, statusText, url } = response;

  if (!ok) {
    let error: Error;

    if (status) {
      error = new Error(`[${status} - ${statusText}] ${url}`);
    } else {
      error = new Error(`[${statusText}] ${url}`);
    }

    throw error;
  }
}
