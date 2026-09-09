export type UrlParams = Record<string, string | number>;
export type QueryParams = Record<string, string | number | boolean | undefined>;

const replaceUrlParams = (endpoint: string, urlParams?: UrlParams) => {
  if (!urlParams) {
    return endpoint;
  }

  return Object.entries(urlParams).reduce(
    (url, [key, value]) =>
      url.replace(new RegExp(`:${key}\\b`, 'g'), encodeURIComponent(value)),
    endpoint,
  );
};

export const buildUrl = (
  endpoint: string,
  urlParams?: UrlParams,
  queryParams?: QueryParams,
) => {
  const url = replaceUrlParams(endpoint, urlParams);
  const params = new URLSearchParams();

  Object.entries(queryParams ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return query ? `${url}?${query}` : url;
};
