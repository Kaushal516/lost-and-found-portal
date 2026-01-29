import { useEffect, useState } from "react";
import api from "../utils/api";

const useDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then(res => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
};

export default useDashboardStats;
