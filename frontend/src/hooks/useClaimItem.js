import { useState } from "react";
import api from "../utils/api";

const useClaimItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const claimItem = async (itemId) => {
    try {
      setLoading(true);
      setError("");

      const res = await api.put(`/status/found/${itemId}/claim`);
      return res.data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to claim item"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { claimItem, loading, error };
};

export default useClaimItem;
