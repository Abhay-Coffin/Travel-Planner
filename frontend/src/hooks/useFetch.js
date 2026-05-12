import { useState, useEffect } from "react";
import axios from "axios";

import { BASE_URL } from "../utils/config";

const useFetch = (endpoint, queryParams = {}) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${BASE_URL}/${endpoint}`,
          {
            params: queryParams,
            signal: controller.signal,
          }
        );

        setData(response.data?.data || response.data);
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error(error);

          setError(
            error.response?.data?.message ||
              error.message ||
              "Something went wrong"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [endpoint, JSON.stringify(queryParams)]);

  return {
    data,
    error,
    loading,
  };
};

export default useFetch;