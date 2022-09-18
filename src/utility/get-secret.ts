import axios, { AxiosError, AxiosResponse } from "axios";

export type GetSecretConfig = {
  retries?: number;
  maxRetries?: number;
  delay?: number;
};
export type GetSecret = <T>(
  port: number,
  store: string,
  key: string,
  config?: GetSecretConfig,
  responseMapper?: (...args: unknown[]) => T
) => Promise<T | AxiosResponse | AxiosError>;

const sleep = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay);
  });

const getSecret: GetSecret = async <T>(
  port: number,
  store: string,
  key: string,
  config?: GetSecretConfig,
  responseMapper?: (...args: unknown[]) => T
) => {
  let res;
  try {
    res = await axios.get(
      `http://localhost:${port}/v1.0/secrets/${store}/${key}`
    );
  } catch (e) {
    if (!config) {
      throw e;
    }
    const { retries, maxRetries, delay } = {
      retries: 0,
      maxRetries: 10,
      delay: 2000,
      ...config,
    };

    if (retries >= maxRetries) {
      throw e;
    }

    await sleep(delay);

    return getSecret(
      port,
      store,
      key,
      { retries: retries + 1, maxRetries, delay },
      responseMapper
    );
  }
  return responseMapper ? responseMapper(res) : res;
};

export const getSecretFromDapr = {
  getSecret,
};
