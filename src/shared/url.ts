const replaceUrlParams = (
  endpoint: string,
  urlParams?: Record<string, string | number>,
) => {
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
  urlParams?: Record<string, string | number>,
  queryParams?: Record<string, string | number | boolean | undefined>,
) => {
  const url = replaceUrlParams(endpoint, urlParams);
  const params = new URLSearchParams();

  Object.entries(queryParams ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return query ? `${url}?${query}` : url;
};
