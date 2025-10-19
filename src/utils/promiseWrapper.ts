export const promiseWrapper = <T>(
    value: T,
    timeout: number = 200
  ): Promise<T> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(value);
      }, timeout);
    });
  };
  