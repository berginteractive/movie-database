import { useEffect, useRef, useState } from "react";

const useFetch = <T,>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const requestIdRef = useRef(0);

  const fetchData = async () => {
    const requestId = ++requestIdRef.current;
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      if (requestId === requestIdRef.current) {
        setData(result);
      }
      return result;
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
      }
      return null;
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };
  const reset = () => {
    requestIdRef.current += 1;
    setData(null);
    setError(null);
    setLoading(false);
  };
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []);

  const refetch = () => {
    return fetchData();
  };

  return { data, loading, error, refetch, fetchData, reset };
};

export default useFetch;
