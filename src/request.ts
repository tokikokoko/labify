import getConfig from '@/config';

export const callApi = async (req: Request): Promise<Response> => {
  const config = await getConfig();
  req.headers.set('Authorization', `Bearer ${config.gitlabToken}`);

  let res = await fetch(req);
  const remainingRateLimit = res.headers.get('ratelimit-remaining');
  res.headers.forEach((value, key, _) => {
    console.debug(`${key}: ${value}`);
  });
  if (typeof remainingRateLimit === 'string') {
    console.info("Remainning RateLimit: ", remainingRateLimit);
  }
  return res;
}

export const getURL = async (path: string): Promise<URL> => {
  const config = await getConfig();
  return new URL(`https://${config.gitlabHostName}${config.gitlabApiBasePath}${path}`);
}