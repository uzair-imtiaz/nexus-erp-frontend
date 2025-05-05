import { useState } from "react";
import {
  getCallback,
  postCallback,
  putCallback,
  deleteCallback,
} from "../utils/network-helper";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const safeCall = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fn();
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getCallback,
    postCallback,
    putCallback,
    deleteCallback,
    safeCall,
    loading,
    error,
  };
};
