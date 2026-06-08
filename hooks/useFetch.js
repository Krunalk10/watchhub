import { useState, useEffect } from 'react';

export function useFetch(url, options) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('[v0] Fetching data from:', url);

        return new Promise(async (resolve, reject) => {
          try {
            const response = await fetch(url, {
              signal: abortController.signal,
              method: options?.method || 'GET',
              headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
              },
              ...(options?.body && { body: JSON.stringify(options.body) }),
            });

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();

            if (!result) {
              throw new Error('Empty response received');
            }

            setData(result);
            console.log('Successfully fetched data');
            resolve(result);
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            console.error(' Fetch error:', errorMsg);
            const error = new Error(errorMsg);
            setError(error);
            reject(error);
          } finally {
            setLoading(false);
          }
        });
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('[v0] Fetch request was cancelled');
          return;
        }
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error('[v0] Fetch error:', errorMsg);
        setError(new Error(errorMsg));
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url, options?.method, options?.headers]);

  return { data, loading, error };
}
