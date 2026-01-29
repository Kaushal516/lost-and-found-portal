import useDashboardStats from "../../hooks/useDashboardStats";
import styles from "./Dashboard.module.css";
import DashboardCharts from "./DashboardCharts";

const Dashboard = () => {
  const { stats, loading } = useDashboardStats();

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.dashboard}>
      <h2>Admin Dashboard</h2>

      <div className={styles.cards}>
        <div className={styles.card}>Lost Items: {stats.totalLost}</div>
        <div className={styles.card}>Found Items: {stats.totalFound}</div>
        <div className={styles.card}>Active Items: {stats.activeFound}</div>
        <div className={styles.card}>Claimed Items: {stats.claimedFound}</div>
      </div>

      <DashboardCharts stats={stats} />
    </div>
  );
};

export default Dashboard;
